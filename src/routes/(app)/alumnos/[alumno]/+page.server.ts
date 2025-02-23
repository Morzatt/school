import { alumnosRepository } from '$lib/database/repositories/alumnos.repository';
import async from '$lib/utils/asyncHandler';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = (async ({ url, locals }) => {
    const { log, response } = locals;

    let cedula = getId(url.pathname)
    let dataResult = await async(alumnosRepository.getById(cedula) ,log)

    return {alumno: dataResult!};
});

function getId(url: string): string {
    return url.slice(url.lastIndexOf("/") + 1)
}
