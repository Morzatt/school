import { usuarioRepository } from '$lib/database/repositories/user.repository';
import async from '$lib/utils/asyncHandler';
import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Usuario } from '$lib/database/types';

function asignRange(role: string) {
    switch (role) {
        case "admin":
            return 1
        case "administrador": 
            return 1
        case "superadmin":
            return 2
        default: 
            return 0    
    }
}

export const load = (async ({ locals }) => {
    let { log } = locals
    let usuarios = await async(usuarioRepository.getAll(), log)
    type UsuariosTable = Omit<Usuario, "contraseña"> & { range: number };
    let users: UsuariosTable[] = [];

    if (usuarios) {
        for (let i of usuarios) {
            users.push({ ...i, range: asignRange(i.role) })
        }
    }

    return { usuarios: users};
}) satisfies PageServerLoad;

export const actions = {
    write: async ({ request, locals }) => {
        let { log } = locals
        let data = await request.formData()
        let usuario = data.get("usuario") as string
        let check = data.get("write")
        let value = check === "on" ? true : false
        if (value) {
            await async(usuarioRepository.update({ write: value, read: true }, usuario), log)
        } else {
            await async(usuarioRepository.update({ write: value }, usuario), log)
        }
    },

    read: async ({ request, locals }) => {
        let { log } = locals
        let data = await request.formData()
        let usuario = data.get("usuario") as string
        let check = data.get("read")
        let value = check === "on" ? true : false

        if (!value) {
            await async(usuarioRepository.update({ read: value, write: false, estado: "Bloqueado" }, usuario), log)
        } else {
            await async(usuarioRepository.update({ read: value }, usuario), log)
        }
    }, 

    status: async ({ request, locals }) => {
        let { log } = locals
        let data = await request.formData() 
        let usuario = data.get("usuario") as string
        let estado = data.get("estado") as "Activo" | "Bloqueado"
        await async(usuarioRepository.update({ estado: estado }, usuario), log)
    },

    role: async ({ request, locals }) => {
        let { log, response } = locals
        let data = await request.formData() 
        let newRole = data.get("role") as string
        let usuario = data.get("usuario") as string

        let userDB = await async(usuarioRepository.getByUsername(usuario), log)

        if (newRole.toLowerCase() === "superadmin" || newRole.toLowerCase() === "superadministrador") {
            return response.error(`No se puede asignar el rol ${newRole}: prohibido`)
        }

        if (!newRole) { newRole = userDB!.role; return response.error("No se ha introducido ningún rol.") }
        
        await async(usuarioRepository.update({ role: newRole.toLowerCase() }, usuario), log)
        return response.success("Rol cambiado con éxito")
    },
} satisfies Actions