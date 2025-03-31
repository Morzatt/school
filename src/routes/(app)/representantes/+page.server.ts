import async from '$lib/utils/asyncHandler';
import { db } from '$lib/database';
import type { Empleado, Representante } from '$lib/database/types';
import { capitalizeFirstLetter } from '$lib/utils/capitlizeFirstLetter';
import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { createEmpleadoHandler } from '$lib/handlers/empleados.handlers';

export const load = (async ({ locals, url }) => {
    let { log } = locals
    let index = parseInt(url.searchParams.get("index") as string) 
    let type = url.searchParams.get("type") as string
    let filter = url.searchParams.get("filter") as string
    let search = url.searchParams.get("search") as string
    let turno= url.searchParams.get("turno") as string

    let representantes: Representante[] | undefined;
    let total_empleados: { records: number };

    let query = db.selectFrom("representantes")
            .selectAll()
            .limit(15)
            .offset(index ? index : 0)
            .orderBy("representantes.apellido asc")
    
    if (filter && search) {
        let q1 = query.where(`representantes.${filter}`, "ilike", `%${search}%`)
        representantes = await async(q1.execute(), log)
    } else {
        representantes = await async(query.execute(), log)
    }

    return { representantes, index };
}) satisfies PageServerLoad;

export const actions = {
    createEmpleado: createEmpleadoHandler
} satisfies Actions