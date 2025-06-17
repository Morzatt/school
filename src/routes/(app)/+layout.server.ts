import { db } from '$lib/database';
import async from '$lib/utils/asyncHandler';
import { sql } from 'kysely';
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

    let distribucionIngresos = (await getIngresosPorMes())

    return { usuario: locals.usuario, relacionSexo, totalPersonas, distribucionIngresos };
}) satisfies LayoutServerLoad;

async function getIngresosPorMes(): Promise<{ labels: string[], datasets: any[] }> {
    const meses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    const year = new Date().getFullYear();

    const results = await db
        .selectFrom("alumnos")
        .select([
            sql<number>`EXTRACT(MONTH FROM created_at)`.as('mes'),
            db.fn.count('alumnos.cedula_escolar').as('cantidad')
        ])
        .where(sql<number>`EXTRACT(YEAR FROM created_at)`, '=', year)
        .groupBy('mes')
        .orderBy('mes')
        .execute();

    const counts = Array(12).fill(0);
    for (const row of results) {
        const mesIdx = (typeof row.mes === 'string' ? parseInt(row.mes) : row.mes) - 1;
        if (mesIdx >= 0 && mesIdx < 12) {
            counts[mesIdx] = Number(row.cantidad);
        }
    }

    return {
        labels: meses.map((i) => { return i.slice(0, 3) }),
        datasets: [{
            label: `Ingresos Promedio ${year}`,
            data: counts,
            backgroundColor: '#8b5cf6',
            borderRadius: 8,
        }]
    };
}