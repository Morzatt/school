import { db } from ".."
import type { Alumno, AlumnoInsertable, AlumnoUpdateable } from "../types"

export interface AlumnosRepositoryInterface {
    create: (alumno: AlumnoInsertable) => Promise<void>    ,
    getById: (cedula: string) => Promise<Alumno | undefined>
    getAll: () => Promise<Alumno[] | undefined>
    delete: (cedula: string) => Promise<void>
    update: (data: AlumnoUpdateable, cedula: string) => Promise<void>
}

export const alumnosRepository = {
    create: async (alumno) => {
        try {
           await db.insertInto("alumnos").values(alumno).execute()
        } catch (error) {
            throw error 
        }
    },

    getById: async (cedula) => {
         try {
           let result = await db.selectFrom("alumnos").selectAll().where("alumnos.cedula_escolar", "=", cedula).executeTakeFirst()
           return result
        } catch (error) {
            throw error 
        }       
    },
    getAll: async () => {
         try {
           let result = await db.selectFrom("alumnos").selectAll().execute()
           return result
        } catch (error) {
            throw error 
        }       
    },

    delete: async (cedula) => {
         try {
           await db.deleteFrom("alumnos").where("alumnos.cedula_escolar", "=", cedula).execute()
        } catch (error) {
            throw error 
        }    
    },

    update: async (data, cedula) => {
         try {
            await db.updateTable("alumnos").set(data).where("alumnos.cedula_escolar", "=", cedula).execute()
        } catch (error) {
            throw error 
        }    
    }
} satisfies AlumnosRepositoryInterface