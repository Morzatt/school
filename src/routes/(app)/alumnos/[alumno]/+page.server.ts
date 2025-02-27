import { alumnosRepository, representantesAlumnosRepository, representantesRepository } from '$lib/database/repositories/alumnos.repository';
import async from '$lib/utils/asyncHandler';
import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { basePath } from '$lib';
import { db } from '$lib/database';
import DeleteRepresentanteModal from './DeleteRepresentanteModal.svelte';
import type { RepresentantesAlumnosInsertable, RepresentanteUpdateable } from '$lib/database/types';

export const load: PageServerLoad = (async ({ url, locals }) => {
    const { log, response } = locals;

    let cedula = getId(url.pathname)
    let dataResult = await async(alumnosRepository.getById(cedula), log)

    let representantes = await async(representantesAlumnosRepository.getRepresentantesByAlumno(cedula), log)

    let telefonosQuery = await async(
        db
            .selectFrom('representantes')
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