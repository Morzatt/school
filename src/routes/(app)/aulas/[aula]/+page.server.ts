import { db } from '$lib/database';
import { gradosRepository, materiasRepository } from '$lib/database/repositories/grados.repository';
import { bloquesHorariosRepository, horariosGradosAltRepository } from '$lib/database/repositories/horarios.repository';
import type { BloqueID, DiasSemana, GradoID, HorarioGradoAlt, HorarioGradoAltInsertable, HorarioID, TimeString } from '$lib/database/types';
import async from '$lib/utils/asyncHandler';
import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { empleadosRepository } from '$lib/database/repositories/profesores.repository';
import { error, fail, redirect } from '@sveltejs/kit';
import { printAlumnosGrado, printHorarioGrado } from '$lib/handlers/print.handlers';
import { createGradoId } from '$lib/utils/createGradoId';

export const load = (async ({ locals, url }) => {
    let { log } = locals
    let id = getId(url.pathname) as GradoID
    let grado = await async(gradosRepository.getById(id), log)

    if (!grado) {
        return error(404, "El aula/grado no existe.")
    }

    let horarioResult = await async(
        db
        .selectFrom('horarios_grados_alt')
        .where('horarios_grados_alt.id_grado', '=', id)
        .select([
            'horarios_grados_alt.cedula_profesor', 'horarios_grados_alt.dia_semana', 'horarios_grados_alt.hora_fin',
            'horarios_grados_alt.hora_inicio', 'horarios_grados_alt.id_grado', 'horarios_grados_alt.id_horario','horarios_grados_alt.id_materia'
        ])
        .innerJoin('empleados', 'empleados.cedula', 'horarios_grados_alt.cedula_profesor')
        .select(['primer_nombre as nombre_profesor', 'primer_apellido as apellido_profesor'])
        .innerJoin('materias', 'materias.id_materia', 'horarios_grados_alt.id_materia')
        .select(['materias.nombre_materia', 'materias.color', 'materias.id_materia'])
        .orderBy('horarios_grados_alt.hora_inicio')
        .execute()
    , log)

    let horarios = {
        lunes: horarioResult?.filter(i => { return i.dia_semana === "Lunes" ? i : undefined }),
        martes: horarioResult?.filter(i => { return i.dia_semana === "Martes" ? i : undefined }),
        miercoles: horarioResult?.filter(i => { return i.dia_semana === "Miercoles" ? i : undefined }),
        jueves: horarioResult?.filter(i => { return i.dia_semana === "Jueves" ? i : undefined }),
        viernes: horarioResult?.filter(i => { return i.dia_semana === "Viernes" ? i : undefined }),
    }

    let materias = await async(db.selectFrom('materias').selectAll().execute(), log)

    let materiasAula = await async(
        db
        .selectFrom('materias')
        .innerJoin('horarios_grados_alt', 'materias.id_materia', 'horarios_grados_alt.id_materia')
        .select(['materias.nombre_materia', 'materias.id_materia'])
        .where('horarios_grados_alt.id_grado', '=', id)
        .groupBy('materias.id_materia')
        .execute()
    , log)

    let clasesSemanales = await async(
        db
        .selectFrom('materias')
        .innerJoin('horarios_grados_alt', 'materias.id_materia', 'horarios_grados_alt.id_materia')
        .select(['materias.id_materia'])
        .where('horarios_grados_alt.id_grado', '=', id)
        .execute()
    , log)

    let alumnos = await async(
        db
        .selectFrom('alumnos')
        .innerJoin('grados_alumnos', 'grados_alumnos.id_alumno', 'alumnos.cedula_escolar')
        .where('grados_alumnos.id_grado', '=', id)
        .selectAll()
        .orderBy('alumnos.primer_apellido asc')
        .orderBy('alumnos.primer_nombre asc')
        .execute()
    , log)

    let profesor = await async( 
        db
        .selectFrom('empleados')
        .selectAll()
        .innerJoin('grados', 'grados.profesor', 'empleados.cedula')
        .where('grados.id_grado', "=", id)
        .executeTakeFirst()
    ,log)

    let bloques = await db.selectFrom('bloques_horarios').selectAll().orderBy("hora_inicio asc").execute()

    return { grado, horarios, materias, alumnos, profesor, bloques, materiasAula, clasesSemanales };
}) satisfies PageServerLoad;

function getId(url: string): string {
    return url.slice(url.lastIndexOf("/") + 1)
}

export const actions = {
    editAula: async ({locals, request}) => {
        let { log, response } = locals;
        let data = await request.formData()

        let edit = {
            id_grado: data.get('id_grado') as GradoID,
            profesor: data.get('profesor') as string,
        }

        let grado = await async(gradosRepository.getById(edit.id_grado), log)
        if (!grado) {
            return
        }

        if (edit.profesor === grado.profesor) {
            return
        }

        let profesor = await async(empleadosRepository.getById(edit.profesor), log)
        if (!profesor) {
            return response.error('El docente especificado no existe / no está registrado')
        }

        if (profesor.turno !== grado.turno) {
            return response.error('El turno del profesor no coincide con el turno del aula.')
        }

        if (profesor.estado === "Retirado") {
            return response.error('El profesor se encuentra retirado del sistema.')
        }

        await async(gradosRepository.update({ profesor: edit.profesor }, edit.id_grado), log)

        return response.success('Docente cambiado correctamente.')
    },

    delete: async ({locals, request}) => {
        let { log } = locals;
        let grado_id = (await request.formData()).get('grado') as GradoID

        await async(
            gradosRepository.delete(grado_id)
        , log)

        redirect(307, '/aulas')
    },

    createBloque: async ({ locals, request }) => {
        let { log, response } = locals
        let data = await request.formData()

        let bloque = {
            id_grado: data.get("id_grado") as GradoID,
            cedula_profesor: data.get("cedula_profesor") as string,
            id_materia: data.get("id_materia") as string,
            dia_semana: data.get("dia_semana") as DiasSemana,
            hora_inicio: data.get("hora_inicio") as TimeString,
            hora_fin: data.get("hora_fin") as TimeString,
        } satisfies Omit<HorarioGradoAltInsertable, "id_horario">

        let guardar = data.get('guardar') as 'on' | null

        let inicio = parseInt(bloque.hora_inicio.replace(':', ""))
        let final = parseInt(bloque.hora_fin.replace(':', ""))

        let profesor = await async(empleadosRepository.getById(bloque.cedula_profesor), log)
        if (!profesor) {
            return fail(401, response.error('El Docente de Aula especificado no está registrado.'))
        }

        if (profesor.area !== "Docente") {
            return fail(401, response.error('El Docente especificado no pertenece al área Docente.'))           
        }

        if (profesor.estado === "Retirado") {
            return response.error('El Docente especificado se encuentra retirado del sistema.')
        }

        let grado = await async(gradosRepository.getById(bloque.id_grado), log) 

        if (!grado) {
            return fail(401, response.error(`El Aula no existe`))           
        }

        if (profesor.turno !== grado.turno) {
            return fail(401, response.error(`El profesor ${profesor.primer_nombre} ${profesor.primer_apellido} pertenece al turno de la ${profesor.turno}`))           
        }

        if (grado.turno === "Mañana") {
            if (inicio > 1259) {
                return fail(402, response.error('El horario que está intentando registrar pertenece al turno de la Tarde'))
            }
            if (final > 1259) {
                return fail(402, response.error('El horario que está intentando registrar pertenece al turno de la Tarde'))
            }
        }

        if (grado.turno === "Tarde") {
            if (inicio < 1200 && final < 1200) {
                return fail(402, response.error('El horario que está intentando registrar pertenece al turno de la Mañana'))
            }
            if (final < 1200) {
                return fail(402, response.error('El horario que está intentando registrar pertenece al turno de la Mañana'))
            }
        }
        
        if (bloque.hora_inicio > bloque.hora_fin) {
            return fail(402, response.error('Malformacion de datos: La hora de entrada es mayor a la hora de salida'))
        }

        let horarios = await async(
            db
            .selectFrom('horarios_grados_alt')
            .selectAll()
            .where((eb) => eb.and([
                eb('horarios_grados_alt.dia_semana', "=", bloque.dia_semana),
                eb('horarios_grados_alt.id_grado', "=", bloque.id_grado)
            ])) 
            .execute()
        , log)

        let horariosProfesor = await async(
            db
            .selectFrom('horarios_grados_alt')
            .selectAll()
            .where((eb) => eb.and([
                eb('horarios_grados_alt.dia_semana', "=", bloque.dia_semana),
                eb('horarios_grados_alt.cedula_profesor', "=", bloque.cedula_profesor)
            ])) 
            .execute()
        , log)

        if (horarios) {
            let conflictedHorarioSeccion = horarios.filter((i) => {
                let ini = parseInt(i.hora_inicio.replace(':', ""))
                let fin = parseInt(i.hora_fin.replace(':', ""))

                // console.log(`Inicio: ${inicio} - Final ${final} <===> ini: ${ini}, fin: ${fin}`)

                if (inicio >= fin) {
                    if (final >= fin) {
                        return
                    }
                }

                if (final <= ini) {
                    if (inicio <= ini) {
                        return
                    }
                }

                console.log('Conflicto de Horario')
                return i
            })

            let conflictedHorarioProfesor = horariosProfesor!.filter((i) => {
                let ini = parseInt(i.hora_inicio.replace(':', ""))
                let fin = parseInt(i.hora_fin.replace(':', ""))

                // console.log(`Inicio: ${inicio} - Final ${final} <===> ini: ${ini}, fin: ${fin}`)

                if (inicio >= fin) {
                    if (final >= fin) {
                        return
                    }
                }

                if (final <= ini) {
                    if (inicio <= ini) {
                        return
                    }
                }

                console.log('Conflicto de Horario')
                return i
            })

            if (conflictedHorarioSeccion.length !== 0) {
                return fail(401, response.error('Conflicto de Horario: El horario que está intentando ingresar ya está ocupado por otra materia.'))
            }

            if (conflictedHorarioProfesor.length !== 0) {
                return fail(401, response.error('Conflicto de Horario: El profesor ya se encuentra asignado a un horario en las horas especificadas.'))
            }
        }

        function createHorarioID(b: typeof bloque) {
            let i = b.hora_inicio.replace(':', '')
            let f = b.hora_fin.replace(':', '')
            let AB1 = parseInt(i) < 1200 ? "A" : "T"
            let AB2 = parseInt(f) < 1200 ? "A" : "T"
            return `${b.id_grado}:${b.dia_semana[0]}${b.dia_semana[1]}-${i[0]}${i[1]}${i[2]}${i[3]}${AB1}-${f[0]}${f[1]}${f[2]}${f[3]}${AB2}`
        }

        function createBloqueID(b: typeof bloque) {
            let i = b.hora_inicio.replace(':', '')
            let f = b.hora_fin.replace(':', '')
            let AB1 = parseInt(i) < 1200 ? "A" : "T"
            let AB2 = parseInt(f) < 1200 ? "A" : "T"
            return `${i[0]}${i[1]}${i[2]}${i[3]}${AB1}-${f[0]}${f[1]}${f[2]}${f[3]}${AB2}`
        }

        let bloqueID = createBloqueID(bloque) as BloqueID
        
        let bloqueDB = await async(bloquesHorariosRepository.getById(bloqueID), log)

        await async (
            db.transaction().execute(async (trx) => {
                await horariosGradosAltRepository.createBloque({
                    ...bloque,
                    id_horario: createHorarioID(bloque) as HorarioID
                }, trx)

                if (guardar === "on" && !bloqueDB) {
                    await trx.insertInto('bloques_horarios').values({
                        id_bloque: bloqueID,
                        hora_inicio: bloque.hora_inicio,
                        hora_fin: bloque.hora_fin,
                        turno: grado.turno
                    }).execute()
                }
            })
        , log)

        return response.success('Horario creado exitosamente.')
    },

    deleteBloque: async ({locals, request}) => {
        let { log, response } = locals;
        let data = await request.formData()
        let bloque_id = data.get('bloque_id') as BloqueID

        let bloqueDB = await async(bloquesHorariosRepository.getById(bloque_id), log)
        if (!bloqueDB) {
            return fail(401, response.error('El bloque no existe.'))
        }

        await async(bloquesHorariosRepository.delete(bloque_id), log)
        return response.success('Bloque eliminado con éxito')
    },

    printHorario: printHorarioGrado,
    printAlumnos: printAlumnosGrado,

    editHorario: async ({ locals, request }) => {
        let { log, response } = locals;
        let data = await request.formData()
        
        let info = {
            id_horario: data.get('id_horario') as HorarioID,
            nueva_materia: data.get('nueva_materia') as string,
            nuevo_profesor: data.get('nuevo_profesor') as string,
            dia_semana: data.get('dia_semana') as DiasSemana
        }

        let id_grado = info.id_horario.slice(0, info.id_horario.lastIndexOf(":")) as GradoID
        let horarios = await async(
            db
            .selectFrom('horarios_grados_alt')
            .selectAll()
            .where('horarios_grados_alt.id_horario', "=", info.id_horario) 
            .executeTakeFirst()
        , log)

        if (info.nuevo_profesor) {
            let profesor = await async(empleadosRepository.getById(info.nuevo_profesor), log)
            if (!profesor) {
                return fail(401, response.error('El Docente de Aula especificado no está registrado.'))
            }

            if (profesor.area !== "Docente") {
                return fail(401, response.error('El Docente de Aula especificado no pertenece al área Docente.'))
            }

            if (profesor.estado === "Retirado") {
                return response.error('El Docente especificado se encuentra retirado del sistema.')
            }

            let grado = await async(gradosRepository.getById(id_grado), log)

            if (!grado) {
                return fail(401, response.error(`El Aula no existe`))
            }

            if (profesor.turno !== grado.turno) {
                return fail(401, response.error(`El profesor ${profesor.primer_nombre} ${profesor.primer_apellido} pertenece al turno de la ${profesor.turno}`))
            }

            let horariosProfesor = await async(
                db
                    .selectFrom('horarios_grados_alt')
                    .selectAll()
                    .where((eb) => eb.and([
                        eb('horarios_grados_alt.dia_semana', "=", info.dia_semana),
                        eb('horarios_grados_alt.cedula_profesor', "=", info.nuevo_profesor)
                    ]))
                    .execute()
                , log)

            if (horariosProfesor) {
                let conflictedHorarioProfesor = horariosProfesor!.filter((i) => {
                    let ini = parseInt(i.hora_inicio.replace(':', ""))
                    let fin = parseInt(i.hora_fin.replace(':', ""))

                    let inicio = parseInt(horarios!.hora_inicio.replace(":", ""))
                    let final = parseInt(horarios!.hora_fin.replace(":", ""))

                    // console.log(`Inicio: ${inicio} - Final ${final} <===> ini: ${ini}, fin: ${fin}`)

                    if (inicio >= fin) {
                        if (final >= fin) {
                            return
                        }
                    }

                    if (final <= ini) {
                        if (inicio <= ini) {
                            return
                        }
                    }

                    console.log('Conflicto de Horario')
                    return i
                })

                if (conflictedHorarioProfesor.length !== 0) {
                    return fail(401, response.error('Conflicto de Horario: El profesor ya se encuentra asignado a un horario en las horas especificadas.'))
                }
            }
        } else {
            info.nuevo_profesor = horarios!.cedula_profesor
        }

        if (!info.nueva_materia) {
            info.nueva_materia = horarios!.id_materia
        }

        await async(
            db.transaction().execute(async (trx) => {
                await trx.updateTable('horarios_grados_alt')
                    .set({
                        id_materia: info.nueva_materia,
                        cedula_profesor: info.nuevo_profesor
                    })
                    .where('horarios_grados_alt.id_horario', '=', info.id_horario)
                    .execute()
            })
            , log)
    },

    deleteHorario: async ({ locals, request }) => {
        let { log, response } = locals;
        let data = await request.formData()

        let info = {
            id_horario: data.get('id_horario') as HorarioID,
        }

        await async(
            db
            .deleteFrom('horarios_grados_alt')
            .where('horarios_grados_alt.id_horario', '=', info.id_horario)
            .execute()
        , log)

        return response.success('Bloque eliminado con éxito')
    },
} satisfies Actions