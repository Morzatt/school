import { alumnosRepository, representantesAlumnosRepository, representantesRepository } from '$lib/database/repositories/alumnos.repository';
import async from '$lib/utils/asyncHandler';
import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { basePath } from '$lib';
import { db } from '$lib/database';

export const load: PageServerLoad = (async ({ url, locals }) => {
    const { log, response } = locals;

    let cedula = getId(url.pathname)
    let dataResult = await async(alumnosRepository.getById(cedula) ,log)

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
    }
} satisfies Actions
