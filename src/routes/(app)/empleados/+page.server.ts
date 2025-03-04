import { db } from '$lib/database';
import type { Empleado } from '$lib/database/types';
import async from '$lib/utils/asyncHandler';
import { capitalizeFirstLetter } from '$lib/utils/capitlizeFirstLetter';
import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { createEmpleadoHandler } from '$lib/handlers/empleados.handlers';

export const load = (async ({ locals, url }) => {
    let { response, log } = locals
    let index = parseInt(url.searchParams.get("index") as string) 
    let type = url.searchParams.get("type") as string
    let filter = url.searchParams.get("filter") as string
    let search = url.searchParams.get("search") as string
    let turno= url.searchParams.get("turno") as string

    let empleados: Empleado[] | undefined;
    let total_empleados: { records: number };

    let query = db.selectFrom("empleados")
            .selectAll()
            .limit(15)
            .offset(index ? index : 0)
            .orderBy("empleados.fecha_ingreso")
    
    if (type && type !== 'all') {
        query = query.where('empleados.area', '=', capitalizeFirstLetter(type))
    }

    if (turno && turno !== 'all') {
        query = query.where('empleados.turno', '=', capitalizeFirstLetter(turno))
    }
    
    if (filter && search) {
        let q1 = query.where(`empleados.${filter}`, "ilike", `%${search}%`)
        empleados = await async(q1.execute(), log)
    } else {
        empleados = await async(query.execute(), log)
    }

    return { empleados: empleados, index: index };
}) satisfies PageServerLoad;

export const actions = {
    createEmpleado: createEmpleadoHandler
} satisfies Actions