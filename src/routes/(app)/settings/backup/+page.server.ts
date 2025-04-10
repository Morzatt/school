import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async () => {
    return { puntos: [1,2] };
}) satisfies PageServerLoad;

export const actions = {
    createBackup: async({ locals, request }) => {
        let { log, response } = locals;

    }
} satisfies Actions