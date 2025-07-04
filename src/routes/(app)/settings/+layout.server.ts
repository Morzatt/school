import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { basePath } from '$lib';

export const load = (async ({ locals, url }) => {
    if (url.pathname.includes("/settings/account") || url.pathname.includes('/settings/look')) {
        return
    }

    if (locals.usuario.role.includes('admin')) {
        return
    } else {
        redirect(307, "/")
    }

    return {};
}) satisfies LayoutServerLoad;