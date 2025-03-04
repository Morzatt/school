import { empleadosRepository } from "$lib/database/repositories/profesores.repository";
import type { EmpleadoInsertable } from "$lib/database/types";
import { describe, expect, test, vi } from "vitest"

describe("EMPLEADOS", () => {
    test("Crear Empleado", async () => {
        let p = {
            cedula: "82293819",
            primer_nombre: "Lourdes",
            segundo_nombre: "Galilalla",
            primer_apellido: "De Silveira",
            segundo_apellido: "Espejo",
            sexo: "Femenino",
            fecha_nacimiento: '1994-02-01',
            edad: "42",
            direccion: "Urb. Agua SALADA",
            grado_instruccion: "Licenciada",
            especializacion: "Geologia",
            fecha_ingreso: "2025-02-02",
            tiempo_servicio: "1 año",
            turno: "Mañana",
            cargo: "Administradora",
            area: 'Administrativo'
        } satisfies EmpleadoInsertable        

        await empleadosRepository.create(p)
    })
})

// describe("PROFESORES", () => {
//     test("REGISTRAR PROFESOR", async () => {
//         let p = {
//             cedula: "9933618",
//             primer_nombre: "Budevia",
//             segundo_nombre: "Josefina",
//             primer_apellido: "Tineo",
//             segundo_apellido: "Velazques",
//             sexo: "Femenino",
//             fecha_nacimiento: '1994-02-01',
//             edad: "42",
//             direccion: "Urb. Agua SALADA",
//             grado_instruccion: "Licenciada",
//             especializacion: "Geologia",
//             fecha_ingreso: "2025-02-02",
//             tiempo_servicio: "1 año",
//             turno: "Mañana",
//             cargo: "Docente"
//         } satisfies EmpleadoInsertable 

//         let spy = vi.spyOn(profesoresRepository, "create")

//         try {
//             await profesoresRepository.create(p)           
//         } catch (error) {
//             console.log(error) 
//         }
//     })
// })