<script lang="ts">
    import { enhance } from "$app/forms";
    import Alert from "$lib/components/Messages/Alert.svelte";
    import question_icon from "$lib/images/icons/question_icon.svg"

    let { form, usuario = $bindable() }: { form: any, usuario: string } = $props()

    let nivel: 'Inicial' | 'Primaria' | 'Elegir' = $state('Elegir')
</script>

<dialog id="set_pregseg_modal" class="modal modal-bottom modal- sm:modal-middle">
    <div class="modal-box relative
                sm:w-full sm:max-w-sm overflow-hidden">

        <Alert form={form} styles="absolute top-4 left-3 max-w-xs" />

        <form method="dialog">
            <button class="btn  scale-0 btn-sm btn-circle btn-ghost absolute right-2 top-2"
            id="set_pregseg_close">✕</button>
        </form>

        <h2 class="font-bold text-xl">Configurar Preguntas de Seguridad</h2>
        <p class="text-sm">Configure sus preguntas y respuestas de seguridad en caso de necesitar recuperar/cambiar su contraseña.</p>

        <div class="modal-container">
            <div class="w-full">
                <div class="w-full flex items-center justify-center">

                    <form class="w-full *:my-2 flex flex-col justify-center items-center"
                    method="POST" action="?/setPregseg" use:enhance>
                        <!-- USUARIO -->
                        <input type="hidden" name="usuario" value={usuario}>

                        <!-- PREG1 -->
                        <label class="form-control max-w-max px-3 w-full focus:outline-0 bg-transparent rounded-none">
                            <div class="label">
                                <span class="label-text">Seleccione una pregunta de seguridad</span>
                            </div>
                            <select class="focus:outline-0 bg-transparent select border border-base-content/30" name="preg_1">
                                <option disabled selected>Escoger Pregunta</option>
                                <option>Nombre de su Primera Mascota</option>
                                <option>Ciudad en que nació</option>
                                <option>Nombre de su Madre</option>
                                <option>Apellido de su mejor amigo de la Infancia</option>
                                <option>Titulo de su Pelicula Favorita</option>
                            </select>
                        </label>

                        <!-- RES1 -->
                        <label class="w-full input border border-base-content/30 bg-transparent focus:outline-0 rounded-none flex items-center gap-2 ">
                            <input type="text" class="grow focus:outline-0 bg-transparent rounded-none" name="res_1"/>
                            <img src="{question_icon}" alt="" class="size-7 opacity-70">
                        </label>

                        <!-- PREG2 -->
                        <label class="form-control max-w-max px-3 w-full">
                            <div class="label">
                                <span class="label-text">Seleccione otra pregunta de seguridad</span>
                            </div>
                            <select class="focus:outline-0 bg-transparent select border border-base-content/30" name="preg_2">
                                <option disabled selected>Escoger Pregunta</option>
                                <option>Nombre de su Escuela Primaria</option>
                                <option>En que Hospital Nacio</option>
                                <option>Deporte Favorito</option>
                                <option>Cantante o Banda Favorita</option>
                                <option>Restaurante Favorito</option>
                            </select>
                        </label>

                        <!-- RES2 -->
                        <label class="w-full input border border-base-content/30 bg-transparent focus:outline-0 rounded-none flex items-center gap-2 ">
                            <input type="text" class="grow focus:outline-0 bg-transparent rounded-none" name="res_2"/>
                            <img src="{question_icon}" alt="" class="size-7 opacity-70">
                        </label>

                        <button type="submit" class="btn btn-wide bg-indigo-600 text-white hover:bg-indigo-500 active:bg-indigo-300">Aceptar</button>
                    </form>
                </div>
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

    .input, .select {
        @apply relative border;
    }

    .input {
        @apply bg-base-100 focus:outline-0 py-2 rounded-md;
    }

    select {
        @apply btn btn-sm hover:border-base-content/30 hover:border focus:outline-0;
    }
</style>