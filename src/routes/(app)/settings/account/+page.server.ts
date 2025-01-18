import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { usuarioRepository } from '$lib/database/repositories/user.repository';
import async from '$lib/utils/asyncHandler';

export const load = (async () => {
    return {};
}) satisfies PageServerLoad;

export const actions = {
    editUser: async ({ request, locals }) => {
        let { log, response } = locals

        const data = await request.formData()
        const usuario = data.get("usuario") as string

        let usuarioFromDB = async(usuarioRepository.getByUsername(usuario), log)
        console.log("user")
    },

    editPregSeg: async ({request, url, locals}) => {
        let { log, response } = locals
        let data = await request.formData()
        console.log("preg")
    }
} satisfies Actions