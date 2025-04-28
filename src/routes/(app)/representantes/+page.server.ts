import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { RepresentanteInsertable } from '$lib/database/types';
import async from '$lib/utils/asyncHandler';
import { representantesRepository } from '$lib/database/repositories/alumnos.repository';
import { db } from '$lib/database';
import { getAge } from '$lib/utils/getAge';
import { capitalizeFirstLetter } from '$lib/utils/capitlizeFirstLetter';
import { validateObject, newValidationFailObject, RepresentanteSchema } from '$lib/utils/validators';

export const load = (async ({ locals, url }) => {
    let { log } = locals
    let index = parseInt(url.searchParams.get("index") as string) 
    let filter = url.searchParams.get("filter") as string
    let search = url.searchParams.get("search") as string
    let sexo = capitalizeFirstLetter(url.searchParams.get("sexo") as string) as "Masculino" | "Femenino" | "All"

    let representantes;

    let query = db.selectFrom("representantes")
            .selectAll()
            .limit(15)
            .offset(index ? index : 0)
            .select((eb) => [
                eb.selectFrom('telefonos_representantes').whereRef('telefonos_representantes.representante', '=', 'representantes.cedula').select(['numero_telefono']).limit(1).as('telefono')
            ])
            .orderBy("representantes.apellido asc")

    if (sexo && sexo !== "All") {
        query = query.where('sexo', "=", sexo)
    }
    if (filter && search) {
        let q1 = query.where(`representantes.${filter}`, "ilike", `%${search}%`)
        representantes = await async(q1.execute(), log)
    } else {
        representantes = await async(query.execute(), log)
    }

    return { representantes, index };
}) satisfies PageServerLoad;

export const actions = {
    create: async ({locals, request}) => {
        let { log, response } = locals
        let data = await request.formData()

        let rep = {
            cedula: data.get("cedula") as string,
            estado_civil: data.get("estado_civil") as string,
            nacionalidad: data.get("nacionalidad") as string,
            nombre: data.get("nombre") as string,
            apellido: data.get("apellido") as string,
            sexo: data.get("sexo") as "Masculino" | "Femenino",
            fecha_nacimiento: data.get("fecha_nacimiento") as string,
            direccion: data.get("direccion") as string,
            correo_electronico: data.get("correo_electronico") as string,
            ocupacion: data.get("ocupacion") as string,
            grado_instruccion: data.get("grado_instruccion") as string,
        } satisfies Omit<RepresentanteInsertable, "edad">;

        // Validate the form data
        const validationResult = validateObject(rep, RepresentanteSchema);
        if (!validationResult.success) {
            return newValidationFailObject(validationResult.error, log);
        }

        let telefono_1 = data.get('telefono_1') as string
        let telefono_2 = data.get('telefono_2') as string

        let representante = await async(representantesRepository.getById(rep.cedula), log)
        if (representante !== undefined) {
            return response.error("El representante ya se encuentra registrado")
        }

        await async(
            db.transaction().execute(async (trx) => {
                await representantesRepository.create({
                    ...rep,
                    edad: getAge(rep.fecha_nacimiento)
                }, trx)

                await trx.insertInto("telefonos_representantes")
                .values({
                    representante: rep.cedula,
                    numero_telefono: telefono_1
                })
                .execute()

                await trx.insertInto("telefonos_representantes")
                .values({
                    representante: rep.cedula,
                    numero_telefono: telefono_2
                })
                .execute()
            })
        , log)


        return response.success('Representante creado correctamente.')
    },
} satisfies Actions