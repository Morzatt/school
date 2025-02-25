import { alumnosRepository, representantesAlumnosRepository, representantesRepository } from '$lib/database/repositories/alumnos.repository';
import async from '$lib/utils/asyncHandler';
import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { basePath } from '$lib';

export const load: PageServerLoad = (async ({ url, locals }) => {
    const { log, response } = locals;

    let cedula = getId(url.pathname)
    let dataResult = await async(alumnosRepository.getById(cedula) ,log)

    let representantes = await async(representantesAlumnosRepository.getRepresentantesByAlumno(cedula), log)
    return { alumno: dataResult!, representantes: representantes };
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
