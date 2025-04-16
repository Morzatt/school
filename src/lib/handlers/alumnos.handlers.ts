import { alumnosRepository } from "$lib/database/repositories/alumnos.repository";
import type { AlumnoInsertable } from "$lib/database/types";
import async from "$lib/utils/asyncHandler";
import { capitalizeFirstLetter } from "$lib/utils/capitlizeFirstLetter";
import { getAge } from "$lib/utils/getAge";
import type { RequestEvent } from "@sveltejs/kit";
import { printBuenaConducta } from "./pdf";
import { db } from "$lib/database";
import path from "path";
import { unlinkSync } from "fs";

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


export async function getBuenaConducta({ request, locals }: RequestEvent,) {
    let { log, response } = locals;
    let data = await request.formData()
    let cedula = data.get('cedula_escolar') as string

    let alumno = await async(alumnosRepository.getById(cedula), log)
    if (!alumno) {
        return response.error('El alumno no existe')
    }

    let grado = await async(
        db
        .selectFrom('grados')
        .leftJoin('grados_alumnos', 'grados.id_grado', 'grados_alumnos.id_grado')
        .where('grados_alumnos.id_alumno', '=', alumno.cedula_escolar)
        .selectAll()
        .executeTakeFirst()
    , log)

    let grado_cursado = await async(
        db
        .selectFrom('grados_cursados')
        .where('grados_cursados.id_alumno', '=', alumno.cedula_escolar)
        .selectAll()
        .orderBy('grados_cursados.fecha asc')
        .executeTakeFirst()
    , log) 

    let director = await async(
        db
        .selectFrom('empleados')
        .selectAll()
        .where('empleados.cargo', '=', 'Director')
        .executeTakeFirst()
    , log)

    let timeId = new Date().toISOString().replaceAll(' ', '').replaceAll(':', '').replaceAll('-', '').replaceAll('.', '')
    let documentId = `${alumno.cedula_escolar}_${timeId}`
    let temporalPath = path.join(process.cwd(), `static/constancias/alumnos/temporal/buena_conducta_${documentId}.pdf`)

    printBuenaConducta(alumno, grado, grado_cursado, director, temporalPath)
    setTimeout(() => {
        unlinkSync(temporalPath)
    }, 10000)

    return response.success('Documento creado correctamente', { documentId })
}