import type { Grado, Numeros } from "$lib/database/types"

export function createGradoId(a: any) {
    return `${a.numero}${a.nivel[0]}${a.seccion[0]}${a.turno[0]}`
}

export function formatNumero(nm: Numeros) {
    switch (nm) {
        case "1":
            return "1er"
        case "2":
            return "2do"
        case "3":
            return "3er"
        default:
            return `${nm}to`
    }
}

export function formatGrado(grado: Grado | undefined | null): string {
    if (!grado) {
        return ""
    }

    return `${formatNumero(grado.numero)} ${ grado.nivel == "Inicial" ? "Nivel" : grado.nivel === "Primaria" ? "Grado" : "Año" } "${grado.seccion}"`
}