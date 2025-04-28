import { db } from '$lib/database';
import type { Alumno, Niveles, Turnos } from '$lib/database/types';
import { createAlumnoHandler } from '$lib/handlers/alumnos.handlers';
import async from '$lib/utils/asyncHandler';
import { capitalizeFirstLetter } from '$lib/utils/capitlizeFirstLetter';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ locals, url }) => {
    let { response, log } = locals
    let index = parseInt(url.searchParams.get("index") as string) 
    let filter = url.searchParams.get("filter") as string
    let search = url.searchParams.get("search") as string

    let estado = capitalizeFirstLetter(url.searchParams.get("estado")) as 'Activo' | 'Retirado' | 'All'
    let turno = capitalizeFirstLetter(url.searchParams.get("turno")) as Turnos & 'All'
    let nivel = capitalizeFirstLetter(url.searchParams.get("nivel")) as Niveles & 'All'


    let alumnos;
    let total_alumnos: { records: number };

    let query = db.selectFrom("alumnos")
            .leftJoin('grados_alumnos', 'alumnos.cedula_escolar', 'grados_alumnos.id_alumno')
            .leftJoin('grados', 'grados_alumnos.id_grado', 'grados.id_grado')
            .selectAll()
            .limit(15)
            .offset(index ? index : 0)
            .orderBy("alumnos.created_at desc")
    
    if (turno && turno !== 'All') {
        query = query.where('grados.turno', '=', turno)
    }

    if (estado && estado !== 'All') {
        query = query.where('alumnos.estado', "=", estado)
    }

    if (nivel && nivel !== 'All') {
        query = query.where('grados.nivel', "=", nivel).orderBy('grados.numero desc').orderBy('grados.nivel desc')
    }
    
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

    let matricula = await async(
        db.selectFrom("alumnos")
        .select((eb) => eb.fn.count('alumnos.cedula_escolar').as('alumnos'))
        .innerJoin('grados_alumnos', 'alumnos.cedula_escolar', 'grados_alumnos.id_alumno')
        .executeTakeFirst()
    ,log)

    let matricula_manana = await async(
        db.selectFrom("alumnos")
        .innerJoin('grados_alumnos', 'alumnos.cedula_escolar', 'grados_alumnos.id_alumno')
        .innerJoin('grados', 'grados_alumnos.id_grado', 'grados.id_grado')
        .select((eb) => eb.fn.count('alumnos.cedula_escolar').as('alumnos'))
        .where('grados.turno', '=', 'Mañana')
        .executeTakeFirst()
    ,log)
    let matricula_tarde = await async(
        db.selectFrom("alumnos")
        .innerJoin('grados_alumnos', 'alumnos.cedula_escolar', 'grados_alumnos.id_alumno')
        .innerJoin('grados', 'grados_alumnos.id_grado', 'grados.id_grado')
        .select((eb) => eb.fn.count('alumnos.cedula_escolar').as('alumnos'))
        .where('grados.turno', '=', 'Tarde')
        .executeTakeFirst()
    ,log)


    return { alumnos: alumnos, total_alumnos: total_alumnos ? total_alumnos.records : 0, index,
        matriculas: {
            matricula, matricula_manana, matricula_tarde
        }
    };
}) satisfies PageServerLoad;

export const actions = {
    createAlumno: createAlumnoHandler
} satisfies Actions