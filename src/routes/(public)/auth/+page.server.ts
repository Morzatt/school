import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { registerHandler } from '$lib/handlers/register.handler';
import { loginHandler } from '$lib/handlers/login.handler';
import captcha from "$lib/components/Captcha/svg-captcha"
import { options } from "$lib/components/Captcha/svg-captcha/lib/option-manager"
import { recoveryHandler } from '$lib/handlers/pregseg.handler';

export const load = (async ({ cookies }) => {
    let { text, data } = captcha.create(options)

    let cookie = cookies.get("sessionId")
    if (cookie !== undefined) {
        redirect(307, "/")
    }

    return { text, data };
}) satisfies PageServerLoad;

export const actions = {
    register: registerHandler,
    login: loginHandler,
    recovery: recoveryHandler
} satisfies Actions