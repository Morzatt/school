<script lang="ts">
    import { enhance } from "$app/forms";
    import Alert from "$lib/components/Messages/Alert.svelte";
    import type { BloqueHorario, DiasSemana, GradoID, Materia } from "$lib/database/types";
    import schedule from "$lib/images/icons/schedule.svg"

    let { form, dia, grado, materias, bloques }: { bloques: BloqueHorario[], form:any, dia: DiasSemana, grado: GradoID, materias: Materia[] | undefined } = $props()

    let content: 'horario' | 'bloque' = $state("bloque")

    function setHours(bloque: BloqueHorario) {
        content = "horario";
        setTimeout(() => {
            let entrada = document.getElementById(`hora_entrada_${dia}`) as HTMLInputElement
            let fin = document.getElementById(`hora_fin_${dia}`) as HTMLInputElement

            console.log(bloque, entrada.value, fin.value)
            entrada.value = bloque.hora_inicio
            fin.value = bloque.hora_fin
        }, 200)
    }

    function changeContent() {
        content === "horario" ? content = 'bloque' : content = 'horario'
    }
    function formatTime(time: string): string {
        let n = parseInt(time.slice(0, time.lastIndexOf(":")).replace(':', ""))
        return n <= 1200 ? `${time.slice(0, time.lastIndexOf(":"))} AM` :
         `${parseInt(time.slice(0, 2))-12 < 10 ? "0" : ""}${parseInt(time.slice(0, 2))-12}:${time.slice(3,5)} PM`
    }
</script>

{#snippet bloque()}
    <div class="w-full animate-y">
        <h3>Elegir Horas</h3>

        <div class="w-full mt-2 max-h-[19rem]">
            {#if bloques && bloques.length > 0}
                {#each bloques as bloque}
                    <div class="w-full h-[4.2rem] mb-1 border-l-[5px] rounded-l-md {bloque.turno === "Mañana" ? "border-l-orange-500" : "border-l-purple-600"}
                    border border-base-content/60
                    hover:bg-base-300 hover:border-transparent ease-in-out
                    active:bg-base-200
                    transition-all duration-200 group
                    flex items-center justify-between gap-2">
                        <div class="size-full flex items-center justify-between gap-4 p-2 
                        relative group transition-all duration-200 ease-in-out border-r border-base-content/40
                        group-hover:w-3/4">
                            <button class="flex items-center justify-center gap-4 p-2 w-full" 
                            onclick={() => { setHours(bloque) }}>
                                <div class="form-control">
                                    <div class="label my-0 py-0">
                                        <div class="label-text flex items-start justify-start gap-1 my-0 py-0">
                                            <img src="{schedule}" alt="" class="size-4">
                                            Inicio
                                        </div>
                                    </div>
                                    <span>{formatTime(bloque.hora_inicio)}</span>
                                </div>

                                <div class="form-control">
                                    <div class="label my-0 py-0">
                                        <div class="label-text flex items-start justify-start gap-1 my-0 py-0 ">
                                            <img src="{schedule}" alt="" class="size-4">
                                            Fin
                                        </div>
                                    </div>
                                    <span>{formatTime(bloque.hora_fin)}</span>
                                </div>
                            </button>
                        </div>

                        <form action="?/deleteBloque" method="POST" use:enhance class="hidden z-40 group-hover:flex w-1/4 h-full">
                            <input name="bloque_id" type="hidden" value={bloque.id_bloque}>
                            <input class="size-full h-full cursor-pointer bg-error text-base-100" type="submit" value="✕">
                        </form>
                    </div>           
                {/each}
            {:else}
                <p class="text-base-content/70 font-medium">No hay bloques de horarios creados aún.</p>
            {/if}
        </div>
    </div>
{/snippet}

{#snippet horario()}
    <form action="?/createBloque" class="w-full h-auto animate--y" use:enhance method="post">
        <input type="hidden" name="dia_semana" value="{dia}">
        <input type="hidden" name="id_grado" value="{grado}">

        <div class="create-section">
            <h3>Asignar Horario</h3>

            <div class="create-form py-2 ">
                <div class="w-full gap-4 flex items-center justify-around">
                    <label class="form-control">
                        <div class="label">
                            <span class="label-text">Hora de Entrada</span>
                        </div>
                        <input type="time" name="hora_inicio" class="" id="hora_entrada_{dia}">
                    </label>

                    <label class="form-control">
                        <div class="label">
                            <span class="label-text">Hora de Salida</span>
                        </div>
                        <input type="time" name="hora_fin" class="" id="hora_fin_{dia}">
                    </label>
                </div>

                <div class="w-full gap-4 flex items-center justify-start">
                    <label class="form-control">
                        <div class="label">
                            <span class="label-text">Materia</span>
                        </div>
                        <select name="id_materia">
                            <option disabled selected>Elegir</option>
                            {#if materias && materias.length > 0}
                                {#each materias as materia}
                                    <option value="{materia.id_materia}">{materia.nombre_materia}</option> 
                                {/each}                                       
                            {/if}
                        </select>
                    </label>
                    <label class="form-control">
                        <div class="label">
                            <span class="label-text">Profesor</span>
                        </div>
                        <input type="text" name="cedula_profesor" placeholder="Cédula del Profesor..." class="input input-sm input-bordered focus:outline-0">
                    </label>
                </div>
            </div>
        </div> 

        <div class="mt-2 flex justify-end">
            <label for="guardar" class="text-xs font-medium mx-2">Guardar Horario</label>
            <input name="guardar" type="checkbox" checked={false} class="checkbox checkbox-accent" /> 
        </div>

        <div class="w-full flex items-center justify-center p-4">
            <button class="btn btn-success btn-wide">Crear Horario</button>
        </div>
    </form>
{/snippet}

<dialog id="create_bloque_{dia}_modal" class="modal modal-ope modal-bottom sm:modal-middle">
    <div class="modal-box relative
                sm:w-full sm:max-w-md overflow-hidden">

        <Alert form={form} styles="absolute top-4 left-3 max-w-sm" />

        <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            id="create_bloque{dia}_close">✕</button>
        </form>

        <h2 class="font-bold text-xl mb-4">Crear Bloque de Horario</h2>

        <div class="w-full text-start">
            <span><span class="font-medium">Dia:</span> {dia}</span>
        </div>

        <div class="w-full text-start text-sm mt-1">
            <div>
                <p class="font-medium">{content === "horario" ? "Bloques de Horario" : "Crear Horario"}</p>
                <button class="btn btn-xs" onclick={changeContent}>Crear/Elegir</button>
            </div>
        </div>

        <div class="modal-container">
            {#if content === 'bloque'}
               {@render bloque()} 
            {:else}
               {@render horario()}
            {/if}
        </div>
    </div>
</dialog>

<style lang="postcss">
    .create-section {
        @apply w-full h-max
            p-2
            grid 
            grid-cols-1 text-center;
    }

    .create-section h3 {
        @apply text-wrap text-center font-semibold text-lg mb-1 pb-1 border-b border-base-content/30; 
    }
    
    .create-form {
        @apply w-full flex flex-wrap gap-4;
    }


    .modal-box {
        @apply border border-base-content/80
        sm:w-10/12  overflow-hidden;
    }          
    .modal-container {
        @apply flex max-h-[30rem] my-2 overflow-y-auto overflow-x-hidden;
        scrollbar-width: thin;
    }

    input[type="time"] {
        @apply border border-base-content/40 focus:outline-1 rounded-md px-2;
    }
    select {
        @apply btn btn-sm hover:border-base-content/30 hover:border focus:outline-0 border border-base-content/30;
    }

    .explicacion {
        @apply text-base-content/70 text-sm font-medium;
    }
</style>