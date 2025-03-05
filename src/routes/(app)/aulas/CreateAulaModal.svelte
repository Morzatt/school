<script lang="ts">
    import { enhance } from "$app/forms";
    import Alert from "$lib/components/Messages/Alert.svelte";
    let { form }: { form:any } = $props()

    let nivel: 'Inicial' | 'Primaria' | 'Elegir' = $state('Elegir')
</script>

<dialog id="create_aula_modal" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box relative
                sm:w-full sm:max-w-md overflow-hidden">

        <Alert form={form} styles="absolute top-4 left-3 max-w-xs" />

        <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            id="create_aula_close">✕</button>
        </form>

        <h2 class="font-bold text-xl">Crear Aula</h2>
        <p class="text-sm">Cree una nueva aula, para comenzar a administrar Alumnos, Horarios, Promociones y más...</p>

        <div class="modal-container">
            <form action="?/createGrado" class="w-full h-auto" use:enhance method="post">
                <div class="create-section">
                    <h3>Información del Aula</h3>

                    <div class="create-form py-2">
                        <label class="form-control">
                            <div class="label">
                                <span class="label-text">Nivel</span>
                            </div>
                            <select name="nivel" bind:value={nivel} required>
                                <option disabled selected>Elegir</option>
                                <option value="Inicial">Inicial</option>
                                <option value="Primaria">Primaria</option>
                            </select>
                        </label>

                        <div class="form-control focus:outline-0">
                            <div class="label">
                                <span class="label-text">
                                    Grado
                                </span>
                            </div>

                            <label class="flex items-center justify-start 
                            input input-sm input-bordered focus:outline-0 
                            rounded-md max-w-[12rem]">
                                <input type="number" name="numero" 
                                placeholder="..."
                                class="max-w-[3rem] focus:outline-0"
                                max="6" min="0" required>
                                <p class="select-none">{nivel === "Elegir" ?  "Seleccionar" : nivel === 'Inicial' ? 'Nivel' : 'Grado'}</p>
                            </label>
                        </div>

                        <label class="form-control">
                            <div class="label">
                                <span class="label-text">Seccion</span>
                            </div>
                            <select name="seccion" required>
                                <option disabled selected>Elegir</option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                                <option value="D">D</option>
                            </select>
                        </label>

                        <label class="form-control">
                            <div class="label">
                                <span class="label-text">Turno</span>
                            </div>
                            <select name="turno" required>
                                <option disabled selected>Elegir</option>
                                <option value="Mañana">Mañana</option>
                                <option value="Tarde">Tarde</option>
                            </select>
                        </label>

                        <label class="form-control">
                            <div class="label">
                                <span class="label-text">Docente de Aula</span>
                            </div>
                            <input type="number" name="profesor" required
                            class="input input-sm input-bordered rounded-md max-w-[12rem]" 
                            placeholder="Cedula del Docente de Aula...">
                        </label>
                    </div>
                </div> 

                <div class="w-full flex items-center justify-center p-4">
                    <button class="btn btn-success btn-wide">Crear Aula</button>
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
        @apply flex mt-3 max-h-[30rem] overflow-y-auto overflow-x-hidden;
        scrollbar-width: thin;
    }

    .input {
        @apply focus:outline-0 ;
    }
    .input, .select {
        @apply relative border;
    }

    .input {
        @apply bg-base-100 input-sm;
    }

    select {
        @apply btn btn-sm hover:border-base-content/30 hover:border focus:outline-0;
    }
</style>