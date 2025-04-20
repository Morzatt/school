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

            entrega_cedula: '',
            entrega_nombre: '',
            entrega_apellido: '',
            entrega_sexo: '',
            salida_cedula: '',
            salida_nombre: '',
            salida_apellido: '',
            salida_sexo: '',
            adicional_cedula: '',
            adicional_nombre: '',
            adicional_apellido: '',
            adicional_sexo: '',

            hasCedula: "",
            representante: "",
            relacion: ""
        }
        getFormData(alumno, request, null, data)

        // Validate the form data
        const validationResult = validateObject(alumno, AlumnoSchema);
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

                await trx.insertInto('familiares_alumnos').values({
                    cedula: alumno.entrega_cedula,
                    nombre: alumno.entrega_nombre,
                    apellido: alumno.entrega_apellido,
                    sexo: alumno.entrega_sexo,
                    id_alumno: alumno.cedula,
                    type: "Entrega"
                }).execute()

                await trx.insertInto('familiares_alumnos').values({
                    cedula: alumno.salida_cedula,
                    nombre: alumno.salida_nombre,
                    apellido: alumno.salida_apellido,
                    sexo: alumno.salida_sexo,
                    id_alumno: alumno.cedula,
                    type: "Salida"
                }).execute()

                await trx.insertInto('familiares_alumnos').values({
                    cedula: alumno.adicional_cedula,
                    nombre: alumno.adicional_nombre,
                    apellido: alumno.adicional_apellido,
                    sexo: alumno.adicional_sexo,
                    id_alumno: alumno.cedula,
                    type: "Adicional"
                }).execute()

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