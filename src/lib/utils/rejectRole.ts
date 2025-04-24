import type { FormResponse } from "$lib/classes/responses.classes";
import type { Usuario } from "$lib/database/types";

export function writePermission(usuario: Usuario, response: FormResponse) {
    if (!usuario.write) {
        return response.error('El usuario no tiene permiso de escritura.')
    }
}