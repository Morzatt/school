import { alumnosRepository } from "$lib/database/repositories/alumnos.repository";
import { expect, test, vi } from "vitest"

// test("", async () => {
//     let result = await alumnosRepository.create({
//         cedula_escolar: "11930451822",
//         primer_nombre: "Jose",
//         segundo_nombre: "Alberto",
//         primer_apellido: "Riveros",
//         segundo_apellido: "Campos",
//         sexo: "Masculino",
//         fecha_nacimiento: "2019-01-01",
//         edad: "6",
//     })

//     let spy = vi.spyOn(alumnosRepository, "create")

//     expect(spy).toHaveBeenCalled()
// })
