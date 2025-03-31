import { db } from '$lib/database';
import { representantesRepository } from '$lib/database/repositories/alumnos.repository';
import async from '$lib/utils/asyncHandler';
import { error } from '@sveltejs/kit';
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

    let telefonos = await async (
        db
        .selectFrom('telefonos_representantes')
        .selectAll()
        .where('representante', '=', cedula)
        .execute()
    , log)

    return { representante, alumnos, telefonos }
});

function getId(url: string): string {
    return url.slice(url.lastIndexOf("/") + 1)
}