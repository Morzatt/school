import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { RepresentanteInsertable } from '$lib/database/types';
import async from '$lib/utils/asyncHandler';
import { representantesRepository } from '$lib/database/repositories/alumnos.repository';
import { db } from '$lib/database';

export const load = (async () => {
    return {};
}) satisfies PageServerLoad;

export const actions = {
    create: async ({locals, request}) => {
        let { log, response } = locals
        let data = await request.formData()

        let rep = {
            cedula: data.get('cedula') as string,
            nombre: data.get('nombre') as string,
            apellido: data.get('apellido') as string,
            sexo: data.get("sexo") as "Masculino" | "Femenino",
            direccion: data.get("direccion") as string,
            correo_electronico: data.get("correo_electronico") as string,         
        } satisfies RepresentanteInsertable

        let telefonos = data.getAll("telefono") as string[] | string

        let representante = await async(representantesRepository.getById(rep.cedula), log)
        if (representante !== undefined) {
            return response.error("El representante ya se encuentra registrado")
        }

        db.transaction().execute(async (trx) => {
            await async(representantesRepository.create(rep, trx), log)
            if (typeof telefonos === "string") {
                await async(
                    trx
                    .insertInto("telefonos_representantes")
                    .values({
                        representante: rep.cedula,
                        numero_telefono: telefonos
                    })
                    .execute()
                , log)
                return
            } else {
                for (let i of telefonos) {
                    await async(
                        trx
                        .insertInto("telefonos_representantes")
                        .values({
                            representante: rep.cedula,
                            numero_telefono: i 
                        })
                        .execute()
                    , log)
                }
                return
            }
        })

        return response.success('Representante creado correctamente.')
    },

    delete: async ({ locals, request }) => {
        let { log, response } = locals
        let data = await request.formData()

        let cedula = data.get("cedula") as string

        let representante = await async(representantesRepository.getById(cedula), log)
        if (!representante) {
            return response.error('El representante no se encuentra registrado.')
        }

        await async(representantesRepository.delete(cedula), log)
        return response.success('Representante eliminado correctamente')
    }
} satisfies Actions