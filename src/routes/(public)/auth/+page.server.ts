import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { registerHandler } from '$lib/handlers/register.handler';
import { loginHandler } from '$lib/handlers/login.handler';
import captcha from "$lib/components/Captcha/svg-captcha"
import { options } from "$lib/components/Captcha/svg-captcha/lib/option-manager"
import { recoveryHandler } from '$lib/handlers/pregseg.handler';
import { getFormData } from '$lib/utils/getFormData';
import { newValidationFailObject, recoverySchema, validateObject } from '$lib/utils/validators';
import { z } from 'zod';
import async from '$lib/utils/asyncHandler';
import { usuarioRepository } from '$lib/database/repositories/user.repository';
import { fail } from '@sveltejs/kit';
import { pregSegRepository } from '$lib/database/repositories/preg_seg.repository';

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
    verify: async ({ locals, request }) => {
        let { response, log } = locals

        let respuestas = {
            usuario: "",
            res_1: "",
            res_2: "",
        }

        await getFormData(respuestas, request, null)

        let validationResult = validateObject(respuestas, recoverySchema.omit({ contraseña: true }));
        if (!validationResult.success) return newValidationFailObject(validationResult.error, log);

        const usuarioDB = await async(usuarioRepository.getByUsername(respuestas.usuario), log)
        if (!usuarioDB) { return fail(400, response.error("El usuario no se encuentra registrado")) }

        const pregseg = await async(pregSegRepository.get(respuestas.usuario), log, { args: respuestas.usuario })
        if (!pregseg) { return fail(400, response.error("El usuario no cuenta con Preguntas de Seguridad asociadas a su cuenta.")) }

        respuestas.res_1.toLowerCase()
        respuestas.res_2.toLowerCase()

        if (pregseg?.res_1 !== respuestas.res_1) {
            return fail(400, response.error("La respuesta #1 no coincide."))
        }
        if (pregseg?.res_2 !== respuestas.res_2) {
            return fail(400, response.error("La respuesta #2 no coincide."));
        }

        return response.success('Preguntas de Seguridad verificadas correctamente', { usuario: respuestas.usuario })
    },

    recovery: recoveryHandler
} satisfies Actions