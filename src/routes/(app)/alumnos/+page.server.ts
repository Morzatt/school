import { db } from '$lib/database';
import type { Alumno } from '$lib/database/types';
import { createAlumnoHandler } from '$lib/handlers/alumnos.handlers';
import async from '$lib/utils/asyncHandler';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals, url }) => {
    let { response, log } = locals
    let index = parseInt(url.searchParams.get("index") as string) 
    let filter = url.searchParams.get("filter") as string
    let search = url.searchParams.get("search") as string

    let alumnos: Alumno[] | undefined;
    let total_alumnos: { records: number };

    let query = db.selectFrom("alumnos")
            .selectAll()
            .limit(15)
            .offset(index ? index : 0)
            .orderBy("alumnos.created_at desc")
    
    if (filter && search) {
        let q1 = query.where(`alumnos.${filter}`, "ilike", `%${search}%`)
        alumnos = await async(q1.execute(), log)
        total_alumnos = await async (
            db.selectFrom("alumnos")
                .where(`alumnos.${filter}`, "ilike", `%${search}%`)
                .select((eb) => eb.fn.count("alumnos.cedula_escolar")
                .as("records"))
                .executeTakeFirst(), log) as { records: number }
    } else {
        alumnos = await async(query.execute(), log)
        total_alumnos = await async (
            db.selectFrom("alumnos")
                .select((eb) => eb.fn.count("alumnos.cedula_escolar")
                .as("records"))
                .executeTakeFirst(), log) as { records: number }
    }

    return { alumnos: alumnos, total_alumnos: total_alumnos ? total_alumnos.records : 0, index };
}) satisfies PageServerLoad;

export const actions = {
    createAlumno: createAlumnoHandler
} satisfies Actions