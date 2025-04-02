<script lang="ts">
    import { enhance } from "$app/forms";
    import { goto } from "$app/navigation";
    import { basePath } from "$lib";
    import { FormResponse } from "$lib/classes/responses.classes";
    import Alert from "$lib/components/Messages/Alert.svelte";
    import type { Representante } from "$lib/database/types";
    let { form, representante }: { form:any, representante: Representante} = $props()

    import chevron_right from "$lib/images/icons/chevron_right.svg"

    let hasCedula: boolean | undefined = $state()
    let relacion = $state('')
 
    function goToCreateAlumno() {
        let url = `${basePath}/alumnos/nuevo?representante=${representante.cedula}&relacion=${relacion}&hasCedula=${hasCedula}`

        if (hasCedula === undefined) {
            form = new FormResponse('url').error('Debe de indicar si el alumno posee cedula de identidad propia o no.') 
            return          
        }

        if (!relacion || relacion === "") {
            form = new FormResponse('url').error('No ha indicado un parentesco/relacion entre representante y alumno.') 
            return
        }

        goto(url)
    }
</script>

<dialog id="create_alumno_modal" class="modal modal-bottom modal-ope sm:modal-middle">
    <div class="modal-box relative
                sm:w-full sm:max-w-md overflow-hidden">

        <Alert form={form} styles="absolute top-4 left-3 max-w-xs" />

        <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            id="create_empleado_close">✕</button>
        </form>

        <h2 class="font-bold text-xl">Nuevo Alumno</h2>
        <p class="text-sm text-base-content/70">Inicie un nuevo proceso de registro de alumno a nombre del representante.</p>

        <div class="modal-container">
            <div class="w-full h-auto">
                <div class="form-control">
                    <div class="label p-0 m-0 mb-1">
                        <div class="label-text">¿El Alumno posee cédula propia?</div>
                    </div>
                    <div class="flex items-center justify-start gap-4 text-sm font-bold">
                        <div class="flex flex-col items-center justify-center">
                            <div>Si</div>
                            <input type="radio" value="true" name="radio-7" class="radio radio-success"
                            onclick="{() => { hasCedula = true; }}"/>
                        </div>

                        <div class="flex flex-col items-center justify-center">
                            <div>No</div>
                            <input type="radio" value="false" name="radio-7" class="radio radio-error"
                            onclick="{() => { hasCedula = false; }}"/>
                        </div>
                    </div>
                </div>
                
                <div class="divider m-0 p-0 mt-3"></div>

                <div class="form-control mt-3">
                    <div class="label p-0 m-0 mb-1">
                        <div class="label-text">Relación del Representante con el Alumno.</div>
                    </div>

                    <select class="max-w-[10rem] border border-base-content/40" bind:value={relacion}>
                        <option disabled selected>Elegir</option>
                        {#if representante.sexo === "Masculino"}
                            <option value="Padre">Padre</option>
                            <option value="Abuelo">Abuelo</option>
                        {:else if representante.sexo === "Femenino"}
                            <option value="Madre">Madre</option>
                            <option value="Abuela">Abuela</option>
                        {/if}
                    </select>
                </div>

                <div class="w-full flex items-center justify-end mt-4">
                    <button class="btn btn-info btn-sm"
                    onclick={() => { goToCreateAlumno() }}>
                        <span><img src="{chevron_right}" alt="" class="icon"></span>
                        <span>Empezar</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</dialog>

<style lang="postcss">
    .create-section {
        @apply w-full h-max
            my-4 p-2 py-4
            border border-base-content/30 rounded-md
            grid 
            grid-cols-1 md:grid-cols-[20%_80%] text-center;
    }

    .create-section h3 {
        @apply text-wrap text-center mb-3 sm:mb-0; 
    }
    
    .create-form {
        @apply w-full flex flex-wrap gap-4 md:border-l border-base-content/30 md:pl-4;
    }


    .modal-box {
        @apply border border-base-content/80;
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
        @apply btn btn-sm border-base-content/40 border focus:outline-0;
    }
</style>
                        
<!-- <style lang="postcss">
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
        @apply flex max-h-[30rem] overflow-y-auto overflow-x-hidden;
        scrollbar-width: thin;
    }
</style> -->