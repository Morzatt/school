import { alumnosRepository } from "$lib/database/repositories/alumnos.repository";
import type { AlumnoInsertable } from "$lib/database/types";
import async from "$lib/utils/asyncHandler";
import { capitalizeFirstLetter } from "$lib/utils/capitlizeFirstLetter";
import { getAge } from "$lib/utils/getAge";
import type { RequestEvent } from "@sveltejs/kit";

export async function createAlumnoHandler (
    { request, locals }: RequestEvent,
    mock?: any,
    ar = alumnosRepository
) {
    let {log, response} = locals;
    let data = await request.formData()

    let alumno = {
        cedula_escolar: data.get("cedula_escolar") as string,
        primer_nombre: capitalizeFirstLetter(data.get("primer_nombre") as string),
        segundo_nombre: capitalizeFirstLetter(data.get("segundo_nombre") as string),
        primer_apellido: capitalizeFirstLetter(data.get("primer_apellido") as string),
        segundo_apellido: capitalizeFirstLetter(data.get("segundo_apellido") as string),
        sexo: data.get("sexo") as "Masculino" | "Femenino",
        fecha_nacimiento: data.get("fecha_nacimiento") as string,
        edad: '',
    } satisfies AlumnoInsertable
    alumno.edad = getAge(alumno.fecha_nacimiento)

    await async(ar.create(alumno!), log)
    log.info("Nuevo Alumno Creado", { alumno: alumno })

    return response.success("Nuevo Alumno creado correctamente!")
}

