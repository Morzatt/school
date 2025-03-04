import { db } from "$lib/database"
import { bloquesHorariosRepository, horariosGradosRepository } from "$lib/database/repositories/horarios.repository"
import type { BloqueHorario, BloqueHorarioInsertable, BloqueID, DiasSemana, HorarioGradoInsertable } from "$lib/database/types"
import { describe, expect, test, vi } from "vitest"

// describe("HORARIOS", () => {
    // test("CREAR BLOQUES DEHORARIO", async () => {
    //     try {
    //         let a = [['Lu', 'Lunes'], ['Ma', 'Martes'], ['Mi', 'Miercoles'], ['Ju', 'Jueves'], ['Vi', 'Viernes']]
    //         let horarios: Omit<BloqueHorarioInsertable, 'dia_semana'>[] = [
    //             {
    //                 id_bloque: "-700A-745A" as BloqueID,
    //                 hora_inicio: "07:00 AM", 
    //                 hora_fin: "07:45 AM",
    //             },
    //             {
    //                 id_bloque: "-745A-830A" as BloqueID,
    //                 hora_inicio: "07:45 AM", 
    //                 hora_fin: "08:30 AM",
    //             },
    //             {
    //                 id_bloque: "-830A-915A" as BloqueID,
    //                 hora_inicio: "08:30 AM", 
    //                 hora_fin: "09:15 AM",
    //             },
    //             {
    //                 id_bloque: "-915A-1000A" as BloqueID,
    //                 hora_inicio: "09:15 AM", 
    //                 hora_fin: "10:00 AM",
    //             },
    //             {
    //                 id_bloque: "-1000A-1045A" as BloqueID,
    //                 hora_inicio: "10:00 AM", 
    //                 hora_fin: "10:45 AM",
    //             },
    //             {
    //                 id_bloque: "-1045A-1130A" as BloqueID,
    //                 hora_inicio: "10:45 AM", 
    //                 hora_fin: "11:30 AM",
    //             },
    //             {
    //                 id_bloque: "-1130A-1215A" as BloqueID,
    //                 hora_inicio: "11:30 AM", 
    //                 hora_fin: "12:15 AM",
    //             },
    //         ]

    //         for (let i1 of a) {
    //             for (let i2 of horarios) {
    //                 await bloquesHorariosRepository.create({
    //                     ...i2,
    //                     id_bloque: `${i1[0]}${i2.id_bloque}` as BloqueID,
    //                     dia_semana: i1[1] as DiasSemana
    //                 })
    //             }
    //         }

    //     } catch (error) {
    //         console.log(error) 
    //     }
    // })

    // test("CREAR HORARIO DE SECCION", async () => {
    //     try {
    //         let dias = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi']
    //         let idBloques = ['-700A-745A', '-745A-830A', '-830A-915A', '-915A-1000A', '-1000A-1045A',
    //          '-1045A-1130A', '-1130A-1215A']

    //         let bloque = {
    //             id_grado: '4GAM',
    //             cedula_profesor: "9933618",
    //             id_materia: '25ffecd9-eef9-4a3e-a697-e449e2edd7f3'
    //         } satisfies Omit<HorarioGradoInsertable, "id_bloque">


    //         for (let d of dias) {
    //             for (let i of idBloques) {
    //                 await horariosGradosRepository.createBloque({
    //                     id_bloque: `${d}${i}` as BloqueID,
    //                     ...bloque
    //                 })
    //             }
    //         }

    //     } catch (error) {
    //         console.log(error)
    //     }
    // })

//     test("OBTENER HORARIO DE GRADO", async () => {
//         try {
//             let result = await db.selectFrom("bloques_horarios")
//             .innerJoin('horarios_grados', 'bloques_horarios.id_bloque', 'horarios_grados.id_bloque')
//             .innerJoin('grados', 'grados.id_grado', 'horarios_grados.id_grado')
//             .innerJoin('empleados', 'empleados.cedula', 'horarios_grados.cedula_profesor')
//             .innerJoin('materias', 'materias.id_materia', 'horarios_grados.id_materia')
//             .select((eb) => [
//                 'grados.numero','grados.grado', 'grados.seccion', 'grados.turno',
//                 eb.ref('empleados.primer_nombre').as('profesor'), 'empleados.primer_apellido',
//                 'materias.nombre_materia',
//                 'bloques_horarios.dia_semana', 'bloques_horarios.hora_inicio', 'bloques_horarios.hora_fin'
//             ])
//             .where('horarios_grados.id_grado', '=', '4GAM')
//             .execute()

//             const flat = result.reduce<typeof result>((acc, row) => {
//                 const claseEntry = {
//                     hora_inicio: (row.hora_inicio),
//                     hora_final: (row.hora_fin),
//                     materia: row.nombre_materia,
//                     profesor: row.profesor
//                 };

//                 const existingGrado = acc.find(g => g.grado === row.grado && g.seccion === row.seccion);

//                 if (existingGrado) {
//                     const existingDia = existingGrado.horario.find(d => d.dia_semana === row.dia_semana);

//                     if (existingDia) {
//                         existingDia.clases.push(claseEntry);
//                     } else {
//                         existingGrado.horario.push({
//                             dia_semana: row.dia_semana,
//                             clases: [claseEntry]
//                         });
//                     }
//                 } else {
//                     acc.push({
//                         numero: row.numero,
//                         grado: row.grado,
//                         seccion: row.seccion,
//                         horario: [{
//                             dia_semana: row.dia_semana,
//                             clases: [claseEntry]
//                         }]
//                     });
//                 }

//                 return acc;
//             }, []);

//             console.log(flat)
//         } catch (error) {
//             console.log(error)
//         }
//     })
// })