import type { LayoutLoad } from './$types';
import { browser } from '$app/environment';

export const load = (async (event) => {
    if (browser) { // Ensure this runs only in the browser
        console.log(`[Client Hook] Before navigation to: ${event.url.pathname}`);
        let theme = event.data.usuario.theme
        let html = document.getElementsByTagName('html')[0] as HTMLHtmlElement
        let currentTheme = html.attributes.getNamedItem('data-theme')!.value

        if (currentTheme !== theme) {
            html.attributes.getNamedItem('data-theme')!.value = theme;
        }
    }

    return { usuario: event.data.usuario, relacionSexo: event.data.relacionSexo, totalPersonas: event.data.totalPersonas,
    distribucionIngresos: event.data.distribucionIngresos };
}) satisfies LayoutLoad;