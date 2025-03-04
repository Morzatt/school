import type { Transaction } from "kysely"
import { db } from ".."
import type { Alumno, AlumnoInsertable, AlumnoUpdateable, Database, Representante, RepresentanteInsertable, RepresentantesAlumnos, RepresentantesAlumnosInsertable, RepresentanteUpdateable, TelefonosRepresentante } from "../types"

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




// REPRESENTANTES
export interface RepresentantesRepositoryInterface {
    create: (alumno: RepresentanteInsertable, trx: Transaction<Database>) => Promise<void>    ,
    getById: (cedula: string) => Promise<Representante | undefined>
    delete: (cedula: string) => Promise<void>
    update: (data: RepresentanteUpdateable, cedula: string) => Promise<void>
}

export const representantesRepository = {
    create: async (representante, trx) => {
        try {
            if (trx) {
                await trx.insertInto("representantes").values(representante).execute()
            } else {
                await db.insertInto("representantes").values(representante).execute()
            }
        } catch (error) {
            throw error 
        }
    },

    getById: async (cedula) => {
         try {
           let result = await db.selectFrom("representantes").selectAll().where("representantes.cedula", "=", cedula).executeTakeFirst()
           return result
        } catch (error) {
            throw error 
        }       
    },

    delete: async (cedula) => {
         try {
           await db.deleteFrom("representantes").where("representantes.cedula", "=", cedula).execute()
        } catch (error) {
            throw error 
        }    
    },

    update: async (data, cedula) => {
         try {
             await db.updateTable("representantes").set(data).where("representantes.cedula", "=", cedula).execute()
        } catch (error) {
            throw error 
        }    
    }
} satisfies RepresentantesRepositoryInterface 

export type RepresentantesByAlumnosResult = Representante & RepresentantesAlumnos
export type AlumnosByRepresentantesResult = Alumno & RepresentantesAlumnos

// REPRESENTANTES ALUMNOS
export interface RepresentantesAlumnosRepositoryInterface {
    create: (rep: RepresentantesAlumnosInsertable) => Promise<void> 
    getRepresentantesByAlumno: (alumno: string) => Promise<RepresentantesByAlumnosResult[] | undefined>
    getAlumnosByRepresentante: (representante: string) => Promise<AlumnosByRepresentantesResult[] | undefined>
    delete: (representante: string, alumno: string) => Promise<void>
    update: (data: AlumnoUpdateable, cedula: string) => Promise<void>
}

export const representantesAlumnosRepository = {
    create: async (rep) => {
        try {
           await db.insertInto("representantes_alumnos").values(rep).execute()
        } catch (error) {
            throw error 
        }
    },

    // Trae todos los representantes asociados a un alumno
    getRepresentantesByAlumno: async (alumno) => {
         try {
             let result = await db
                .selectFrom("representantes")
                .selectAll()
                .innerJoin("representantes_alumnos", "representantes.cedula", "representantes_alumnos.id_representante")
                .where("representantes_alumnos.id_alumno", "=", alumno)
                .selectAll()
                .execute()
            return result
        } catch (error) {
            throw error 
        }       
    },

    // Trae todos los alumnos asociados a un representante
    getAlumnosByRepresentante: async (representante) => {
         try {
             let result = await db
                 .selectFrom("alumnos")
                 .selectAll()
                 .innerJoin("representantes_alumnos", "alumnos.cedula_escolar", "representantes_alumnos.id_alumno")
                 .where("representantes_alumnos.id_representante", "=", representante)
                 .selectAll()
                .execute()
           return result
        } catch (error) {
            throw error 
        }       
    },

    delete: async (representante, alumno) => {
         try {
            await db.deleteFrom("representantes_alumnos")
            .where((eb) => eb.and([
                eb('representantes_alumnos.id_representante', '=', representante),
                eb('representantes_alumnos.id_alumno', '=', alumno)
            ]))
            .execute()
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
} satisfies RepresentantesAlumnosRepositoryInterface 