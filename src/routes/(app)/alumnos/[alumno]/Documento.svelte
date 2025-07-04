<script lang="ts">
    import type { Alumno, DocumentoAlumno, TiposDocumentos } from "$lib/database/types";
    import folder_icon from "$lib/images/icons/folder_icon.svg"
    import add_photo_icon from "$lib/images/icons/add_photo_alternate_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
    import check_icon from "$lib/images/icons/check-circle-svgrepo-com.svg"
    import task_icon from "$lib/images/icons/task_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
    import cancel_icon from "$lib/images/icons/cancel_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
    import actualizar_icon from "$lib/images/icons/sync_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
    import descargar_icon from "$lib/images/icons/download_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"

    import { onMount } from "svelte";
    import { enhance } from "$app/forms";
    import { downloadFile } from "$lib/utils/downloadFile";

    let { documento, tipo_documento, alumno, visible }: { visible: 'true' | 'false' | undefined, alumno: Alumno, tipo_documento: string, documento: DocumentoAlumno | null } = $props()

    let title: string = $state('')
    onMount(() => {
        switch(tipo_documento) {
            case "certificado_vacunacion": return title = "Certificado de Vacunacion";
            case "partida_nacimiento": return title = "Partida de Nacimiento";
            case "cedula_estudiante": return title = "Cedula del Estudiante";
            case "cedula_representante": return title = "Cedula del Representante";
        }
    })

    function showFilePreview(name: string) {
        let input = document.getElementById(`${name}_input`) as HTMLInputElement 
        let preview = document.getElementById(`${name}_preview`) as HTMLDivElement
        let file_title = document.getElementById(`${name}_file_title`) as HTMLHeadingElement
        let file_size = document.getElementById(`${name}_file_size`) as HTMLParagraphElement

        if (!input.files || input.files.length < 1) {
            return
        }

        let file = input.files[0]

        file_title.innerText = file.name;
        file_size.innerText = `${file.size/1000}Kb`;
        preview.classList.add('flex')
        preview.classList.remove('hidden')
    }
</script>

<button class="rounded-md p-2 hover:scale-95
border-2 border-base-content/50 hover:border-base-content/80 border-dashed
transition-all duration-200 ease-in-out
hover:bg-base-300/50 relative {visible ? visible === 'false' ? 'hidden' : '' : ''}" 
onclick={() => {
    document.getElementById(`${tipo_documento}_modal`).showModal()
}}>

    <img src="{documento ? check_icon : cancel_icon}" alt="" class="size-8 absolute top-0 right-0 icon">

    <div class="flex w-full justify-center items-center relative">
        <img src="{folder_icon}" alt="" class="size-16 icon">
    </div>

    <div class="w-full pb-1">
        <h2 class="text-center font-semibold">{title}</h2>
    </div>

    <div class="w-full pt-1 border-t border-t-base-content/60
    flex items-center justify-center text-center">
        <div class="text-xs text-center w-full">
            <b>Ultima Actualización:</b>
            <span>{documento?.ultima_edicion ? documento.ultima_edicion.toLocaleDateString() : "No Especificado"}</span>
        </div>
    </div>
</button>

<dialog id="{tipo_documento}_modal" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box relative
                sm:w-full sm:max-w-md overflow-hidden">

        <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            id="{tipo_documento}_close">✕</button>
        </form>

        <div class="font-bold text-xl flex items-center justify-start gap-8">
            <span>{title}</span>
        </div>

        <div class="modal-container lg:*:mt-2 px-2">
            <div class="w-full lg:w-full flex flex-col gap-3 items-center justify-start">
                <img src="{(documento && documento.path) ? `/downloads/0000?type=image&path=${documento.path}` : ""}" alt="" class="{(documento && documento.path) ? "" : "hidden"} max-w-full max-h-[16rem] border border-base-content/50 rounded-md p-1"> 
                {#if !documento}
                    <div class="p-4 text-sm text-center rounded-md size-40 border border-base-content/50 flex items-center justify-center">
                        <p>No se ha introducido ningún documento</p>
                    </div>
                {/if}

                <a href="{(documento && documento.path) ? `/downloads/0000?type=image&path=${documento.path}` : ""}" class="btn btn-sm border border-base-content/40">
                    Ver Documento
                </a>
            </div>

            <div class="w-full lg:w-full flex flex-col gap-4 items-start justify-start *:w-full pb-8">
                <div class="">
                    <h4><b>Fecha de Última Modificación</b></h4>
                    <span class="text-sm w-full">{documento?.ultima_edicion ? documento.ultima_edicion.toLocaleDateString() : "No Especificado"}</span>
                </div>

                <form method="post" action="?/updateDocument" use:enhance={() => {
                    // document.getElementById(`${tipo_documento}_close`)?.click()
                }} enctype="multipart/form-data">
                    <h4><b>Acciones</b></h4>
                    <div class='w-full min-h-12 mt-1 flex items-center justify-start gap-6'>
                        <label class="btn btn-square btn-primary tooltip tooltip-top" data-tip="Actualizar Documento">
                            <img src="{actualizar_icon}" alt="" class="size-12 icon invert filter">
                            <input type="hidden" name="id_alumno" value="{alumno.cedula_escolar}">
                            <input type="hidden" name="tipo_documento" value="{tipo_documento}">
                            <input accept="image/*" type="file" class="hidden" name="archivo" id="{tipo_documento}_input" oninput="{() => { showFilePreview(tipo_documento) }}">
                        </label>

                        <button type="button" class="btn btn-square btn-secondary tooltip tooltip-top" data-tip="Descargar"
                        onclick={() => {
                            if (documento && documento.path) {
                                downloadFile(`/downloads/0000?type=image&path=${documento.path}`, `${documento.tipo_documento}_${documento.id_alumno}`)
                            }
                        }}>
                            <img src="{descargar_icon}" alt="" class="size-12 icon invert filter">
                        </button>
                    </div>
                    
                    <div class="hidden flex-col items-center justify-center w-full mt-4"
                    id="{tipo_documento}_preview">
                        <div class="w-3/4 flex bg-primary/30 h-14 rounded-md px-2 items-center justify-between
                        animate-pop">
                            <div class="flex items-center justify-between gap-2 overflow-hidden truncate w-[95%]">
                                <div class="size-12 rounded-full bg-primary flex items-center p-1.5 justify-center">
                                    <img src="{task_icon}" alt="" class="filter invert size-full">
                                </div>

                                <div class="flex flex-col w-[75%]">
                                    <h2 class="font-bold truncate" id="{tipo_documento}_file_title">Nombre Archivo Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error quod autem optio! Quas assumenda quibusdam exercitationem odit repellendus necessitatibus libero voluptate eius ea esse placeat ad doloribus maiores, iste culpa.</h2>
                                    <p class="text-sm" id="{tipo_documento}_file_size">0.00kb</p>
                                </div>
                            </div>
                        </div>


                        <button class="btn btn-primary mt-4" type="submit">
                            Cambiar Documento
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</dialog>
                        
<style lang="postcss">
    .input {
        @apply focus:bg-transparent focus:outline-0;
    }

    .form-control {
        @apply px-2 pb-2;
    }

    .form-control .label .label-text {
        @apply font-bold;
    }

    .form-control p {
        @apply text-sm pb-1;
    }
    .modal-container {
        @apply gap-4 flex flex-col justify-between items-start max-h-[26rem] overflow-y-auto overflow-x-hidden;
        scrollbar-width: thin;
    }
</style>