<script lang="ts">
    import { enhance } from "$app/forms";
    import Alert from "$lib/components/Messages/Alert.svelte";
    let { form }: { form:any } = $props()

    let nivel: 'Inicial' | 'Primaria' | 'Elegir' = $state('Elegir')
</script>

<dialog id="upload_backup_modal" class="modal modal-bottom modal sm:modal-middle">
    <div class="modal-box relative
                sm:w-full sm:max-w-md overflow-hidden">

        <Alert form={form} styles="absolute top-4 left-3 max-w-xs" />

        <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            id="upload_backup_close">✕</button>
        </form>

        <h2 class="font-bold text-xl">Crear Punto de Restauración</h2>
        <p class="text-sm">Provea detalles y cree su punto de restauración.</p>

        <div class="modal-container">
            <form method="post" use:enhance action="?/createCheckpoint" class="w-full">
                <div class="form-control">
                    <div class="label">
                        <div class="label-text">Identificador</div>
                    </div>
                    <input type="text" name="backup_name" class="input input-bordered input-sm max-w-[12rem]">
                </div>

                <button class="btn btn-sm btn-success mt-6" type="submit">Crear</button>
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
