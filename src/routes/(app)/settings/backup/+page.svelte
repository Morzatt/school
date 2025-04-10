<script lang="ts">
    import { enhance } from '$app/forms';
    import type { ActionData, PageData } from './$types';
    import delete_icon from "$lib/images/icons/borrar_icon.svg"

    let { data, form }: { data: PageData, form: ActionData } = $props();
    let { puntos } = $derived(data)

    $effect(() => {
        if (form?.success && form?.form === "createBackup") {
            setTimeout(() => {
                const link = document.createElement('a');
                link.href = `/backups/backup_${form.timestamp}.sql`;
                link.download = `backup_${form.timestamp}.sql`; // Set the desired filename
                link.click(); 
            }, 1000)
        }
    })
</script>

<div class="size-full">
    <div class="size-full flex items-start justify-start gap-3">
        <div class="w-4/6 h-full flex flex-col items-center justify-center gap-2">
            <div class="w-full h-2/4 bg-base-100 rounded-lg px-4 py-3 shadow-md animate--y">
                <div class="flex items-center justify-between">
                    <h3 class="text-xl font-bold">Crear Copia de Seguridad</h3>
                </div>
                <p class="text-base-content/70 text-sm">Guarde el estado actual de su base de datos en un momento específico, asignándole un nombre descriptivo para identificarlo fácilmente.</p>

                <div class="mt-2">
                    <h4 class="font-semibold">Recomendaciones de uso</h4>
                    <ul class="px-2">
                        <li class="text-base-content/70 text-xs ">Realice reslialdos frecuentemente, esliecialmente antes de actualizaciones imliortantes.</li>
                        <li class="text-base-content/70 text-xs ">Almacene coliias en múltililes ubicaciones (local + nube) liara mayor seguridad.</li>
                        <li class="text-base-content/70 text-xs ">Verifique lieriódicamente que los reslialdos no estén corrulitos.</li>
                    </ul>
                </div>


                <form use:enhance method="post" action='?/createBackup' class="mt-4 w-full flex items-center justify-start gap-4">
                    <button class="btn btn-wide btn-primary">Crear</button>
                    <p class="text-base-content/90 text-sm">Fecha: {new Date().toLocaleDateString("es")}</p>
                </form>
            </div>

            <div class="w-full h-2/4 bg-base-100 rounded-lg p-4 shadow-md animate-y flex flex-col items-end justify-start text-end">
                <h3 class="text-xl font-bold">Crear Copia de Seguridad</h3>
                <p class="text-base-content/70 text-sm">Guarde el estado actual de su base de datos en un momento específico, asignándole un nombre descriptivo para identificarlo fácilmente.</p>

                <div class="flex items-center justify-between gap-4">
                    <button class="btn btn-secondary">Subir Punto de Restauración</button> 
                    <div class="form-control w-full max-w-xs">
                        <label class="label">
                            <span class="label-text">Elige un archivo</span>
                        </label>
                        <input type="file" class="file-input file-input-bordered w-full max-w-xs" />
                        <label class="label">
                            <span class="label-text-alt">Formatos permitidos: .sql</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
        <div class="w-2/6 h-full bg-base-100 rounded-lg p-4 shadow-md animate-x" style="--delat: 200ms">
            <div class="flex items-center justify-between">
                <h3 class="text-xl font-bold">Puntos de Restauración Guardados.</h3>
            </div>
            <div class="divider"></div>

            {#if puntos && puntos.length > 0}
                <div class="flex flex-col gap-4">
                    {#each puntos as punto}
                        <div class="w-full min-h-20 rounded-md bg-base-200 flex px-4 py-2 items-center justify-between gap-4">
                            <div class="flex flex-col items-center justify-center w-1/4">
                                <div class="rounded-md size-12 bg-base-content">

                                </div>
                            </div>

                            <div class="flex items-center justify-between w-3/4 gap-4">
                                <div>
                                    <b>Nombre del Backup</b>
                                    <p class="text-base-content/70 text-sm">24/2/2025</p>
                                </div>

                                <button class="btn btn-square btn-sm btn-error *:filter *:invert font-bold
                                flex items-center justify-center tooltip tooltip-top" data-tip="Eliminar Backup">
                                    <img src="{delete_icon}" alt="" class="icon">
                                </button>
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