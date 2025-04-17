<script lang="ts">
    import database_icon from "$lib/images/icons/database_icon.svg"
    import { enhance } from '$app/forms';
    import type { ActionData, PageData } from './$types';
    import delete_icon from "$lib/images/icons/borrar_icon.svg"
    import success_icon from "$lib/images/icons/success_icon.svg"
    import UploadBackupModal from './UploadBackupModal.svelte';

    import Alert from '$lib/components/Messages/Alert.svelte';
    import { downloadFile } from "$lib/utils/downloadFile";

    let { data, form }: { data: PageData, form: ActionData & { timestamp: string } } = $props();
    let { puntos } = $derived(data)

    $effect(() => {
        if (form?.success && form?.form === "createBackup") {
            setTimeout(() => {
                downloadFile(`/backups/temporal/backup_${form.timestamp}.dump`, `backup_${form.timestamp}.dump`) 
            }, 1000)
        }
    })

    let file = $state()

    function deleteFile() {
        let input = document.getElementById('fileInput') as HTMLInputElement
        input.files = null
        input.value = ""
        file = ""
    }
</script>

<UploadBackupModal form={null}/>

<div class="size-full relative">
    <h1 class="font-bold text-2xl">Respaldos/Restauraciones {file}</h1>

    <Alert form={form} styles="absolute left-4 top-4 max-w-sm"/>

    <div class="mt-4 flex flex-col lg:flex-row items-start justify-start gap-3">
        <div class="w-full lg:w-4/6 h-full flex flex-col items-center justify-center gap-3">
            <div class="w-full h-fit bg-base-100 rounded-lg px-8 py-4 shadow-md animate--y">
                <div class="flex items-center justify-between">
                    <h3 class="text-xl font-bold">Crear Copia de Seguridad</h3>
                </div>
                <p class="text-base-content/70 text-sm">Guarde el estado actual de su base de datos en un archivo de respaldo.</p>

                <div class="mt-2">
                    <h4 class="font-semibold">Recomendaciones de uso</h4>
                    <ul class="px-2">
                        <li class="text-base-content/70 text-xs "><i>* </i> Realice respaldos frecuentemente, especialmente antes de actualizaciones importantes.</li>
                        <li class="text-base-content/70 text-xs "><i>* </i> Almacene copias en múltiples ubicaciones (local + nube) para mayor seguridad.</li>
                        <li class="text-base-content/70 text-xs "><i>* </i> Verifique periódicamente que los respaldos no estén corruptos.</li>
                    </ul>
                </div>


                <form use:enhance method="post" action='?/createBackup' class="mt-4 w-full flex items-center justify-start gap-4">
                    <button class="btn btn-wide btn-primary">Crear</button>
                    <p class="text-base-content/90 text-sm">Fecha: {new Date().toLocaleDateString("es")}</p>
                </form>
            </div>

            <div class="w-full h-max *:bg-base-100 rounded-lg *:shadow-md animate-y flex flex-col lg:flex-row items-start justify-between
            gap-3">
                <div class="w-full lg:w-2/4 h-full rounded-md p-4 animate--y" style="--delay: 100ms;">
                    <h3 class="text-xl font-bold">Punto de Restauración</h3>
                    <p class="text-base-content/70 text-sm">Cree un punto de restauración del estado actual de la aplicacion, asignándole un nombre descriptivo para identificarlo fácilmente.</p>

                    <div class="flex items-center justify-between gap-4 mt-8">
                        <button class="btn btn-secondary btn-sm"
                        onclick={() => document.getElementById('upload_backup_modal').showModal()}>Crear Punto de Restauración</button> 
                    </div>
                </div>

                <form method="POST" action='?/uploadBackup' enctype="multipart/form-data" use:enhance class="w-full lg:w-2/4 h-full rounded-md p-4 animate--y" style="--delay: 200ms;">
                    <h3 class="text-xl font-bold">Subir Copia de Seguridad</h3>
                    <p class="text-base-content/70 text-sm">Restaure su base de datos a un punto anterior, subiendo una copia de seguridad creada con anterioridad.</p>

                    <div class="form-control w-full max-w-xs mt-4">
                        <div class="label">
                            <span class="label-text">Elige un archivo</span>
                        </div>

                        <label class="w-full  rounded-xl 
                        p-5
                        {!file ? "cursor-pointer border border-base-content/80 border-dashed" : "bg-success text-white [&_img]:invert *:filter"}">
                            {#if !file}
                                <div class="flex flex-col items-center justify-center gap-2 animate--y">
                                    <img src="{success_icon}" alt="" class="size-12 icon">
                                    <h3 class="font-semibold text-center">Suba o arrastre un archivo de respaldo.</h3>
                                </div>                               
                            {:else}
                                <div class="flex items-center justify-between gap-4 animate-y relative">
                                    <div class="flex items-center justify-between gap-2">
                                        <img src="{success_icon}" alt="" class="size-12 icon">
                                        <h3 class="font-semibold flex-1">(1) Archivo Seleccionado.</h3>
                                    </div>

                                    <button class="btn btn-square btn-sm btn-error *:filter *:invert font-bold
                                    flex items-center justify-center tooltip tooltip-top" data-tip="Eliminar Archivo"
                                    onclick={() => { deleteFile() }}>
                                        <img src="{delete_icon}" alt="" class="icon">
                                    </button>
                                </div>                               
                            {/if}

                            <input id='fileInput' type="file" name="backupUpload" class="hidden file-input file-input-bordered file-input-sm w-full max-w-xs" bind:value={file} />
                        </label>

                        <div class="label">
                            <span class="label-text-alt">Formatos permitidos: .sql</span>
                        </div>
                    </div>

                    <div class="flex items-center justify-center gap-4 mt-3">
                        <button class="btn btn-accent px-12">Restaurar</button> 
                    </div>
                </form>
            </div >
        </div>

        <div class="w-full lg:w-2/6 h-full bg-base-100 rounded-lg p-4 shadow-md animate-x " style="--delat: 300ms">
            <h3 class="text-xl font-bold">Puntos de Restauración Guardados.</h3>
            <p class="text-base-content/70 text-sm"><b>NOTA: </b> Los puntos de restauracion no son incluidos en las copias de seguridad, cualquier cambio de restauracion no aplicara.</p>

            <div class="divider"></div>

            <div class="max-h-[25rem] overflow-y-auto overflow-x-hidden">
                {#if puntos && puntos.length > 0}
                    <div class="flex flex-col gap-4">
                        {#each puntos as punto}
                            <div class="w-full shadow-md min-h-20 rounded-md bg-base-300 flex px-4 py-2 items-center justify-between gap-4
                            transition-all duration-200 ease-in-out hover:bg-base-200 hover:cursor-help">
                                <div class="flex flex-col items-center justify-center w-1/4">
                                    <div class="rounded-md size-12 bg-secondary">
                                        <img src="{database_icon}" alt="" class="size-full filter invert icon">
                                    </div>
                                </div>

                                <div class="flex items-center justify-between w-3/4 gap-4">
                                    <div class="flex-1">
                                        <b class="text-wrap">{punto.nombre}</b>
                                        <p class="text-base-content/70 text-sm">{punto.fecha.toLocaleDateString()}</p>
                                    </div>


                                    <div class="flex items-center justify-between gap-3">
                                        <form method="post" use:enhance action="?/selectPunto">
                                            <input type="hidden" name="backup_id" value={punto.backup_id}>
                                            <button class="btn btn-square btn-sm btn-success *:filter *:invert font-bold
                                            flex items-center justify-center tooltip tooltip-top" data-tip="Elegir Backup">
                                                <img src="{success_icon}" alt="" class="icon">
                                            </button>
                                        </form>

                                        <form action="?/deletePunto" method="post" use:enhance>
                                            <input type="hidden" name="backup_id" value={punto.backup_id}>
                                            <button class="btn btn-square btn-sm btn-error *:filter *:invert font-bold
                                            flex items-center justify-center tooltip tooltip-top" data-tip="Eliminar Backup">
                                                <img src="{delete_icon}" alt="" class="icon">
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div> 
                        {/each} 
                    </div>
                {:else}
                    <p class="text-base-content/70 font-medium">No hay bloques de horarios creados aún.</p>
                {/if}
            </div>
        </div>
    </div>
</div>