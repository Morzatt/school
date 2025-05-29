import { alumnosRepository, representantesRepository } from '$lib/database/repositories/alumnos.repository';
import async, { handleError } from '$lib/utils/asyncHandler';
import { fail, error, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getFormData } from '$lib/utils/getFormData';
import { db } from '$lib/database';
import { getAge } from '$lib/utils/getAge';
import { validateObject, newValidationFailObject } from '$lib/utils/validators';
import { AlumnoSchema } from '$lib/utils/validators';
import { existsSync, writeFileSync } from 'fs';
import { mkdir } from "fs/promises"
import path from "path"
import type { DocumentoAlumno, DocumentoAlumnoInsertable } from '$lib/database/types';

export const load = (async ({ url, locals }) => {
    let { log } = locals
    let [ representante, relacion, hasCedula ] = url.searchParams.values()

    let rep = await async(representantesRepository.getById(representante), log)

    if (!rep) {
        error(404, "El representante no existe.")
    }

    return { rep, hasCedula, relacion };
}) satisfies PageServerLoad;

export const actions = {
    createAlumno: async ({ request, locals, url }) => {
        let { log, response } = locals;
        let data = await request.formData()

        let alumno = {
            cedula: '',
            cedula_madre: '',
            nacionalidad: '',
            primer_nombre: '',
            segundo_nombre: '',
            primer_apellido: '',
            segundo_apellido: '',
            fecha_nacimiento: '',
            sexo: '',
            lateralidad: '',
            peso: '',
            estatura: '',
            condicion: '',
            detalles_condicion: '',
            calzado: '',
            camisa: '',
            pantalon: '',

            hasCedula: "",
            representante: "",
            relacion: ""
        }
        getFormData(alumno, request, null, data)

        let auth1 = {
            cedula: data.get('cedula_auth_1') as string,
            nombre: data.get('nombre_auth_1') as string,
            apellido: data.get('apellido_auth_1') as string,
            sexo: data.get('sexo_auth_1') as string,
        }

        let auth2 = {
            cedula: data.get('cedula_auth_2') as string,
            nombre: data.get('nombre_auth_2') as string,
            apellido: data.get('apellido_auth_2') as string,
            sexo: data.get('sexo_auth_2') as string
        }

        let auth3 = {
            cedula: data.get('cedula_auth_3') as string,
            nombre: data.get('nombre_auth_3') as string,
            apellido: data.get('apellido_auth_3') as string,
            sexo: data.get('sexo_auth_3') as string,
        }

        let familiares = [auth1, auth2, auth3]

        // Validate the form data
        let schema = alumno.hasCedula === "true" ? AlumnoSchema.omit({ cedula_madre: true, condicion: true, detalles_condicion: true }) : AlumnoSchema.omit({ condicion: true, cedula: true, detalles_condicion: true })
        const validationResult = validateObject(alumno, schema);
        if (!validationResult.success) {
            return newValidationFailObject(validationResult.error, log);
        }

        let representante = await async(representantesRepository.getById(alumno.representante), log)

        if (!representante) {
            return response.error('El representante no existe.')
        }

        if (alumno.hasCedula === 'false') {
            if (alumno.relacion === 'Madre') {
                let numberOfHijos = await async(
                    db
                    .selectFrom("representantes_alumnos")
                    .innerJoin('alumnos', 'representantes_alumnos.id_alumno', "alumnos.cedula_escolar")
                    .select(['alumnos.cedula_escolar', 'alumnos.fecha_nacimiento'])
                    .execute()
                , log)

                let hijosSameYear: number = 1;
                if (numberOfHijos && numberOfHijos?.length > 0) {
                    for (let i of numberOfHijos) {
                        if (new Date(i.fecha_nacimiento).getFullYear() === new Date(alumno.fecha_nacimiento).getFullYear()) {
                            hijosSameYear++
                        }
                    }
                }

                alumno.cedula = `${hijosSameYear}${new Date(alumno.fecha_nacimiento).toLocaleString('es', { year: "2-digit" })}${alumno.representante}`
            } else { 
                let numberOfHijos = await async(
                    db
                    .selectFrom("alumnos")
                    .select(['alumnos.cedula_escolar'])
                    .where('alumnos.cedula_escolar', 'like', `%${new Date(alumno.fecha_nacimiento).toLocaleString('es', { year: "2-digit" })}${alumno.cedula_madre}%`)
                    .execute()
                , log)

                let maxNumber = 0;
                if (numberOfHijos && numberOfHijos.length > 0) {
                    for (let i of numberOfHijos) {
                        let numberChild = parseInt(i.cedula_escolar.split(`${alumno.fecha_nacimiento.slice(2)}${alumno.cedula_madre}`)[0]);
                        if (numberChild >= maxNumber) {
                            maxNumber = parseInt(i.cedula_escolar[0])
                        }
                    }
                }

                alumno.cedula = `${maxNumber + 1}${new Date(alumno.fecha_nacimiento).toLocaleString('es', { year: "2-digit" })}${alumno.cedula_madre}`
            }
        }

        let alumnoFromDB = await async(alumnosRepository.getById(alumno.cedula), log)
        if (alumnoFromDB) {
            return response.error('La cedula escolar especificada ya se encuentra asignada a un alumno.')
        }

        let partida_nacimiento = data.get('partida_nacimiento') as File
        let foto_carnet = data.get('foto_carnet') as File
        let cedula_estudiante = data.get('cedula_estudiante') as File
        let cedula_representante = data.get('cedula_representante') as File
        let certificado_vacunacion = data.get('certificado_vacuna') as File

        type FileTypes = 'partida_nacimiento' | 'foto_carnet' | 'cedula_estudiante' | 'cedula_representante' | 'certificado_vacunacion'

        let files: { name: FileTypes, file: File }[] = [
            {
                name: 'partida_nacimiento',
                file: partida_nacimiento
            },
            {
                name: 'foto_carnet',
                file: foto_carnet
            },
            {
                name: 'cedula_estudiante',
                file: cedula_estudiante
            },
            {
                name: 'cedula_representante',
                file: cedula_representante
            },
            {
                name: 'certificado_vacunacion',
                file: certificado_vacunacion
            },
        ]

        let folderPath = path.join(process.cwd(), `/static/alumnos/${alumno.cedula}`)
        let folderExists = existsSync(folderPath)
        if (!folderExists) {
            await async(mkdir(folderPath), log)
        }

        let documents: DocumentoAlumnoInsertable[] = []
        let imgExt = ['.jpg', '.jpeg', '.png', '.webp']
        for (let i of files) {
            if (i.file && i.file.size > 0) {
                let fileExtension = i.file.name.slice(i.file.name.lastIndexOf('.'))
                let fileName = `${i.name}_${alumno.cedula}${fileExtension}`
                let filePath = path.join(folderPath, fileName)
                writeFileSync(filePath, Buffer.from(await i.file.arrayBuffer()));

                documents.push({
                    path: path.join(`/alumnos/${alumno.cedula}`, fileName),
                    id_alumno: alumno.cedula,
                    tipo_documento: i.name,
                })
            }
        }

        let result = await async (
            db.transaction().execute(async (trx) => {
                await trx.insertInto('alumnos').values({
                    cedula_escolar: alumno.cedula,
                    nacionalidad: alumno.nacionalidad as "Venezolano" | "Extranjero",
                    primer_nombre: alumno.primer_nombre,
                    segundo_nombre: alumno.segundo_nombre,
                    primer_apellido: alumno.primer_apellido,
                    segundo_apellido: alumno.segundo_apellido,
                    fecha_nacimiento: alumno.fecha_nacimiento,
                    edad: Number(getAge(alumno.fecha_nacimiento)), // Converting to number to fix the type error
                    sexo: alumno.sexo as "Masculino" | "Femenino",
                    lateralidad: alumno.lateralidad as "Diestro" | "Zurdo",
                    peso: alumno.peso,
                    estatura: alumno.estatura,
                    // condicion: '',
                    // detalles_condicion: '',
                    calzado: alumno.calzado,
                    camisa: alumno.camisa,
                    pantalon: alumno.pantalon, 
                    // direccion: ""
                }).execute()

                for (let i of familiares) {
                    let familiar = await trx.selectFrom('familiares_autorizados').selectAll().where('familiares_autorizados.cedula', '=', i.cedula).executeTakeFirst()

                    if (familiar) {
                        await trx.insertInto('familiares_alumnos').values({
                            id_alumno: alumno.cedula,
                            id_familiar: i.cedula
                        }).execute()
                        return
                    }

                    if (i.cedula && i.nombre && i.apellido && i.sexo) {
                        await trx.insertInto('familiares_autorizados').values({
                            cedula: i.cedula,
                            nombre: i.nombre,
                            apellido: i.apellido,
                            sexo: i.sexo,
                        }).execute()

                        await trx.insertInto('familiares_alumnos').values({
                            id_alumno: alumno.cedula,
                            id_familiar: i.cedula
                        }).execute()
                    }
                }


                await trx.insertInto("representantes_alumnos").values({
                    id_alumno: alumno.cedula,
                    id_representante: alumno.representante,
                    relacion: alumno.relacion
                }).execute()


                if (documents.length > 0) {
                    for (let i of documents) {
                        await trx.insertInto("documentos_alumnos")
                        .values(i)
                        .execute()
                    }
                }
            })
        , log)

        redirect(303, "/alumnos")
    },
} satisfies Actions

function createTimeId(date: Date) {
  return date.toISOString().replaceAll(' ', '').replaceAll(':', '').replaceAll('-', '').replaceAll('.', '')
}