<script lang="ts">
    import { enhance } from "$app/forms";
    import Alert from "$lib/components/Messages/Alert.svelte";
    import type { ActionData } from "./$types";
    let { cedula_representante, cedula_alumno, form }: { cedula_representante:string, cedula_alumno: string, form: ActionData | null} = $props()

    $effect(() => {
        if (form?.success) {
            document.getElementById(`delete_representante_${cedula_representante}_confirmation_close`)?.click()
        }
    })
</script>

<dialog id="delete_representante_{cedula_representante}_confirmation" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box relative
                sm:w-10/12 sm:max-w-md overflow-hidden">
        <Alert form={form} styles="absolute top-4 left-3" />
        <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            id="delete_representante_{cedula_representante}_confirmation_close">✕</button>
        </form>

        <h3 class="text-lg mt-2 font-bold">¿Seguro que desea desvincular este representante al Alumno?</h3>
        <div class="modal-container">
            <form action="?/deleteRepresentante" method="POST" use:enhance class="h-auto w-full ">
                <input type="hidden" value="{cedula_representante}" name="cedula_representante">
                <input type="hidden" value="{cedula_alumno}" name="cedula_alumno">
                <button class="btn btn-warning btn-sm mt-6">Desvincular</button>
            </form>
        </div>
    </div>
</dialog>