import { gradosAlumnosRepository, gradosRepository, materiasRepository } from "$lib/database/repositories/grados.repository"
import type { Alumno, GradoAlumnoInsertable, GradoInsertable, MateriaInsertable } from "$lib/database/types"
import { describe, expect, test, vi } from "vitest"

// describe("GRADOS", () => {
//     test("REGISTRAR GRADO", async () => {
//         let p = {
//             id_grado: "2NAM",
//             turno: "Mañana",
//             numero: '2',
//             grado: "Nivel",
//             seccion: 'A',
//             profesor: "9933618",
//         } satisfies GradoInsertable

//         try {
//             await gradosRepository.create(p)           
//         } catch (error) {
//             console.log(error) 
//         }
//     })

    // test("REGISTRAR alumnos en grado", async () => {
    //     let p = {
    //         id_grado: "4GAM",
    //         id_alumno: '21930451822'
    //     } satisfies GradoAlumnoInsertable

    //     try {
    //         await gradosAlumnosRepository.create(p)           
    //     } catch (error) {
    //         console.log(error) 
    //     }
    // })

    // test("REGISTRAR alumnos en grado", async () => {
    //     let p = {
    //         id_grado: "4GAM",
    //         id_alumno: '11930451822'
    //     } satisfies GradoAlumnoInsertable

    //     try {
    //         await gradosAlumnosRepository.create(p)           
    //     } catch (error) {
    //         console.log(error) 
    //     }
    // })

    // test("TOMAR TODOS LOS ALUMNOS DE UN GRADO", async () => {
    //     try {
    //         let alumnos = await gradosAlumnosRepository.getAllAlumnosByGrado("4GAM")           

    //         console.log(alumnos)
    //     } catch (error) {
    //         console.log(error) 
    //     }
    // })

    // test("CREAR MATERIAS", async () => {
    //     try {
    //         let materias: MateriaInsertable[] =[
    //             {
    //                 nombre_materia: "Matematicas"
    //             },
    //             {
    //                 nombre_materia: "GEOGRAFIA"
    //             },
    //             {
    //                 nombre_materia: "Educacion Fisica"
    //             },
    //             {
    //                 nombre_materia: "Biologia"
    //             },
    //         ]

    //         for (let i of materias) {
    //             await materiasRepository.create(i)
    //         }
    //     } catch (error) {
    //         console.log(error) 
    //     }
    // })
// })