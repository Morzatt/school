import { newValidationFailObject, registerUserSchema, validateObject } from '$lib/utils/validators';
import { fail, type RequestEvent } from '@sveltejs/kit';
import { usuarioRepository, type UsuarioRepositoryInterface } from '$lib/database/repositories/user.repository';
import type { NewUsuario } from '$lib/database/types';
import { hashPwd } from '$lib/utils/hashPwd';
import { getFormData } from '$lib/utils/getFormData';
import async from '$lib/utils/asyncHandler';
import type { FormHandler, Repository } from './types.handler';

export async function registerHandler(
    { request, locals }: RequestEvent,
    mock?: { formData: NewUsuario },
    repository = usuarioRepository,
) {
    let { response, log } = locals
    let data = await request.formData()

    let newUsuario = {
        nombre: "",
        apellido: "",
        usuario: "",
        contraseña: "",
    } satisfies NewUsuario;

    let rcontraseña = data.get('vericontraseña') as string
    await getFormData<NewUsuario>(newUsuario, request, mock, data)

    if (!rcontraseña || rcontraseña === "") {
        return fail(400, response.error('Error: debe proveer una verificacion de contraseña.'))
    }

    if (newUsuario.contraseña !== rcontraseña) {
        return fail(400, response.error('Error: Las contraseñas no coinciden.'))
    }

    let result = validateObject(newUsuario, registerUserSchema);
    if (!result.success) return newValidationFailObject(result.error, log);
    
    const dbuser = await async(repository.getByUsername(newUsuario.usuario), log, { usuario: newUsuario.usuario })
    if (dbuser !== undefined){
        return fail(400, response.error("Error: El usuario ya existe."))
    }
    
    newUsuario.contraseña = hashPwd(newUsuario.contraseña)

    await async(repository.create({
        ...newUsuario,
        estado: 'Por Asignar' 
    }), log, { ...newUsuario })
    log.info({ msg: "NUEVO USUARIO REGISTRADO", usuario: newUsuario.usuario })

    return response.success("Usuario Registrado con Éxito!", {
        usuario: newUsuario.usuario
    })
}