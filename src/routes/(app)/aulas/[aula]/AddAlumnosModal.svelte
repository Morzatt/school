<script lang="ts">
    import { enhance } from "$app/forms";
    import Alert from "$lib/components/Messages/Alert.svelte";
    let { form }: { form:any } = $props()
</script>

<dialog id="add_alumno_modal" class="modal modal-bottom modal-ope sm:modal-middle">
    <div class="modal-box relative
                sm:w-full sm:max-w-xl overflow-hidden">

        <Alert form={form} styles="absolute top-4 left-3 max-w-sm" />

        <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            id="add_alumno_close">✕</button>
        </form>

        <h2 class="font-bold text-xl">Crear Bloque de Horario</h2>

        <div class="w-full text-start text-sm">
            <span>ss</span>
        </div>

        <div class="modal-container">

        </div>
    </div>
</dialog>

<style lang="postcss">
    .modal-box {
        @apply border border-base-content/80
        sm:w-10/12  overflow-hidden;
    }          
    .modal-container {
        @apply flex mt-1 max-h-[30rem] overflow-y-auto overflow-x-hidden;
        scrollbar-width: thin;
    }
</style>