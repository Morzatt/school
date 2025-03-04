import { db } from '$lib/database';
import type { GradoID, GradoInsertable, Niveles, Numeros, Secciones, Turnos } from '$lib/database/types';
import async from '$lib/utils/asyncHandler';
import { capitalizeFirstLetter } from '$lib/utils/capitlizeFirstLetter';
import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { insertAulaSchema, newValidationFailObject, validateObject } from '$lib/utils/validators';
import { empleadosRepository } from '$lib/database/repositories/profesores.repository';
import { gradosRepository } from '$lib/database/repositories/grados.repository';

export const load = (async ({ locals, url }) => {
    let qParam = url.searchParams.get('type') 
    let queryType = capitalizeFirstLetter(qParam ? qParam : "") as Niveles & 'all'
    let { log } = locals

    let query = db.selectFrom('grados').selectAll()
    let grados; 

    if (queryType && queryType !== 'All') {
        grados = await async(query.where('grados.nivel', '=', queryType).execute(), log)
    } else {
        grados = await async(query.execute(), log)
    }

    return { grados };
}) satisfies PageServerLoad;

export const actions = {
    createGrado: async ({ request, locals }) => {
        let { response, log } = locals
        let data = await request.formData()
        
        let aula = {
            numero: data.get('numero') as Numeros,
            nivel: data.get('nivel') as Niveles,
            seccion: data.get('seccion') as Secciones,
            turno: data.get('turno') as Turnos,
            profesor: data.get('profesor') as string
        } satisfies Omit<GradoInsertable, "id_grado">

        let validation = validateObject(aula, insertAulaSchema)
        if (!validation.success) {
            return newValidationFailObject(validation.error, log)
        }

        let profesor = await async(empleadosRepository.getById(aula.profesor), log)
        if (!profesor) {
            return fail(401, response.error('El Docente de Aula especificado no está registrado.'))
        }

        if (profesor.area !== "Docente") {
            return fail(401, response.error('El Docente de Aula especificado no pertenece al área Docente.'))           
        }

        if (profesor.turno !== aula.turno) {
            return fail(401, response.error(`El profesor ${profesor.primer_nombre} ${profesor.primer_apellido} pertenece al turno de la ${profesor.turno}`))           
        }

        function createGradoId(a: typeof aula) {
            return `${a.numero}${a.nivel[0]}${a.seccion[0]}${a.turno[0]}`
        }

        let gradoFromDB = await async(gradosRepository.getById(createGradoId(aula) as GradoID), log)
        if (gradoFromDB) {
            return fail(403, response.error('El aula ya existe'))
        }

        await async(gradosRepository.create({
            ...aula,
            id_grado: createGradoId(aula) as GradoID
        }), log)

        return response.success('Aula creada correctamente.')
    }
} satisfies Actions