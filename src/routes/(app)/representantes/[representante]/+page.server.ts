import { db } from '$lib/database';
import { representantesRepository } from '$lib/database/repositories/alumnos.repository';
import async from '$lib/utils/asyncHandler';
import { error, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import path from "path"
import { printFunc } from '$lib/handlers/pdf';
import { createRepresentanteDocDef } from '$lib/handlers/pdf/alumnosDocuments';
import { existsSync, unlinkSync, writeFileSync } from 'fs';
import { mkdir, rm } from 'fs/promises';

export const load: PageServerLoad = (async ({ url, locals }) => {
    const { log, response } = locals;

    let cedula = getId(url.pathname)
    let representante = await async(representantesRepository.getById(cedula), log)

    if (!representante) {
        return error(404, "El representante no existe")
    }

    let alumnos = await async(
        db
        .selectFrom('alumnos')
        .innerJoin('representantes_alumnos', 'representantes_alumnos.id_alumno', 'alumnos.cedula_escolar')
        .where('representantes_alumnos.id_representante', "=", cedula)
        .selectAll()
        .execute()
    , log)

    return { representante, alumnos }
});

function getId(url: string): string {
    return url.slice(url.lastIndexOf("/") + 1)
}

export const actions = {
    delete: async ({ locals, request }) => {
        let { log, response } = locals;
        let data = await request.formData()
        let id = data.get('cedula_representante') as string

        let folderPath = path.join(process.cwd(), `/static/empleados/${id}`)
        let folderExists = existsSync(folderPath)
        if (folderExists) {
            await async(rm(folderPath, { recursive: true, force: true }), log)
        }
        await async(representantesRepository.delete(id), log)

        redirect(307, '/representantes')
    },

    edit: async ({ locals, request }) => {
        let { log, response } = locals;
        let data = await request.formData()

        let d = {
            grado_instruccion: data.get('grado_instruccion') as string | undefined,
            ocupacion: data.get('ocupacion') as string | undefined,
            direccion: data.get('direccion') as string | undefined,
            correo_electronico: data.get('correo_electronico') as string | undefined,
            cedula: data.get('cedula') as string,
            telefono_1: data.get('telefono_1') as string,
            telefono_2: data.get('telefono_2') as string,
        }

        await async(
            db.transaction().execute(async (trx) => {
                if (d.grado_instruccion) {
                    await trx.updateTable('representantes').set({ grado_instruccion: d.grado_instruccion }).where('cedula', '=', d.cedula).execute()
                }

                if (d.ocupacion) {
                    await trx.updateTable('representantes').set({ ocupacion: d.ocupacion }).where('cedula', '=', d.cedula).execute()
                }

                if (d.direccion) {
                    await trx.updateTable('representantes').set({ direccion: d.direccion }).where('cedula', '=', d.cedula).execute()
                }

                if (d.correo_electronico) {
                    await trx.updateTable('representantes').set({ correo_electronico: d.correo_electronico }).where('cedula', '=', d.cedula).execute()
                }

                if (d.telefono_1) {
                    await trx.updateTable('representantes').set({ telefono_1: d.telefono_1 }).where('cedula', '=', d.cedula).execute()
                }

                if (d.telefono_2) {
                    await trx.updateTable('representantes').set({ telefono_2: d.telefono_2 }).where('cedula', '=', d.cedula).execute()
                }
            })
        , log)

        return response.success('Datos actualizados correctamente')
    },

    printRepresentante: async ({ request, locals }) => {
        let { log, response } = locals;
        let data = await request.formData()
        let cedula = data.get('cedula') as string

        let representante = await async(representantesRepository.getById(cedula), log)
        if (!representante) {
            return response.error('El empleado no existe')
        }

        let alumnos = await async(
            db
                .selectFrom('alumnos')
                .innerJoin('representantes_alumnos', 'alumnos.cedula_escolar', 'representantes_alumnos.id_alumno')
                .where("representantes_alumnos.id_representante", '=', representante.cedula)
                .select(['representantes_alumnos.relacion'])
                .innerJoin('grados_cursados', 'grados_cursados.id_alumno', 'alumnos.cedula_escolar')
                .select((eb) => [
                    eb.fn.jsonAgg(
                        eb.fn.toJson('grados_cursados')
                    ).as('grados_cursados'),
                ])
                .selectAll(['alumnos'])
                .groupBy(['alumnos.cedula_escolar', 'representantes_alumnos.relacion'])
                .execute()
            , log)

        let timeId = new Date().toISOString().replaceAll(' ', '').replaceAll(':', '').replaceAll('-', '').replaceAll('.', '')
        let documentId = `${representante.cedula}_${timeId}`
        let temporalPath = path.join(process.cwd(), `static/constancias/empleados/temporal/representante_${documentId}.pdf`)

        printFunc(
            createRepresentanteDocDef(representante, alumnos),
            temporalPath
        )

        setTimeout(() => {
            unlinkSync(temporalPath)
        }, 10000)

        return response.success('Documento creado correctamente', { documentoId: documentId })
    },

    updateFotoPerfil: async ({ locals, request }) => {
        let { log, response } = locals;
        let data = await request.formData();

        let documento = {
            cedula_representante: data.get('cedula_representante') as string,
            archivo: data.get('archivo') as File,
        }

        let representante = await async(representantesRepository.getById(documento.cedula_representante), log)

        let folderPath = path.join(process.cwd(), `/static/representantes/${documento.cedula_representante}`)
        let folderExists = existsSync(folderPath)
        if (!folderExists) {
            await async(mkdir(folderPath), log)
        }

        let archivoPath: string;
        if (documento.archivo && documento.archivo.size > 0) {
            let fileExtension = documento.archivo.name.slice(documento.archivo.name.lastIndexOf('.'))
            let fileName = `foto_perfil_${documento.cedula_representante}${fileExtension}`
            let filePath = path.join(folderPath, fileName)

            if (representante && representante.foto_path) {
                let fileExists = existsSync(path.join(process.cwd(), '/static', representante.foto_path))
                if (fileExists) {
                    unlinkSync(path.join(process.cwd(), '/static', representante.foto_path))
                }
            }

            writeFileSync(filePath, Buffer.from(await documento.archivo.arrayBuffer()));
            archivoPath = path.join(`/representantes/${documento.cedula_representante}`, fileName)
        } else {
            return response.error('El archivo esta vacio')
        }

        db
        .updateTable('representantes')
        .set({
            foto_path: archivoPath,
        })
        .where('representantes.cedula', '=', documento.cedula_representante)
        .execute()

        return response.success('Archivo subido exitosamente')
    },
} satisfies Actions