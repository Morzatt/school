import { db } from "../";
import type { Alumno, Grado, GradoAlumnoInsertable, GradoID, GradoInsertable, GradoUpdateable, MateriaInsertable } from "../types";

export interface GradosRepositoryInterface {
    create(grado: GradoInsertable): Promise<void>
    getById(id: GradoID): Promise<Grado| undefined>
    delete(id: GradoID): Promise<void>
    update(grado: GradoUpdateable, id: GradoID): Promise<void>
}

export let gradosRepository: GradosRepositoryInterface = {
    create: async (grado) => {
        try {
            await db.insertInto("grados").values(grado).execute()
        } catch (error) {
            throw error
        }
    },

    getById: async (id) => {
        try {
            let result = await db
                .selectFrom("grados")
                .selectAll()
                .where("grados.id_grado", "=", id)
                .executeTakeFirst()
            if (result) return result;
        } catch (error) {
            throw error
        }

    },


    update: async (data, id) => {
        try {
            let result = await db
                .updateTable("grados")
                .set(data)
                .where("grados.id_grado", "=", id)
                .execute()
        } catch (error) {
            throw error
        }
    },

    delete: async (id) => {
        try {
            let result = await db
                .deleteFrom("grados")
                .where("grados.id_grado", "=", id)
                .execute()
        } catch (error) {
            throw error
        }
    },
}

// GRADOS+ALUMNOS

export interface GradosAlumnosRepositoryInterface {
    create(grado: GradoAlumnoInsertable): Promise<void>
    getAllAlumnosByGrado(id: GradoID): Promise<Alumno[] | undefined>
    deleteAlumnoFromGrado(id_alumno: string): Promise<void>
    update(grado: GradoUpdateable, id: GradoID): Promise<void>
}

export let gradosAlumnosRepository: GradosAlumnosRepositoryInterface = {
    create: async (ga) => {
        try {
            await db.insertInto("grados_alumnos").values(ga).execute()
        } catch (error) {
            throw error
        }
    },

    getAllAlumnosByGrado: async (id) => {
        try {
            let result = await db
                .selectFrom("alumnos")
                .innerJoin('grados_alumnos', 'alumnos.cedula_escolar', 'grados_alumnos.id_alumno')
                .where('grados_alumnos.id_grado', '=', id) 
                .select([
                    'alumnos.cedula_escolar',
                    'alumnos.created_at',
                    'alumnos.edad',
                    'alumnos.fecha_nacimiento',
                    'alumnos.primer_apellido',
                    'alumnos.primer_nombre',
                    'alumnos.segundo_apellido',
                    'alumnos.segundo_nombre',
                    'alumnos.sexo'
                ])
                .execute()
            if (result) return result;
        } catch (error) {
            throw error
        }

    },

    update: async (data, id) => {
        try {
            let result = await db
                .updateTable("grados")
                .set(data)
                .where("grados.id_grado", "=", id)
                .execute()
        } catch (error) {
            throw error
        }
    },

    deleteAlumnoFromGrado: async (id_alumno) => {
        try {
            let result = await db
                .deleteFrom("grados_alumnos")
                .where("grados_alumnos.id_alumno", "=", id_alumno)
                .execute()
        } catch (error) {
            throw error
        }
    },
}


export interface MateriasRepositoryInterface {
    create(materia: MateriaInsertable): Promise<void>
    delete(id_materia: string): Promise<void>
    changeName(name: string, id_materia: string): Promise<void>
}

export let materiasRepository: MateriasRepositoryInterface = {
    create: async (materia) => {
        try {
            await db.insertInto("materias").values(materia).execute()
        } catch (error) {
            throw error
        }
    },

    changeName: async (newName, id_materia) => {
        try {
            await db
                .updateTable("materias")
                .set({ nombre_materia: newName })
                .where("materias.id_materia", "=", id_materia)
                .execute()
        } catch (error) {
            throw error
        }
    },

    delete: async (id) => {
        try {
            let result = await db
                .deleteFrom("materias")
                .where("materias.id_materia", "=", id)
                .execute()
        } catch (error) {
            throw error
        }
    },

}