import { alumnosRepository, representantesAlumnosRepository, representantesRepository } from '$lib/database/repositories/alumnos.repository';
import async from '$lib/utils/asyncHandler';
import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { basePath } from '$lib';
import { db } from '$lib/database';
import type { AlumnoUpdateable, GradoID, GradoInsertable, Niveles, Numeros, RepresentantesAlumnosInsertable, RepresentanteUpdateable, Secciones, Turnos } from '$lib/database/types';
import { insertAulaSchema, newValidationFailObject, validateObject } from '$lib/utils/validators';
import { createGradoId } from '$lib/utils/createGradoId';
import { gradosAlumnosRepository, gradosRepository } from '$lib/database/repositories/grados.repository';
import { fail } from '@sveltejs/kit';

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

    let representantes = await async(representantesAlumnosRepository.getRepresentantesByAlumno(cedula), log)

    let telefonosQuery = await async(
        db
            .selectFrom('representantes')
            .innerJoin("representantes_alumnos", "representantes.cedula", "representantes_alumnos.id_representante")
            .where("representantes_alumnos.id_alumno", "=", cedula)
            .leftJoin('telefonos_representantes', "representantes.cedula", "telefonos_representantes.representante")
            .select([
                'representantes.cedula as representante',
                (eb) =>
                    eb.fn.agg("array_agg", [eb.ref('telefonos_representantes.numero_telefono')])
                        .as('telefonos')
            ]).groupBy('representantes.cedula')
            .execute()
        , log)

    return { alumno: dataResult!, representantes: representantes, telefonos: telefonosQuery };
});

function getId(url: string): string {
    return url.slice(url.lastIndexOf("/") + 1)
}

export const actions = {
    delete: async ({ request, locals }) => {
        let { response, log } = locals
        let cedula_escolar = (await request.formData()).get("cedula_escolar") as string
        // console.log(cedula_escolar)
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

        let validation = validateObject(aula, insertAulaSchema.omit({ profesor: true }))
        if (!validation.success) {
            return newValidationFailObject(validation.error, log)
        }

        let gradoID = createGradoId(aula) as GradoID
        console.log(gradoID)

        let gradoFromDB = await async(gradosRepository.getById(gradoID), log)
        if (!gradoFromDB) {
            return fail(403, response.error('El aula no existe'))
        }

        await async(gradosAlumnosRepository.create({
            id_alumno: data.get("cedula_escolar") as string,
            id_grado: gradoID
        }), log)

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

        await async(representantesRepository.update(edit, cedula), log)
    },


    editTelefonos: async ({ request, locals }) => {
        let { response, log } = locals
        let data = await request.formData()
        let id_representante = data.get("id_representante") as string
        for (let i of data) {
            if (!i[0].includes("representante")) {
                let old = extractOldNumber(i[0]) as string
                let n = i[1] as string
                await async(
                    db.updateTable("telefonos_representantes")
                        .set({ numero_telefono: n })
                        .where((eb) => eb.and([
                            eb("telefonos_representantes.representante", "=", id_representante),
                            eb("telefonos_representantes.numero_telefono", "=", old)
                        ]))
                        .execute()
                    , log)
            }
        }
    }
} satisfies Actions


function extractOldNumber(number: string) {
    return number.slice(number.lastIndexOf('_')+1)
}