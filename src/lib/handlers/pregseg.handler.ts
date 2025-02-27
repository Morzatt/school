import { newValidationFailObject, pregsegSchema, recoverySchema, validateObject } from '$lib/utils/validators';
import { fail, type RequestEvent } from '@sveltejs/kit';
import type { InsertPregSeg } from '$lib/database/types';
import { pregSegRepository, type PregSegRepositoryInterface } from '$lib/database/repositories/preg_seg.repository';
import { usuarioRepository, type UsuarioRepositoryInterface } from '$lib/database/repositories/user.repository';
import z from "zod"
import { hashPwd } from '$lib/utils/hashPwd';
import { getFormData } from '$lib/utils/getFormData';
import { FormResponse } from '$lib/classes/responses.classes';
import async from '$lib/utils/asyncHandler';
import type { FormHandler } from './types.handler';

export const pregSegHandler = async (
    { request, locals }: RequestEvent,
    mock: { formData: InsertPregSeg },
    psr = pregSegRepository,
    ur = usuarioRepository,
) => {
    let { response, log } = locals

    let pregseg = {
        usuario: "",
        preg_1: "",
        res_1: "",
        preg_2: "",
        res_2: "",
    }
    await getFormData<InsertPregSeg>(pregseg, request, mock); 

    // TODO: CHECK IF USER EXISTS, CHECK IF USER ALREADY HAVE PREGSEG
    let dbuser = await async(ur.getByUsername(pregseg.usuario), log, pregseg.usuario)
    if (!dbuser) return response.error("El usuario no existe");

    let result = validateObject(pregseg, pregsegSchema);
    if (!result.success) return newValidationFailObject(result.error, log);

    pregseg.res_1.toLowerCase()
    pregseg.res_2.toLowerCase()

    await async(psr.insert(pregseg), log, { pregseg })
    log.info({ msg: "PREGUNTAS DE SEGURIDAD CONFIGURADAS", usuario: pregseg.usuario })
    return response.success("Solicitud procesada con éxito!")
}

export async function checkHandler
    (
        { request, locals }: RequestEvent,
        ur: UsuarioRepositoryInterface = usuarioRepository,
        pgsgr: PregSegRepositoryInterface = pregSegRepository,
        mock?: { formData: { usuario: string } }
    ) {
    let { response, log } = locals

    let usuario = { usuario: "" }
    await getFormData<{ usuario: string }>(usuario, request, mock)

    let validationResult = validateObject(usuario, z.object({ usuario: z.string().min(1, "Campo vacío.").min(3, " Mínimo 3 caracteres").max(20, "Máximo 20 caracteres") }));
    if (!validationResult.success) return newValidationFailObject(validationResult.error, log);

    const dbuser = await async(ur.getByUsername(usuario.usuario), log, { usuario: usuario.usuario });
    if (dbuser === undefined) {
        return fail(400, response.error("Error: El usuario no existe."));
    }

    const pregseg = await async(pgsgr.get(usuario.usuario), log, {usuario: usuario.usuario})
    if (pregseg === undefined){
        return fail(400, response.error("Error: El usuario no tiene preguntas de seguridad registradas"))
    }

    log.info("usuario recuperado correctamente", { usuario: usuario.usuario })
    return response.success("Preguntas de Seguridad recuperadas correctamente.", {
        pregseg: pregseg,
        usuario: usuario.usuario
    })
}

type RecoveryForm = {
    usuario: string,
    res_1: string,
    res_2: string,
    contraseña: string
}

export async function recoveryHandler
    (
        { request, locals }: RequestEvent,
        ur: UsuarioRepositoryInterface = usuarioRepository,
        pgsgr: PregSegRepositoryInterface = pregSegRepository,
    ) {
    let { response, log } = locals 

    let respuestas = { 
        usuario:  "",
        contraseña:"" ,
        rcontraseña: ""
    } 

    await getFormData(respuestas, request, null)

    let validationResult = validateObject(respuestas, 
        recoverySchema
        .omit({
            res_1: true,
            res_2: true
        })
        .extend({
             rcontraseña: z.string().min(1, "Debe proveer una verificacion de contraseña")
        })
    );

    if (!validationResult.success) return newValidationFailObject(validationResult.error, log);
    if (respuestas.contraseña !== respuestas.rcontraseña) {
        return response.error("Las contraseñas no coinciden, intente de nuevo.")
    }

    await async(ur.changePassword(respuestas.usuario, hashPwd(respuestas.contraseña)), log, { args: respuestas.usuario })
    return response.success("Preguntas de Seguridad cambiadas correctamente.")
}