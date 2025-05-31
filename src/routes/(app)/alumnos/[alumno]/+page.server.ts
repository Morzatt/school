import { alumnosRepository, representantesAlumnosRepository, representantesRepository } from '$lib/database/repositories/alumnos.repository';
import async from '$lib/utils/asyncHandler';
import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { basePath } from '$lib';
import { db } from '$lib/database';
import type { AlumnoUpdateable, GradoID, GradoInsertable, Niveles, Numeros, RepresentantesAlumnosInsertable, RepresentanteUpdateable, Secciones, TiposDocumentos, Turnos } from '$lib/database/types';
import { insertAulaSchema, newValidationFailObject, validateObject } from '$lib/utils/validators';
import { createGradoId, formatGrado } from '$lib/utils/createGradoId';
import { gradosRepository } from '$lib/database/repositories/grados.repository';
import { fail } from '@sveltejs/kit';
import { getAceptacion, getBuenaConducta, getConstanciaEstudio, getConstanciaInscripcion, getConstanciaRetiro, printAlumnoHandler, retirarAlumnoHandler } from '$lib/handlers/alumnos.handlers';
import { existsSync, statSync, unlinkSync, writeFileSync } from "fs"
import fs from "fs"
import path from "path"
import { mkdir, rm } from 'fs/promises';
import type pino from 'pino';
import { error } from 'console';

export const load: PageServerLoad = (async ({ url, locals }) => {
    const { log, response } = locals;

    let cedula = getId(url.pathname)
    let dataResult = await async(
        db.selectFrom('alumnos')
        .leftJoin('grados_alumnos', 'grados_alumnos.id_alumno', 'alumnos.cedula_escolar')
        .leftJoin('grados', 'grados_alumnos.id_grado', 'grados.id_grado')
        .selectAll()
        .where('alumnos.cedula_escolar', '=', cedula)
        .executeTakeFirst()
    , log)

    if (!dataResult) {
        error(404, 'El alumno no existe')
    }

    let representantes = await async(representantesAlumnosRepository.getRepresentantesByAlumno(cedula), log)

    let familiares = await async(
        db.selectFrom('familiares_autorizados')
        .innerJoin('familiares_alumnos', 'familiares_alumnos.id_familiar', 'familiares_autorizados.cedula')
        .selectAll()
        .where('familiares_alumnos.id_alumno', "=", cedula)
        .execute()
    , log)

    let grados_cursados = await async(
        db
        .selectFrom('grados_cursados')
        .selectAll()
        .where('grados_cursados.id_alumno', '=', cedula)
        .execute()
    , log)

    let documentos = await async(
        db.selectFrom('documentos_alumnos')
        .selectAll()
        .where('documentos_alumnos.id_alumno', '=', dataResult!.cedula_escolar)
        .execute()
    ,log)

    return { alumno: dataResult!, representantes: representantes, familiares, grados_cursados, documentos};
});

function getId(url: string): string {
    return url.slice(url.lastIndexOf("/") + 1)
}

export const actions = {
    deleteFamiliar: async ({ request, locals }) => {
        let { response, log } = locals
        let data = await request.formData()
        let cedula_familiar = data.get("cedula_familiar") as string
        let cedula_alumno = data.get("cedula_alumno") as string

        await async(
            db
            .deleteFrom('familiares_alumnos')
            .where((eb) => eb.and([
                eb('familiares_alumnos.id_alumno', '=', cedula_alumno),
                eb('familiares_alumnos.id_familiar', '=', cedula_familiar)
            ]))
            .execute()
        , log)

        return response.success('Familiar correctamente eliminado')
    },

    delete: async ({ request, locals }) => {
        let { response, log } = locals
        let cedula_escolar = (await request.formData()).get("cedula_escolar") as string

        let folderPath = path.join(process.cwd(), `/static/alumnos/${cedula_escolar}`)
        let folderExists = existsSync(folderPath)
        if (folderExists) {
            await async(rm(folderPath, { recursive: true, force: true }), log)
        }
        await async(alumnosRepository.delete(cedula_escolar), log)
        redirect(307, `${basePath}/alumnos`)
    },

    editAula: async ({ locals, request }) => {
        let { response, log } = locals
        let data = await request.formData()

        let aula = {
            numero: data.get('numero') as Numeros,
            nivel: data.get('nivel') as Niveles,
            seccion: data.get('seccion') as Secciones,
            turno: data.get('turno') as Turnos,
        } satisfies Omit<Omit<GradoInsertable, "id_grado">, "profesor"> 

        let idAlumno = data.get("cedula_escolar") as string

        let validation = validateObject(aula, insertAulaSchema.omit({ profesor: true }))
        if (!validation.success) {
            return newValidationFailObject(validation.error, log)
        }

        let alumno = await async(alumnosRepository.getById(idAlumno), log)

        if (!alumno || alumno.estado === "Retirado") {
            return response.error('El alumno se encuentra retirado de la institución')
        }

        let gradoID = createGradoId(aula) as GradoID

        let gradoFromDB = await async(gradosRepository.getById(gradoID), log)
        if (!gradoFromDB) {
            return fail(403, response.error('El aula no existe'))
        }

        let gradoAlumno = await async(
            db.selectFrom('grados')
                .leftJoin('grados_alumnos', 'grados_alumnos.id_grado', 'grados.id_grado')
                .selectAll()
                .where('grados_alumnos.id_alumno', '=', idAlumno)
                .executeTakeFirst()
        , log)
        
        if (gradoAlumno) {
            if (gradoAlumno.nivel === "Primaria" && gradoFromDB.nivel === "Inicial") {
                return fail(403, response.error('No se puede asignar al alumno a un nivel inferior al actual'))
            }

            if ((gradoAlumno.nivel === "Inicial" && gradoFromDB.nivel === "Inicial") && (parseInt(gradoAlumno.numero) > parseInt(gradoFromDB.numero))) {
                return fail(403, response.error('No se puede asignar al alumno a un grado inferior al actual'))
            }

            if ((gradoAlumno.nivel === "Primaria" && gradoFromDB.nivel === "Primaria") && (parseInt(gradoAlumno.numero) > parseInt(gradoFromDB.numero))) {
                return fail(403, response.error('No se puede asignar al alumno a un grado inferior al actual'))
            }
        }

        await async(
            db.transaction().execute(async (trx) => {
                let assc = await trx.selectFrom('grados_alumnos').selectAll().where('grados_alumnos.id_alumno', '=', idAlumno).executeTakeFirst()

                if (assc) {
                    await trx.deleteFrom('grados_alumnos').where('grados_alumnos.id_alumno', '=', idAlumno).execute()
                }

                await trx.insertInto("grados_alumnos").values({
                    id_alumno: idAlumno,
                    id_grado: gradoID
                }).returningAll().executeTakeFirst()

                await trx.updateTable('grados_cursados')
                    .set({ estado: "Finalizado" })
                    .where('grados_cursados.id_alumno', '=', idAlumno)
                    .execute()

                await trx.insertInto('grados_cursados').values({
                    id_alumno: idAlumno,
                    fecha: new Date().toLocaleDateString(),
                    grado: formatGrado(gradoFromDB),
                    estado: "En Curso"
                }).execute()
            })
        , log)

        return response.success('Alumno añadido al aula correctamente.')
    },

    edit: async ({locals, request}) => {
        let { response, log } = locals
        let data = await request.formData()

        let id = data.get("alumno") as string
        let alumno = {
            cedula_escolar: data.get("cedula_escolar") as string
        } satisfies AlumnoUpdateable

        let alumnoFromDB = await async(alumnosRepository.getById(alumno.cedula_escolar), log)
        if (alumnoFromDB) {
            return response.error('La identificación del alumno ya existe dentro de la base de datos.')
        }

        await async(alumnosRepository.update({ cedula_escolar: alumno.cedula_escolar }, id), log)

        let folderPath = path.join(process.cwd(), `/static/alumnos/${id}`)
        let folderExists = existsSync(folderPath)
        if (!folderExists) {
            return response.error('La carpeta de documentos del alumno no existe.')
        }
        if (!statSync(folderPath).isDirectory()) {
            console.error(`Error: Path is not a directory: ${folderPath}`);
            return;
        }

        await processDirectory(folderPath, id, alumno.cedula_escolar, log)
        await async(fs.promises.rename(folderPath, path.join(process.cwd(), `/static/alumnos/${alumno.cedula_escolar}`)), log)

        await async(
            db.transaction().execute(async (trx) => {
                let documentos = await trx.selectFrom('documentos_alumnos').selectAll()
                .where('documentos_alumnos.id_alumno', '=', alumno.cedula_escolar)
                .execute()

                if (!documentos) {
                    return
                }

                for (let i of documentos) {
                    let newPath = i.path.replaceAll(id, alumno.cedula_escolar)

                    await trx
                    .updateTable('documentos_alumnos')
                    .set({ path: newPath })
                    .where((eb) => eb.and([
                        eb('documentos_alumnos.id_alumno', '=', i.id_alumno),
                        eb('documentos_alumnos.tipo_documento', '=', i.tipo_documento)
                    ]))
                    .executeTakeFirst()
                }
            })
        ,log)

        redirect(307, `${basePath}/alumnos/${alumno.cedula_escolar}`)
    },

    asociarRepresentante: async ({request, locals}) => {
        let { response, log } = locals
        let data = await request.formData()
        let rep = {
            id_representante: data.get("cedula_representante") as string,
            id_alumno: data.get("cedula_escolar") as string,
            relacion: data.get("relacion") as string,
        } as RepresentantesAlumnosInsertable
        let representantes = await async(representantesAlumnosRepository.getRepresentantesByAlumno(rep.id_alumno) ,log)
        if (representantes) {
            if (representantes.length > 2) {
                return response.error('El Alumno ya tiene el máximo (2) de representantes asociados.')
            }
            for (let i = 0; i < representantes.length; i++) {
                if (representantes[i].cedula === rep.id_representante) {
                    return response.error('El Representante ya se encuentra asociado al Alumno')
                }
            }
        }
        let representante = await async(representantesRepository.getById(rep.id_representante), log)
        if (!representante) {
            return response.error('El representante no se encuentra registrado en la base de datos. Por favor, dirigirse al apartado de Registrar Representante')
        }
        await async(representantesAlumnosRepository.create(rep), log)
        return response.success("El representante fue asociado exitosamente")
    },

    deleteRepresentante: async ({ request, locals }) => {
        let { response, log } = locals
        let data = await request.formData()
        let cedulas = {
            representante: data.get("cedula_representante") as string,
            alumno: data.get("cedula_alumno") as string,
        }
        await async(representantesAlumnosRepository.delete(cedulas.representante, cedulas.alumno), log)
        return response.success('Representante Eliminado Correctamente.')
    },

    editRepresentante: async ({ request, locals }) => {
        let { response, log } = locals
        let data = await request.formData()

        let cedula = data.get("id_representante") as string
        
        let edit = {
            nombre: data.get("nombre") as string,
            apellido: data.get("apellido") as string,
            direccion: data.get("direccion") as string,
            correo_electronico: data.get("correo_electronico") as string,
        } satisfies RepresentanteUpdateable

        let telefonos = {
            telefono_1: data.get("telefono_1") as string,
            telefono_2: data.get("telefono_2") as string,
        }

        if (telefonos.telefono_1 || telefonos.telefono_2) {
            if (telefonos.telefono_1) {
                await async(representantesRepository.update({ telefono_1: telefonos.telefono_1 }, cedula), log)
            }

            if (telefonos.telefono_2) {
                await async(representantesRepository.update({ telefono_2: telefonos.telefono_2 }, cedula), log)
            }

            return response.success('Telefonos actualizados correctamente.')
        }

        await async(representantesRepository.update(edit, cedula), log)
    },

    // CONSTANCIAS
    getBuenaConducta: getBuenaConducta,
    getConstanciaEstudio: getConstanciaEstudio,
    getAceptacion: getAceptacion,
    getConstanciaInscripcion: getConstanciaInscripcion,
    getConstanciaRetiro: getConstanciaRetiro,
    retirar: retirarAlumnoHandler,
    updateDocument: async ({ locals, request }) => {
        let { log, response } = locals;
        let data = await request.formData();

        let documento = {
            tipo_documento: data.get('tipo_documento'),
            id_alumno: data.get('id_alumno'),
            archivo: data.get('archivo') as File,
        }

        let documentoFromDB = await async(
            db.selectFrom("documentos_alumnos")
            .selectAll()
            .where((eb) => eb.and([
                eb('documentos_alumnos.id_alumno', '=', documento.id_alumno as string),
                eb('documentos_alumnos.tipo_documento', '=', documento.tipo_documento as TiposDocumentos)
            ]))
            .executeTakeFirst()
        , log)

        let folderPath = path.join(process.cwd(), `/static/alumnos/${documento.id_alumno}`)
        let folderExists = existsSync(folderPath)
        if (!folderExists) {
            await async(mkdir(folderPath), log)
        }

        let archivoPath: string;
        if (documento.archivo && documento.archivo.size > 0) {
            let fileExtension = documento.archivo.name.slice(documento.archivo.name.lastIndexOf('.'))
            let fileName = `${documento.tipo_documento}_${documento.id_alumno}${fileExtension}`
            let filePath = path.join(folderPath, fileName)
            let fileExists = existsSync(filePath)

            if (fileExists) {
                unlinkSync(filePath)
            }

            writeFileSync(filePath, Buffer.from(await documento.archivo.arrayBuffer()));

            archivoPath = path.join(`/alumnos/${documento.id_alumno}`, fileName)
        } else {
            return response.error('El archivo esta vacio')
        }

        if (!documentoFromDB) {
            db.insertInto('documentos_alumnos')
            .values({
                id_alumno: documento.id_alumno as string,
                tipo_documento: documento.tipo_documento as TiposDocumentos,
                path: archivoPath,
            })
            .execute()
        } else {
            db
            .updateTable('documentos_alumnos')
            .set({
                path: archivoPath,
                ultima_edicion: new Date()
            })
            .where((eb) => eb.and([
                eb('documentos_alumnos.id_alumno', '=', documento.id_alumno as string),
                eb('documentos_alumnos.tipo_documento', '=', documento.tipo_documento as TiposDocumentos)
            ]))
            .execute()
        }

        return response.success('Archivo subido exitosamente')
    },

    printAlumno: printAlumnoHandler
} satisfies Actions


function extractOldNumber(number: string) {
    return number.slice(number.lastIndexOf('_')+1)
}


async function processDirectory(currentPath: string, string1: string, string2: string, log: pino.Logger<never, boolean>) {
    try {
        const items = await async(fs.promises.readdir(currentPath), log);


        if (!items) {
            return
        }

        // Process items in reverse order to avoid issues with renaming directories
        // that are parents of items further down the list.
        for (let i = items.length - 1; i >= 0; i--) {
            const item = items[i];
            const oldFullPath = path.join(currentPath, item);

            // Check if the item's name includes string1
            if (item.includes(string1)) {
                const newName = item.replace(new RegExp(escapeRegExp(string1), 'g'), string2);
                const newFullPath = path.join(currentPath, newName);

                try {
                    await async(fs.promises.rename(oldFullPath, newFullPath), log);
                } catch (renameErr) {
                    console.error(`Error renaming "${oldFullPath}" to "${newFullPath}": ${renameErr.message}`);
                }

                // If it was a directory and successfully renamed, we need to continue
                // processing its contents from the new path.
                const stat = await async(fs.promises.stat(newFullPath), log);
                if (stat && stat.isDirectory()) {
                    await processDirectory(newFullPath, string1, string2, log);
                }
            } else {
                // If it's a directory but its name doesn't contain string1,
                // we still need to recurse into it to find matching files/folders inside.
                const stat = await async(fs.promises.stat(oldFullPath), log);
                if (stat && stat.isDirectory()) {
                    await processDirectory(oldFullPath, string1, string2, log);
                }
            }
        }
    } catch (err) {
        console.error(`Error processing directory "${currentPath}": ${err.message}`);
    }
}

/**
 * Escapes special characters in a string to be used safely in a RegExp constructor.
 * @param {string} str The string to escape.
 * @returns {string} The escaped string.
 */
function escapeRegExp(str: string) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the matched substring
}