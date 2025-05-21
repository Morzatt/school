import { db } from '$lib/database';
import async from '$lib/utils/asyncHandler';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, url }) => {
    let { log } = locals
    let index = parseInt(url.searchParams.get("index") as string) 
    let search = url.searchParams.get("search") as string

    let alumnos;

    let query = db.selectFrom("alumnos")
            .leftJoin('grados_alumnos', 'grados_alumnos.id_alumno', 'alumnos.cedula_escolar')
            .where('grados_alumnos.id_alumno', "is", null)
            .where('alumnos.estado', "=", 'Activo')
            .selectAll("alumnos")
            .limit(15)
            .offset(index ? index : 0)
            .orderBy("alumnos.cedula_escolar desc")
    
    if (search) {
        let q1 = query.where((eb) => eb.or([
            eb(`alumnos.cedula_escolar`, "ilike", `%${search}%`),
            eb(`alumnos.primer_nombre`, "ilike", `%${search}%`),
            eb(`alumnos.segundo_nombre`, "ilike", `%${search}%`),
            eb(`alumnos.primer_apellido`, "ilike", `%${search}%`),
            eb(`alumnos.segundo_apellido`, "ilike", `%${search}%`),
        ]))
        alumnos = await async(q1.execute(), log)
    } else {
        alumnos = await async(query.execute(), log)
    }

    let result = JSON.stringify(alumnos)

    return new Response(result);
};