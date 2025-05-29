import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import fs, { accessSync } from 'node:fs';
import path from 'node:path';
import mime from 'mime';
import async, { handleError } from '$lib/utils/asyncHandler';
import type pino from 'pino';
import type { FormResponse } from '$lib/classes/responses.classes';
import { access } from 'node:fs/promises';

type DownloadFunction = (uniqueId: string, TEMP_DIR: string, log: pino.Logger<never, boolean>, response: FormResponse) => Promise<Response | undefined>;

export const GET: RequestHandler = async ({ locals, params, url }) => {
    let { log, response } = locals;
    const id = params.id;
    const type = url.searchParams.get('type')

    if (type === "backup") {
        const TEMP_DIR = path.join(process.cwd(), '/static/backups/temporal');
        return await downloadBackups(id, TEMP_DIR, log, response)
    }

    if (type === "horario") {
        const TEMP_DIR = path.join(process.cwd(), '/static/horarios/temporal');
        return await downloadHorario(id, TEMP_DIR, log, response)
    }

    if (type === "lista") {
        const TEMP_DIR = path.join(process.cwd(), '/static/horarios/temporal');
        return await downloadLista(id, TEMP_DIR, log, response)
    }

    if (type === "buena_conducta") {
        const TEMP_DIR = path.join(process.cwd(), '/static/constancias/alumnos/temporal'); 
        return await downloadBuenaConducta(id, TEMP_DIR, log, response)
    }

    if (type === "aceptacion") {
        const TEMP_DIR = path.join(process.cwd(), '/static/constancias/alumnos/temporal'); 
        return await downloadAceptacion(id, TEMP_DIR, log, response)
    }
    if (type === "estudio") {
        const TEMP_DIR = path.join(process.cwd(), '/static/constancias/alumnos/temporal'); 
        return await downloadEstudio(id, TEMP_DIR, log, response)
    }
    if (type === "inscripcion") {
        const TEMP_DIR = path.join(process.cwd(), '/static/constancias/alumnos/temporal'); 
        return await downloadInscripcion(id, TEMP_DIR, log, response)
    }
    if (type === "retiro") {
        const TEMP_DIR = path.join(process.cwd(), '/static/constancias/alumnos/temporal'); 
        return await downloadRetiro(id, TEMP_DIR, log, response)
    }

    if (type === "image") {
        const dir = path.join(process.cwd(), `/static`); 
        const filePath = url.searchParams.get('path') as string
        return await downloadFile(filePath, dir, log, response)
    }

    if (type === "constanciaAceptacionEmpleados") {
        const dir = path.join(process.cwd(), `/static/constancias/empleados/temporal`); 
        return await downloadFile(`constancia_aceptacion_${id}.pdf`, dir, log, response)
    }
};

async function accessReadStream(path: string) {
    try {
        await access(path, fs.constants.F_OK)
        const fileStream = fs.createReadStream(path);
        return fileStream
    } catch (error) {
        throw error
    }
}

let downloadFile: DownloadFunction = async (fileName, TEMP_DIR, log) => {
    const tempFilePath = path.join(TEMP_DIR, fileName);
    try {
        let fileStream = await async(accessReadStream(tempFilePath), log)
        return new Response(fileStream);
    } catch (e) {
        handleError(log, e, {})
    }
}

let downloadBackups: DownloadFunction = async (uniqueId, TEMP_DIR, log, response) => {
    const tempFileName = `backup_${uniqueId}.tar`;
    const tempFilePath = path.join(TEMP_DIR, tempFileName);

    try {
        let fileStream = await async(accessReadStream(tempFilePath), log)
        return new Response(fileStream);
    } catch (e) {
        handleError(log, e, {})
    }
}

let downloadHorario: DownloadFunction = async (uniqueId, TEMP_DIR, log, response) => {
    const tempFileName = `horario_${uniqueId}.pdf`;
    const tempFilePath = path.join(TEMP_DIR, tempFileName);
    try {
        let fileStream = await async(accessReadStream(tempFilePath), log)
        return new Response(fileStream);
    } catch (e) {
        handleError(log, e, {})
    }
}

let downloadLista: DownloadFunction = async (uniqueId, TEMP_DIR, log, response) => {
    const tempFileName = `lista_${uniqueId}.pdf`;
    const tempFilePath = path.join(TEMP_DIR, tempFileName);
    try {
        let fileStream = await async(accessReadStream(tempFilePath), log)
        return new Response(fileStream);
    } catch (e) {
        handleError(log, e, {})
    }
}

let downloadBuenaConducta: DownloadFunction = async (uniqueId, TEMP_DIR, log, response) => {
    const tempFileName = `buena_conducta_${uniqueId}.pdf`;
    const tempFilePath = path.join(TEMP_DIR, tempFileName);
    try {
        let fileStream = await async(accessReadStream(tempFilePath), log)
        return new Response(fileStream);
    } catch (e) {
        handleError(log, e, {})
    }
}

let downloadAceptacion: DownloadFunction = async (uniqueId, TEMP_DIR, log, response) => {
    const tempFileName = `constancia_aceptacion_${uniqueId}.pdf`;
    const tempFilePath = path.join(TEMP_DIR, tempFileName);
    try {
        let fileStream = await async(accessReadStream(tempFilePath), log)
        return new Response(fileStream);
    } catch (e) {
        handleError(log, e, {})
    }
}

let downloadEstudio: DownloadFunction = async (uniqueId, TEMP_DIR, log, response) => {
    const tempFileName = `constancia_estudio_${uniqueId}.pdf`;
    const tempFilePath = path.join(TEMP_DIR, tempFileName);
    try {
        let fileStream = await async(accessReadStream(tempFilePath), log)
        return new Response(fileStream);
    } catch (e) {
        handleError(log, e, {})
    }
}

let downloadInscripcion: DownloadFunction = async (uniqueId, TEMP_DIR, log, response) => {
    const tempFileName = `constancia_inscripcion_${uniqueId}.pdf`;
    const tempFilePath = path.join(TEMP_DIR, tempFileName);
    try {
        let fileStream = await async(accessReadStream(tempFilePath), log)
        return new Response(fileStream);
    } catch (e) {
        handleError(log, e, {})
    }
}

let downloadRetiro: DownloadFunction = async (uniqueId, TEMP_DIR, log, response) => {
    const tempFileName = `constancia_retiro_${uniqueId}.pdf`;
    const tempFilePath = path.join(TEMP_DIR, tempFileName);
    try {
        let fileStream = await async(accessReadStream(tempFilePath), log)
        return new Response(fileStream);
    } catch (e) {
        handleError(log, e, {})
    }
}