import { alumnosRepository, representantesRepository } from "$lib/database/repositories/alumnos.repository";
import type { Alumno, AlumnoInsertable } from "$lib/database/types";
import async from "$lib/utils/asyncHandler";
import { capitalizeFirstLetter } from "$lib/utils/capitlizeFirstLetter";
import { getAge } from "$lib/utils/getAge";
import type { RequestEvent } from "@sveltejs/kit";
import { printAceptacion, printBuenaConducta, printConstanciaEstudio, printConstanciaInscripcion, printConstanciaRetiro, printFunc } from "./pdf";
import { db } from "$lib/database";
import path from "path";
import { unlinkSync } from "fs";
import type pino from "pino";
import { invalidateAll } from "$app/navigation";
import { createAlumnoDocDef } from "./pdf/alumnosDocuments";

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

async function getObjects(alumno: Alumno, log: pino.Logger) {
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
        .where((eb) => eb.or([
            eb('empleados.cargo', '=', 'Director'),
            eb('empleados.cargo', '=', 'Directora')
        ]))
        .executeTakeFirst()
    , log)

    let timeId = new Date().toISOString().replaceAll(' ', '').replaceAll(':', '').replaceAll('-', '').replaceAll('.', '')
    let documentId = `${alumno.cedula_escolar}_${timeId}`

    return { grado, grado_cursado, director, timeId, documentId }
}

export async function getBuenaConducta({ request, locals }: RequestEvent,) {
    let { log, response } = locals;
    let data = await request.formData()
    let cedula = data.get('cedula_escolar') as string

    let alumno = await async(alumnosRepository.getById(cedula), log)
    if (!alumno) {
        return response.error('El alumno no existe')
    }

    let { grado, grado_cursado, director, timeId, documentId } = await getObjects(alumno, log)
    let temporalPath = path.join(process.cwd(), `static/constancias/alumnos/temporal/buena_conducta_${documentId}.pdf`)

    printBuenaConducta(alumno, grado, grado_cursado, director, temporalPath)
    setTimeout(() => {
        unlinkSync(temporalPath)
    }, 10000)

    return response.success('Documento creado correctamente', { documentId })
}

export async function getConstanciaEstudio({ request, locals }: RequestEvent,) {
    let { log, response } = locals;
    let data = await request.formData()
    let cedula = data.get('cedula_escolar') as string

    let alumno = await async(alumnosRepository.getById(cedula), log)
    if (!alumno) {
        return response.error('El alumno no existe')
    }

    let { grado, grado_cursado, director, timeId, documentId } = await getObjects(alumno, log)
    let temporalPath = path.join(process.cwd(), `static/constancias/alumnos/temporal/constancia_estudio_${documentId}.pdf`)

    printConstanciaEstudio(alumno, grado, grado_cursado, director, temporalPath)
    setTimeout(() => {
        unlinkSync(temporalPath)
    }, 10000)

    return response.success('Documento creado correctamente', { documentId })
}

export async function getAceptacion({ request, locals }: RequestEvent,) {
    let { log, response } = locals;
    let data = await request.formData()
    let cedula = data.get('cedula_escolar') as string

    let alumno = await async(alumnosRepository.getById(cedula), log)
    if (!alumno) {
        return response.error('El alumno no existe')
    }

    let { grado, grado_cursado, director, timeId, documentId } = await getObjects(alumno, log)
    let temporalPath = path.join(process.cwd(), `static/constancias/alumnos/temporal/constancia_aceptacion_${documentId}.pdf`)

    printAceptacion(alumno, grado, grado_cursado, director, temporalPath)
    setTimeout(() => {
        unlinkSync(temporalPath)
    }, 10000)

    return response.success('Documento creado correctamente', { documentId })
}

export async function getConstanciaInscripcion({ request, locals }: RequestEvent,) {
    let { log, response } = locals;
    let data = await request.formData()
    let cedula = data.get('cedula_escolar') as string

    let alumno = await async(alumnosRepository.getById(cedula), log)
    if (!alumno) {
        return response.error('El alumno no existe')
    }

    let { grado, grado_cursado, director, timeId, documentId } = await getObjects(alumno, log)
    let temporalPath = path.join(process.cwd(), `static/constancias/alumnos/temporal/constancia_inscripcion_${documentId}.pdf`)

    printConstanciaInscripcion(alumno, grado, grado_cursado, director, temporalPath)
    setTimeout(() => {
        unlinkSync(temporalPath)
    }, 10000)

    return response.success('Documento creado correctamente', { documentId })
}

export async function getConstanciaRetiro({ request, locals }: RequestEvent,) {
    let { log, response } = locals;
    let data = await request.formData()
    let cedula = data.get('cedula_escolar') as string

    let alumno = await async(alumnosRepository.getById(cedula), log)
    if (!alumno) {
        return response.error('El alumno no existe')
    }

    let { grado, grado_cursado, director, timeId, documentId } = await getObjects(alumno, log)
    let temporalPath = path.join(process.cwd(), `static/constancias/alumnos/temporal/constancia_retiro_${documentId}.pdf`)

    printConstanciaRetiro(alumno, grado, grado_cursado, director, temporalPath)
    setTimeout(() => {
        unlinkSync(temporalPath)
    }, 10000)

    return response.success('Documento creado correctamente', { documentId })
}

export async function retirarAlumnoHandler({ request, locals }: RequestEvent) {
    let { log, response } = locals;
    let cedula_escolar = (await request.formData()).get('cedula_escolar') as string

    let alumno = await async(alumnosRepository.getById(cedula_escolar), log)
    if (!alumno) {
        return response.error('El alumno no existe')
    }

    // SACAR DE LOS GRADOS CURSADOS/FINALIZAR
    // CAMBIAR ESTATUS
    await async(
        db.transaction().execute(async (trx) => {
            await trx.deleteFrom('grados_alumnos').where('grados_alumnos.id_alumno', '=', cedula_escolar).execute()
            await trx.updateTable('grados_cursados').set({ estado: 'Finalizado' }).where('grados_cursados.id_alumno', '=', cedula_escolar).execute()
            await trx.updateTable('alumnos').set({ estado: "Retirado" }).where('alumnos.cedula_escolar', '=', cedula_escolar).execute()
        })
    , log)

    let { grado, grado_cursado, director, timeId, documentId } = await getObjects(alumno, log)

    // PATHS
    let retiroPath = path.join(process.cwd(), `static/constancias/alumnos/temporal/constancia_retiro_${documentId}.pdf`)
    let inscripcionPath = path.join(process.cwd(), `static/constancias/alumnos/temporal/constancia_inscripcion_${documentId}.pdf`)
    let aceptacionPath = path.join(process.cwd(), `static/constancias/alumnos/temporal/constancia_aceptacion_${documentId}.pdf`)
    let estudioPath = path.join(process.cwd(), `static/constancias/alumnos/temporal/constancia_estudio_${documentId}.pdf`)
    let buenaConductaPath= path.join(process.cwd(), `static/constancias/alumnos/temporal/buena_conducta_${documentId}.pdf`)

    // GENERAR DOCUMENTOS
    printConstanciaRetiro(alumno, grado, grado_cursado, director, retiroPath)
    printConstanciaInscripcion(alumno, grado, grado_cursado, director, inscripcionPath)
    printAceptacion(alumno, grado, grado_cursado, director, aceptacionPath)
    printConstanciaEstudio(alumno, grado, grado_cursado, director, estudioPath)
    printBuenaConducta(alumno, grado, grado_cursado, director, buenaConductaPath)

    // Eliminar documentos
    setTimeout(() => {
        unlinkSync(retiroPath)
        unlinkSync(inscripcionPath)
        unlinkSync(aceptacionPath)
        unlinkSync(estudioPath)
        unlinkSync(buenaConductaPath)
    }, 10000)

    let paths = [retiroPath, inscripcionPath, aceptacionPath, estudioPath, buenaConductaPath].map((p) => {
        let name = p.replaceAll('\\', '/')
        let path = p.replaceAll('\\', '/')
        path = path.slice(path.search('static'))
        return {
            name: name.slice(name.lastIndexOf('/') + 1),
            path: path.slice(path.indexOf('/'))
        }
    })

    return response.success('Documento creado correctamente', {
        paths: paths
    })
}

export async function printAlumnoHandler({ request, locals }: RequestEvent,) {
    let { log, response } = locals;
    let data = await request.formData()
    let cedula = data.get('cedula_escolar') as string

    let alumno = await async(alumnosRepository.getById(cedula), log)
    if (!alumno) {
        return response.error('El alumno no existe')
    }

    let representantes = await async(
        db.selectFrom('representantes')
        .innerJoin('representantes_alumnos', 'representantes.cedula', 'representantes_alumnos.id_representante')
        .selectAll()
        .where('representantes_alumnos.id_alumno', '=', alumno.cedula_escolar)
        .execute()
    , log)

    let gradosCursados = await async(
        db.selectFrom('grados_cursados')
        .selectAll()
        .where("grados_cursados.id_alumno", '=', alumno.cedula_escolar)
        .execute()
    ,log)

    let timeId = new Date().toISOString().replaceAll(' ', '').replaceAll(':', '').replaceAll('-', '').replaceAll('.', '')
    let documentId = `${alumno.cedula_escolar}_${timeId}`
    let temporalPath = path.join(process.cwd(), `static/constancias/alumnos/temporal/alumno_${documentId}.pdf`)

    printFunc(
        createAlumnoDocDef(alumno, representantes, gradosCursados),
        temporalPath
    )

    setTimeout(() => {
        unlinkSync(temporalPath)
    }, 10000)

    return response.success('Documento creado correctamente', { documentId })
}