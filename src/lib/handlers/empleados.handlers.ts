import { db } from "$lib/database";
import { empleadosRepository, type EmpleadosRepositoryInterface } from "$lib/database/repositories/profesores.repository";
import type { EmpleadoInsertable } from "$lib/database/types";
import async from "$lib/utils/asyncHandler";
import { getAge } from "$lib/utils/getAge";
import { getFormData } from "$lib/utils/getFormData";
import { InsertEmpleadoSchema, newValidationFailObject, validateObject } from "$lib/utils/validators";
import { fail, type RequestEvent } from "@sveltejs/kit";
import path from 'path'
import { printConstanciaAceptacionEmpleado, printFunc } from "./pdf";
import { unlinkSync } from "fs";
import { createEmpleadoDocDef } from "./pdf/empleadosDocuments";

export async function createEmpleadoHandler(
    { request, locals }: RequestEvent,
    mock?: any,
    er: EmpleadosRepositoryInterface = empleadosRepository
) {
    let { response, log } = locals
    let nEmpleado = {
        cedula: "",
        primer_nombre: "",
        segundo_nombre: "",
        primer_apellido: "",
        segundo_apellido: "",
        sexo: "" as "Masculino" | "Femenino",
        fecha_nacimiento: "",

        direccion: "",

        grado_instruccion: "",
        especializacion: "",
        cargo: "",

        area: "",
        fecha_ingreso: "",
        turno: "" as 'Mañana' | 'Tarde'
    } satisfies Omit<Omit<EmpleadoInsertable, "edad">, "tiempo_servicio"> 

    await async(getFormData(nEmpleado, request, mock), log)

    let validationResult = validateObject(nEmpleado, InsertEmpleadoSchema.omit({ edad: true, tiempo_servicio: true }))

    if (!validationResult.success) {
        return newValidationFailObject(validationResult.error, log)
    }

    // // NO PUEDE EXISTIR EN LA BASE DE DATOS
    let empleadoFromDB = await async(empleadosRepository.getById(nEmpleado.cedula), log)
    if (empleadoFromDB) {
        return fail(401, response.error('El empleado ya existe.'))
    }

    await async(er.create({
        ...nEmpleado,
        edad: getAge(nEmpleado.fecha_nacimiento),
        tiempo_servicio: getAge(nEmpleado.fecha_ingreso),
    }), log)

    return response.success('Empleado creado correctamente.')
}

export async function getConstanciaAceptacion({ request, locals }: RequestEvent,) {
    let { log, response } = locals;
    let data = await request.formData()
    let cedula = data.get('cedula') as string

    let empleado = await async(empleadosRepository.getById(cedula), log)
    if (!empleado) {
        return response.error('El empleado no existe')
    }

    let director = await async(
        db
        .selectFrom('empleados')
        .selectAll()
        .where('empleados.cargo', '=', 'Director')
        .executeTakeFirst()
    , log)

    if (!director) {
        return response.error('No se ha registrado el director de la institucion')
    }

    let timeId = new Date().toISOString().replaceAll(' ', '').replaceAll(':', '').replaceAll('-', '').replaceAll('.', '')
    let documentId = `${empleado.cedula}_${timeId}`
    let temporalPath = path.join(process.cwd(), `static/constancias/empleados/temporal/constancia_aceptacion_${documentId}.pdf`)

    printConstanciaAceptacionEmpleado(empleado, director, temporalPath)
    setTimeout(() => {
        unlinkSync(temporalPath)
    }, 10000)

    return response.success('Documento creado correctamente', { documentoId: documentId })
}



export async function printEmpleadoHandler({ request, locals }: RequestEvent,) {
    let { log, response } = locals;
    let data = await request.formData()
    let cedula = data.get('cedula') as string

    let empleado = await async(empleadosRepository.getById(cedula), log)
    if (!empleado) {
        return response.error('El empleado no existe')
    }

    let timeId = new Date().toISOString().replaceAll(' ', '').replaceAll(':', '').replaceAll('-', '').replaceAll('.', '')
    let documentId = `${empleado.cedula}_${timeId}`
    let temporalPath = path.join(process.cwd(), `static/constancias/empleados/temporal/empleado_${documentId}.pdf`)

    printFunc(
        createEmpleadoDocDef(empleado),
        temporalPath
    )

    setTimeout(() => {
        unlinkSync(temporalPath)
    }, 10000)

    return response.success('Documento creado correctamente', { documentoId: documentId })
}