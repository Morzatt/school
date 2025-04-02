import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {

    return { usuario: locals.usuario };
}) satisfies PageServerLoad;