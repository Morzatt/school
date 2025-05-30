import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/database';
import async from '$lib/utils/asyncHandler';
import type { Themes } from '$lib/database/types';

export const load = (async () => {
    return {};
}) satisfies PageServerLoad;

export const actions = {
    changeTheme: async ({ request, locals }) => {
        let { log, response } = locals;
        let theme_name = (await request.formData()).get('theme_name') as Themes 

        await async(
            db
            .updateTable('usuarios')
            .set({ theme: theme_name })
            .where('usuarios.usuario', '=', locals.usuario.usuario)
            .execute()
        , log)

        locals.usuario.theme = theme_name;
    }
} satisfies Actions