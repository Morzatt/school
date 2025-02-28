import { representantesRepository } from '$lib/database/repositories/alumnos.repository';
import async from '$lib/utils/asyncHandler';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = (async ({ url, locals }) => {

    return {}
});
