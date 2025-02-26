<script lang="ts">
    import { formatStringWithDots } from "$lib";
    import type { RepresentantesByAlumnosResult } from "$lib/database/repositories/alumnos.repository";
    import edit_icon from "$lib/images/icons/edit_icon.svg"

    let { representante, lista_telefonos}: {
         representante: RepresentantesByAlumnosResult,
          lista_telefonos: { representante: string, telefonos:string[] | unknown}[] | undefined } = $props()

    let edicion = $state(false);

    let telefonos: string[] | undefined | null = $derived.by(() => {
        let tel;
        lista_telefonos?.forEach(i => {
            tel = i.representante === representante.cedula ? i.telefonos : null
        })
        return tel
    })

    type RepresentanteData = {
        title: string,
        value: string,
        name: string,
        style?: string
    }

    let data = $state([
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
            name: "direccion",
            title: "Dirección",
            value: representante.direccion,
            style: "col-span-2"
        },
        {
            name: "correo_electronico",
            title: "Correo Electrónico",
            value: representante.correo_electronico,
        },
    ])
</script>

<dialog id="representante_{representante.cedula}_modal" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box relative
                sm:w-full sm:max-w-xl overflow-hidden">

        <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            id="representante_{representante.cedula}_close">✕</button>
        </form>

        <h2 class="font-bold text-xl">Representante</h2>

        <div class="modal-container">
            <div class="mt-2">
                <div class="flex items-center justify-between">
                    <h3 class="font-semibold">Información del Representante</h3>
                    
                    <button class="btn btn-circle btn-active btn-sm p-1 active:btn-primary group"
                    onclick="{() => {edicion = !edicion}}">
                        <img src="{edit_icon}" alt="" class="group-active:invert filter icon">
                    </button>
                </div>

                <div class="w-full mt-4
                    grid grid-cols-2 lg:grid-cols-3 gap-2 *:w-full">

                    <div class="form-control max-w-xs">
                        <div class="label">
                            <span class="label-text">Cédula</span>
                        </div>
                        <p>{formatStringWithDots(representante.cedula)}</p>
                    </div>   

                    {#each data as field}
                        <label class="form-control max-w-xs {field.style}">
                            <div class="label">
                                <span class="label-text">{field.title}</span>
                            </div>
                            {#if edicion}
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

                    {#if telefonos}
                        {#each telefonos as telefono, i}
                        <div class="form-control max-w-xs">
                            <div class="label">
                                <span class="label-text">Telefono #{i+1}</span>
                            </div>
                            <p>{telefono}</p>
                        </div> 
                        {/each}                        
                    {/if}
                </div>
            </div>
        </div>
    </div>
</dialog>
                        
<style lang="postcss">
    .input {
        @apply focus:bg-transparent focus:outline-0;
    }

    .form-control {
        @apply px-2;
    }

    .form-control .label .label-text {
        @apply font-bold;
    }

    .form-control p {
        @apply text-sm pb-1;
    }
</style>