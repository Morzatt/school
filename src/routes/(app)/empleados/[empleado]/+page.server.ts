import { empleadosRepository } from '$lib/database/repositories/profesores.repository';
import async from '$lib/utils/asyncHandler';
import { error, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Grado } from '$lib/database/types';
import { db } from '$lib/database';
import { getConstanciaAceptacion, printEmpleadoHandler } from '$lib/handlers/empleados.handlers';
import path from 'path'
import { existsSync, unlinkSync, writeFileSync } from 'fs';
import { mkdir } from 'fs/promises';

export const load = (async ({ locals, url }) => {
    let { log } = locals;
    let id = getId(url.pathname) as string
    let empleado = await async(empleadosRepository.getById(id), log)

    if (!empleado) {
        return error(404, "El empleado no existe.")
    }

    let grado: Grado | undefined;

    if (empleado.area === "Docente") {
        grado = await async(
            db
            .selectFrom('grados')
            .where('grados.profesor', '=', empleado.cedula)
            .selectAll()
            .executeTakeFirst()
        , log)
    }

    return { empleado, grado };
}) satisfies PageServerLoad;

function getId(url: string): string {
    return url.slice(url.lastIndexOf("/") + 1)
}

export const actions = {
    eliminar: async ({locals, request}) => {
        let { log, response } = locals;
        let data = await request.formData()
        let cedula = data.get('empleado') as string

        await async(empleadosRepository.delete(cedula), log)
        redirect(307, '/empleados')
    },

    retirar: async ({locals, request}) => {
        let { log, response } = locals;
        let data = await request.formData()
        let cedula = data.get('empleado') as string

        await async(
            db
            .updateTable('grados')
            .set({
                profesor: null
            })
            .where('grados.profesor', '=', cedula)
            .execute()
        , log)
        await async(empleadosRepository.update({ estado: "Retirado" }, cedula), log)
        return response.success('Empleado retirado correctamente.')
    },

    getConstanciaAceptacion: getConstanciaAceptacion,
    printEmpleado: printEmpleadoHandler,

    updateFotoPerfil: async ({ locals, request }) => {
        let { log, response } = locals;
        let data = await request.formData();

        let documento = {
            cedula_empleado: data.get('cedula_empleado') as string,
            archivo: data.get('archivo') as File,
        }

        let empleado = await async(empleadosRepository.getById(documento.cedula_empleado), log)

        let folderPath = path.join(process.cwd(), `/static/empleados/${documento.cedula_empleado}`)
        let folderExists = existsSync(folderPath)
        if (!folderExists) {
            await async(mkdir(folderPath), log)
        }

        let archivoPath: string;
        if (documento.archivo && documento.archivo.size > 0) {
            let fileExtension = documento.archivo.name.slice(documento.archivo.name.lastIndexOf('.'))
            let fileName = `foto_perfil_${documento.cedula_empleado}${fileExtension}`
            let filePath = path.join(folderPath, fileName)

            if (empleado && empleado.foto_path) {
                let fileExists = existsSync(path.join(process.cwd(), '/static', empleado.foto_path))
                if (fileExists) {
                    unlinkSync(path.join(process.cwd(), '/static', empleado.foto_path))
                }
            }

            writeFileSync(filePath, Buffer.from(await documento.archivo.arrayBuffer()));
            archivoPath = path.join(`/empleados/${documento.cedula_empleado}`, fileName)
        } else {
            return response.error('El archivo esta vacio')
        }

        db
        .updateTable('empleados')
        .set({
            foto_path: archivoPath,
        })
        .where('empleados.cedula', '=', documento.cedula_empleado)
        .execute()

        return response.success('Archivo subido exitosamente')
    },
} satisfies Actions