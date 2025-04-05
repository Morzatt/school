import { representantesRepository } from '$lib/database/repositories/alumnos.repository';
import async from '$lib/utils/asyncHandler';
import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

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

        console.log(data)
    },
} satisfies Actions