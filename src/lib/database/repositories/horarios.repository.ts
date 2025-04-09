import type { Transaction } from "kysely";
import { db } from "../";
import type { BloqueHorario, BloqueHorarioInsertable, BloqueHorarioUpdateable, BloqueID, Database, GradoID, HorarioGrado, HorarioGradoAlt, HorarioGradoAltInsertable, HorarioGradoInsertable, HorarioID } from "../types";

export interface BloquesHorariosRepositoryInterface{
    create(bloque: BloqueHorarioInsertable): Promise<void>
    getById(id: BloqueID): Promise<BloqueHorario | undefined>

    delete(id: BloqueID): Promise<void>
    update(grado: BloqueHorarioUpdateable, id: BloqueID): Promise<void>
}

export let bloquesHorariosRepository: BloquesHorariosRepositoryInterface = {
    create: async (bloque) => {
        try {
            await db.insertInto("bloques_horarios").values(bloque).execute()
        } catch (error) {
            throw error
        }
    },

    getById: async (id) => {
        try {
            let result = await db
                .selectFrom("bloques_horarios")
                .selectAll()
                .where("bloques_horarios.id_bloque", "=", id)
                .executeTakeFirst()
            if (result) return result;
        } catch (error) {
            throw error
        }

    },

    update: async (data, id) => {
        try {
            let result = await db
                .updateTable("bloques_horarios")
                .set(data)
                .where("bloques_horarios.id_bloque", "=", id)
                .execute()
        } catch (error) {
            throw error
        }
    },

    delete: async (id) => {
        try {
            let result = await db
                .deleteFrom("bloques_horarios")
                .where("bloques_horarios.id_bloque", "=", id)
                .execute()
        } catch (error) {
            throw error
        }
    },
}

export interface HorariosGradosRepositoryInterface {
    createBloque(bloque: HorarioGradoInsertable): Promise<void>
    getHorarioByGrado(id: GradoID): Promise<HorarioGrado[] | undefined>
}

export let horariosGradosRepository: HorariosGradosRepositoryInterface = {
    createBloque: async (bloque) => {
        try {
            await db.insertInto("horarios_grados").values(bloque).execute()
        } catch (error) {
            throw error
        }
    },

    getHorarioByGrado: async (id) => {
        try {
            let result = await db
                .selectFrom("horarios_grados")
                .selectAll()
                .where('horarios_grados.id_grado', '=', id)
                .execute()
            return result
        } catch (error) {
            throw error
        }
    },
}

export interface HorariosGradosAltRepositoryInterface {
    createBloque(bloque: HorarioGradoAltInsertable, trx?: Transaction<Database>,): Promise<void>
    getHorarioByGrado(id: HorarioID): Promise<HorarioGradoAlt[] | undefined>
}

export let horariosGradosAltRepository: HorariosGradosAltRepositoryInterface = {
    createBloque: async (bloque, trx) => {
        try {
            if (!trx) {
                await db.insertInto("horarios_grados_alt").values(bloque).execute()
            } else {
                await trx.insertInto("horarios_grados_alt").values(bloque).execute()               
            }
        } catch (error) {
            throw error
        }
    },

    getHorarioByGrado: async (id) => {
        try {
            let result = await db
                .selectFrom("horarios_grados_alt")
                .selectAll()
                .where('horarios_grados_alt.id_horario', '=', id)
                .execute()
            return result
        } catch (error) {
            throw error
        }
    },
}