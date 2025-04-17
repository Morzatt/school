import { empleadosRepository } from '$lib/database/repositories/profesores.repository';
import async from '$lib/utils/asyncHandler';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals, url }) => {
    let { log } = locals;
    let id = getId(url.pathname) as string
    let empleado = await async(empleadosRepository.getById(id), log)

    if (!empleado) {
        return error(404, "El empleado no existe.")
    }
    return { empleado };
}) satisfies PageServerLoad;

function getId(url: string): string {
    return url.slice(url.lastIndexOf("/") + 1)
}