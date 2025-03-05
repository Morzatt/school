<script lang="ts">
    import { enhance } from "$app/forms";
    import Alert from "$lib/components/Messages/Alert.svelte";
    import type { DiasSemana, GradoID, Materia } from "$lib/database/types";
    let { form, dia, grado, materias }: { form:any, dia: DiasSemana, grado: GradoID, materias: Materia[] | undefined } = $props()

    let nivel: 'Inicial' | 'Primaria' | 'Elegir' = $state('Elegir')
</script>

<dialog id="create_bloque_{dia}_modal" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box relative
                sm:w-full sm:max-w-md overflow-hidden">

        <Alert form={form} styles="absolute top-4 left-3 max-w-sm" />

        <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            id="create_bloque{dia}_close">✕</button>
        </form>

        <h2 class="font-bold text-xl">Crear Bloque de Horario</h2>

        <div class="w-full text-start text-sm">
            <span><b>Dia:</b> {dia}</span>
        </div>

        <div class="modal-container">
            <form action="?/createBloque" class="w-full h-auto" use:enhance method="post">
                <input type="hidden" name="dia_semana" value="{dia}">
                <input type="hidden" name="id_grado" value="{grado}">

                <div class="create-section">
                    <h3>Información del Bloque</h3>

                    <div class="create-form py-2 ">
                        <div class="w-full gap-4 flex items-center justify-around">
                            <label class="form-control">
                                <div class="label">
                                    <span class="label-text">Hora de Entrada</span>
                                </div>
                                <input type="time" name="hora_inicio" class="">
                            </label>

                            <label class="form-control">
                                <div class="label">
                                    <span class="label-text">Hora de Salida</span>
                                </div>
                                <input type="time" name="hora_fin" class="">
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

                <div class="w-full flex items-center justify-center p-4">
                    <button class="btn btn-success btn-wide">Crear Horario</button>
                </div>
            </form>
        </div>
    </div>
</dialog>

<style lang="postcss">
    .create-section {
        @apply w-full h-max
            my-4 p-2
            border border-base-content/30 rounded-md
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
        @apply flex mt-1 max-h-[30rem] overflow-y-auto overflow-x-hidden;
        scrollbar-width: thin;
    }

    input[type="time"] {
        @apply border border-base-content/40 focus:outline-1 rounded-md px-2;
    }
    select {
        @apply btn btn-sm hover:border-base-content/30 hover:border focus:outline-0;
    }
</style>