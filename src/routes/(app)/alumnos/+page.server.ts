import { alumnosRepository } from '$lib/database/repositories/alumnos.repository';
import { createAlumnoHandler } from '$lib/handlers/alumnos.handlers';
import async from '$lib/utils/asyncHandler';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
    let {response, log} = locals
    let alumnos = await async(alumnosRepository.getAll(), log)

    return { alumnos: alumnos };
}) satisfies PageServerLoad;

export const actions = {
    createAlumno: createAlumnoHandler
} satisfies Actions