import { representantesRepository } from '$lib/database/repositories/alumnos.repository';
import async from '$lib/utils/asyncHandler';
import { error, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getFormData } from '$lib/utils/getFormData';
import { db } from '$lib/database';
import { getAge } from '$lib/utils/getAge';
import { validateObject, newValidationFailObject } from '$lib/utils/validators';
import { AlumnoSchema } from '$lib/utils/validators';

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
        let schema = alumno.hasCedula === "true" ? AlumnoSchema.omit({ condicion: true, detalles_condicion: true }) : AlumnoSchema.omit({ condicion: true, cedula: true, detalles_condicion: true })
        const validationResult = validateObject(alumno, schema);
        if (!validationResult.success) {
            return newValidationFailObject(validationResult.error, log);
        }

        let representante = await async(representantesRepository.getById(alumno.representante), log)

        if (!representante) {
            return response.error('El representante no existe.')
        }

        if (alumno.hasCedula === 'false') {
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
            })
        , log)

        redirect(303, "/alumnos")
    },
} satisfies Actions