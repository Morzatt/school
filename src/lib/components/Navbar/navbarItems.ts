// Images Import
import backup_icon from "$lib/images/icons/backup_icon.svg"
import usuarios_icon from "$lib/images/icons/permisos_icon.svg"
import personalizar_icon from "$lib/images/icons/personalizar_icon.svg"

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
        name: "Constancias",
        routes: [
            {
                icon: usuarios_icon,
                href: "settings/users",
                name: "Constancias de Estudio"
            },
            {
                icon: personalizar_icon,
                href: "settings/look",
                name: "Constancias de Inscripción"
            },
            {
                icon: backup_icon,
                href: "settings/backup",
                name: "Retiros"
            },
        ]
    },
    {
        name: "Alumnos",
        routes: [
            {
                icon: usuarios_icon,
                href: "settings/users",
                name: "Constancias de Estudio"
            },
            {
                icon: personalizar_icon,
                href: "settings/look",
                name: "Constancias de Inscripción"
            },
            {
                icon: backup_icon,
                href: "settings/backup",
                name: "Retiros"
            },
        ]
    },
    {
        name: "Retiros",
        routes: [
            {
                icon: usuarios_icon,
                href: "settings/users",
                name: "Constancias de Estudio"
            },
            {
                icon: personalizar_icon,
                href: "settings/look",
                name: "Constancias de Inscripción"
            },
            {
                icon: backup_icon,
                href: "settings/backup",
                name: "Retiros"
            },
        ]
    }
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