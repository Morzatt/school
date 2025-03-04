import { gradosRepository } from '$lib/database/repositories/grados.repository';
import type { GradoID } from '$lib/database/types';
import async from '$lib/utils/asyncHandler';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals, url }) => {
    let { log } = locals
    let id = getId(url.pathname) as GradoID
    let grado = await async(gradosRepository.getById(id), log)

    return {grado};
}) satisfies PageServerLoad;

function getId(url: string): string {
    return url.slice(url.lastIndexOf("/") + 1)
}