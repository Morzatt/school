// Images Import
import backup_icon from "$lib/images/icons/backup_icon.svg"
import usuarios_icon from "$lib/images/icons/permisos_icon.svg"
import personalizar_icon from "$lib/images/icons/personalizar_icon.svg"
import constancias_icon from "$lib/images/icons/description_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
import inscripcion_icon from "$lib/images/icons/face_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
import retiros_icon from "$lib/images/icons/permisos_icon.svg"


import on from "$lib/images/icons/square_foot_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
import tw from "$lib/images/icons/school_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
import th from "$lib/images/icons/history_edu_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
import { basePath } from "$lib"

type RouteGroup = {
    name: string,
    routes: Route[]
}

type Route = {
    icon: string,
    href: string,
    name: string
}


export const routes: RouteGroup[] = [
    {
        name: "Representantes",
        routes: [
            {
                icon: retiros_icon,
                href: `representantes`,
                name: "Administrar Representantes"
            },
        ]
    },
    {
        name: "Alumnos",
        routes: [
            {
                icon: inscripcion_icon,
                href: "alumnos",
                name: "Administrar Alumnos"
            },
        ]
    },
    {
        name: "Empleados",
        routes: [
            {
                icon: on,
                href: "empleados",
                name: "Administrar Empleados"
            },
        ]
    },
    {
        name: "Aulas",
        routes: [
            {
                icon: on,
                href: "aulas",
                name: "Administrar Aulas"
            },
            {
                icon: inscripcion_icon,
                href: "materias",
                name: "Administrar Materias"
            },
        ]
    },
]

export const adminRoutes: RouteGroup[] = [
    {
        name: "Ajustes",
        routes: [
            {
                icon: usuarios_icon,
                href: "settings/users",
                name: "Usuarios y Permisos"
            },
            {
                icon: personalizar_icon,
                href: "settings/look",
                name: "Personalización"
            },
            {
                icon: backup_icon,
                href: "settings/backup",
                name: "Respaldos"
            },
        ]
    }
]