import { empleadosRepository } from '$lib/database/repositories/profesores.repository';
import async from '$lib/utils/asyncHandler';
import { error, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Grado } from '$lib/database/types';
import { gradosRepository } from '$lib/database/repositories/grados.repository';
import { db } from '$lib/database';
import { getConstanciaAceptacion } from '$lib/handlers/empleados.handlers';

export const load = (async ({ locals, url }) => {
    let { log } = locals;
    let id = getId(url.pathname) as string
    let empleado = await async(empleadosRepository.getById(id), log)

    if (!empleado) {
        return error(404, "El empleado no existe.")
    }

    let grado: Grado | undefined;

    if (empleado.area === "Docente") {
        grado = await async(
            db
            .selectFrom('grados')
            .where('grados.profesor', '=', empleado.cedula)
            .selectAll()
            .executeTakeFirst()
        , log)
    }

    return { empleado, grado };
}) satisfies PageServerLoad;

function getId(url: string): string {
    return url.slice(url.lastIndexOf("/") + 1)
}

export const actions = {
    eliminar: async ({locals, request}) => {
        let { log, response } = locals;
        let data = await request.formData()
        let cedula = data.get('empleado') as string

        await async(empleadosRepository.delete(cedula), log)
        redirect(307, '/empleados')
    },

    retirar: async ({locals, request}) => {
        let { log, response } = locals;
        let data = await request.formData()
        let cedula = data.get('empleado') as string

        await async(
            db
            .updateTable('grados')
            .set({
                profesor: null
            })
            .where('grados.profesor', '=', cedula)
            .execute()
        , log)
        await async(empleadosRepository.update({ estado: "Retirado" }, cedula), log)
        return response.success('Empleado retirado correctamente.')
    },

    getConstanciaAceptacion: getConstanciaAceptacion,
} satisfies Actions