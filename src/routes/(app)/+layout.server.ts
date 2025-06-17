import { db } from '$lib/database';
import async from '$lib/utils/asyncHandler';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
    let { log } = locals;

    let relacionSexo = await async(
        db.transaction().execute(async (trx) => {
            let varones = await trx.selectFrom('alumnos')
            .select(['alumnos.cedula_escolar', 'alumnos.sexo'])
            .where('alumnos.sexo', '=', 'Masculino')
            .execute()

            let hembras = await trx.selectFrom('alumnos')
            .select(['alumnos.cedula_escolar', 'alumnos.sexo'])
            .where('alumnos.sexo', '=', 'Femenino')
            .execute()

            return { varones: varones.length, hembras: hembras.length }
        })
    , log)

    let totalPersonas = await db.transaction().execute(async (trx) => {
        let empleados = await trx
        .selectFrom('empleados')
        .select(['empleados.cedula'])
        .execute()

        let alumnos = await trx
        .selectFrom('alumnos')
        .select(['alumnos.cedula_escolar'])
        .execute()

        let representantes = await trx
        .selectFrom('representantes')
        .select(['representantes.cedula'])
        .execute()

        let cursos = await trx
        .selectFrom('grados')
        .select(["grados.id_grado"])
        .execute()

        return { alumnos: alumnos.length, empleados: empleados.length, representantes: representantes.length, cursos: cursos.length }
    })

    return { usuario: locals.usuario, relacionSexo, totalPersonas };
}) satisfies LayoutServerLoad;