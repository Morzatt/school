import { alumnosRepository } from "$lib/database/repositories/alumnos.repository";
import type { AlumnoInsertable } from "$lib/database/types";
import async from "$lib/utils/asyncHandler";
import type { RequestEvent } from "../../routes/(app)/$types";

export async function createAlumnoHandler (
    { request, locals }: RequestEvent,
    mock?: any,
    ar = alumnosRepository
) {
    let {log, response} = locals;
    let data = await request.formData()

    let alumno = {
        cedula_escolar: data.get("cedula_escolar"),
        cedula_alumno: data.get("cedula_alumno"),
        primer_nombre: data.get("primer_nombre"),
        segundo_nombre: data.get("segundo_nombre"),
        primer_apellido: data.get("primer_apellido"),
        segundo_apellido: data.get("segundo_apellido"),
        sexo: data.get("sexo"),
        fecha_nacimiento: data.get("fecha_nacimiento")
    } satisfies AlumnoInsertable

    await async(ar.create(alumno), log)
    log.info("Nuevo Alumno Creado", { alumno: alumno })

    return response.success("Nuevo Alumno creado correctamente!")
}