import { db } from "../";
import type { Empleado, EmpleadoInsertable, EmpleadoUpdateable } from "../types";

export interface EmpleadosRepositoryInterface {
    create(empleado: EmpleadoInsertable ): Promise<void>
    getById(cedula: string): Promise<Empleado| undefined>
    delete(cedula: string): Promise<void>
    update(empleado: EmpleadoUpdateable, cedula: string): Promise<void>
}

export let empleadosRepository: EmpleadosRepositoryInterface = {
    create: async (empleado) => {
        try {
            await db.insertInto("empleados").values(empleado).execute()
        } catch (error) {
            throw error
        }
    },

    getById: async (cedula) => {
        try {
            let result = await db.selectFrom("empleados")
                .selectAll()
                .where("empleados.cedula", "=", cedula)
                .executeTakeFirst()
            if (result) return result;
        } catch (error) {
            throw error
        }

    },


    update: async (data, cedula) => {
        try {
            let result = await db
                .updateTable("empleados")
                .set(data)
                .where("empleados.cedula", "=", cedula)
                .execute()
        } catch (error) {
            throw error
        }
    },

    delete: async (cedula) => {
        try {
            let result = await db
                .deleteFrom("empleados")
                .where("empleados.cedula", "=", cedula)
                .execute()
        } catch (error) {
            throw error
        }
    },
}