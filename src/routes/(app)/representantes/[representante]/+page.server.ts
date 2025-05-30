import { db } from '$lib/database';
import { representantesRepository } from '$lib/database/repositories/alumnos.repository';
import async from '$lib/utils/asyncHandler';
import { error, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = (async ({ url, locals }) => {
    const { log, response } = locals;

    let cedula = getId(url.pathname)
    let representante = await async(representantesRepository.getById(cedula), log)

    if (!representante) {
        return error(404, "El representante no existe")
    }

    let alumnos = await async(
        db
        .selectFrom('alumnos')
        .innerJoin('representantes_alumnos', 'representantes_alumnos.id_alumno', 'alumnos.cedula_escolar')
        .where('representantes_alumnos.id_representante', "=", cedula)
        .selectAll()
        .execute()
    , log)

    return { representante, alumnos }
});

function getId(url: string): string {
    return url.slice(url.lastIndexOf("/") + 1)
}

export const actions = {
    delete: async ({ locals, request }) => {
        let { log, response } = locals;
        let data = await request.formData()
        let id = data.get('cedula_representante') as string

        await async(representantesRepository.delete(id), log)

        redirect(307, '/representantes')
    },

    edit: async ({ locals, request }) => {
        let { log, response } = locals;
        let data = await request.formData()

        let d = {
            grado_instruccion: data.get('grado_instruccion') as string | undefined,
            ocupacion: data.get('ocupacion') as string | undefined,
            direccion: data.get('direccion') as string | undefined,
            correo_electronico: data.get('correo_electronico') as string | undefined,
            cedula: data.get('cedula') as string,
            telefono_1: data.get('telefono_1') as string,
            telefono_2: data.get('telefono_2') as string,
        }

        await async(
            db.transaction().execute(async (trx) => {
                if (d.grado_instruccion) {
                    await trx.updateTable('representantes').set({ grado_instruccion: d.grado_instruccion }).where('cedula', '=', d.cedula).execute()
                }

                if (d.ocupacion) {
                    await trx.updateTable('representantes').set({ ocupacion: d.ocupacion }).where('cedula', '=', d.cedula).execute()
                }

                if (d.direccion) {
                    await trx.updateTable('representantes').set({ direccion: d.direccion }).where('cedula', '=', d.cedula).execute()
                }

                if (d.correo_electronico) {
                    await trx.updateTable('representantes').set({ correo_electronico: d.correo_electronico }).where('cedula', '=', d.cedula).execute()
                }

                if (d.telefono_1) {
                    await trx.updateTable('representantes').set({ telefono_1: d.telefono_1 }).where('cedula', '=', d.cedula).execute()
                }

                if (d.telefono_2) {
                    await trx.updateTable('representantes').set({ telefono_2: d.telefono_2 }).where('cedula', '=', d.cedula).execute()
                }
            })
        , log)

        return response.success('Datos actualizados correctamente')
    },
} satisfies Actions