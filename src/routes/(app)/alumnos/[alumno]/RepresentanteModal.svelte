<script lang="ts">
    import { enhance } from "$app/forms";
    import { basePath, formatStringWithDots } from "$lib";
    import Alert from "$lib/components/Messages/Alert.svelte";
    import type { RepresentantesByAlumnosResult } from "$lib/database/repositories/alumnos.repository";
    import edit_icon from "$lib/images/icons/edit_icon.svg"
    import ver_icon from "$lib/images/icons/details_icon.svg"

    let { representante, form, tel }: {
        representante: RepresentantesByAlumnosResult,
        form: any | null,
        tel: string[] | undefined
    } = $props()

    let telefonos = $derived(tel)

    let infoEdit = $state(false);

    type RepresentanteData = {
        title: string,
        value: string,
        name: string,
        style?: string
    }

    let data: RepresentanteData[] = $derived([
        {
            name: "nombre",
            title: "Nombre",
            value: representante.nombre,
        },
        {
            name: "apellido",
            title: "Apellido",
            value: representante.apellido
        },
        {
            name: "correo_electronico",
            title: "Correo Electrónico",
            value: representante.correo_electronico,
        },
        {
            name: "direccion",
            title: "Dirección",
            value: representante.direccion,
            style: "col-span-2"
        },
    ])

    let telEdit = $state(false)
</script>

<dialog id="representante_{representante.cedula}_modal" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box relative
                sm:w-full sm:max-w-xl overflow-hidden">

        <Alert form={form} styles="absolute top-4 left-3" />

        <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            id="representante_{representante.cedula}_close">✕</button>
        </form>

        <div class="font-bold text-xl flex items-center justify-start gap-8">
            <span>Representante</span>

            <a href="{basePath}/representantes/{representante.cedula}" class="btn btn-xs btn-square">
                <img src="{ver_icon}" alt="" class="icon">
            </a>
        </div>

        <div class="modal-container">
            <div class="mt-4">
                <div class="flex items-center justify-between">
                    <h3 class="font-semibold">Información del Representante</h3>
                </div>
                <div class="w-full mt-4
                    grid grid-cols-2 lg:grid-cols-3 gap-2 *:w-full">
                    <div class="form-control max-w-xs">
                        <div class="label">
                            <span class="label-text">Cédula</span>
                        </div>
                        <p>{formatStringWithDots(representante.cedula)}</p>
                    </div>   

                    <div class="form-control max-w-xs">
                        <div class="label">
                            <span class="label-text">Sexo</span>
                        </div>
                        <p>{representante.sexo}</p>
                    </div> 


                    <div class="form-control max-w-xs">
                        <div class="label">
                            <span class="label-text">Parentesco</span>
                        </div>
                        <p>{representante.relacion}</p>
                    </div> 
                </div>

                <div class="divider"></div>

                <form action="?/editRepresentante" method="POST" class="mt-6" use:enhance>
                    <div class="flex items-center justify-between">
                        <h3 class="font-semibold">Información de Contacto</h3>
                        
                        <button class="btn btn-circle btn-active btn-sm p-1 active:btn-primary group"
                        onclick="{() => { setTimeout(() => {infoEdit = !infoEdit}, 100) }}" type="{infoEdit ? "submit" : "button"}">
                            <img src="{edit_icon}" alt="" class="group-active:invert filter icon">
                        </button>
                    </div>

                    <input type="hidden" name="id_representante" value={representante.cedula}>
                    <div class="w-full mt-4
                                grid grid-cols-2 lg:grid-cols-3 gap-2 *:w-full">
                        {#each data as field}
                            <label class="form-control max-w-xs {field.style}">
                                <div class="label">
                                    <span class="label-text">{field.title}</span>
                                </div>
                                {#if infoEdit}
                                    <input type="text" 
                                    value={field.value}
                                    name={field.name}
                                    placeholder="{field.title}..." 
                                    class="input input-bordered input-sm w-full max-w-xs" />
                                {:else}
                                    <p>{field.value}</p>
                                {/if}
                            </label>                           
                        {/each}
                    </div>
                </form>

                <div class="divider"></div>

                <form action="?/editTelefonos" method="POST" class="mt-6 pb-12" use:enhance>
                    <div class="flex items-center justify-between">
                        <h3 class="font-semibold">Información Telefónica</h3>
                        
                        <button class="btn btn-circle btn-active btn-sm p-1 active:btn-primary group"
                        onclick="{() => { setTimeout(() => {telEdit = !telEdit}, 100) }}" type={telEdit ? "submit" : "button"}>
                            <img src="{edit_icon}" alt="" class="group-active:invert filter icon">
                        </button>
                    </div>

                    <input type="hidden" name="id_representante" value={representante.cedula}>

                    <div class="w-full mt-4
                                grid grid-cols-2 lg:grid-cols-3 gap-2 *:w-full">
                        {#if telefonos}
                            {#each telefonos as telefono, i}
                                <label class="form-control max-w-xs col-span-2 border border-base-content/40 rounded-md relative">
                                    <div class="label">
                                        <span class="label-text">Telefono #{i+1}</span>
                                    </div>
                                    {#if telEdit}
                                        <input type="text" 
                                        value={telefono}
                                        name="telefono_{telefono}"
                                        placeholder="Telefono #{i+1}..." 
                                        class="input input-bordered input-sm w-full max-w-xs" />
                                    {:else}
                                        <p>{telefono}</p>
                                    {/if}
                                </label>   
                            {/each}                        
                        {/if} 
                    </div>
                </form>
            </div>
        </div>
    </div>
</dialog>
                        
<style lang="postcss">
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
</style>