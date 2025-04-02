<script lang="ts">
    import { enhance } from '$app/forms';
    import { FormResponse } from '$lib/classes/responses.classes';
    import Alert from '$lib/components/Messages/Alert.svelte';
    import type { ActionData } from './$types';
    import delete_icon from "$lib/images/icons/borrar_icon.svg"
    import chevron_right from "$lib/images/icons/chevron_right.svg"
    import chevron_left from "$lib/images/icons/chevron_left.svg"
    import type { RepresentanteInsertable } from '$lib/database/types';

    let { form }: { form: ActionData } = $props();

    let telefonos: string[] = $state([""])

    let content: 'personal' | 'contact' | 'preview' = $state("personal")

    let nacionalidad = $state("Elegir")
    let cedula = $state("")
    let estado_civil = $state("Elegir")
    let sexo = $state("Elegir")
    let nombre = $state("")
    let apellido = $state("")
    let direccion = $state("")
    let correo = $state("") 
    let tel1 = $state("") 
    let tel2 = $state("") 
    let ocupacion = $state("") 
    let grado_instruccion = $state("") 
    let fecha_nacimiento= $state("") 

    let keys = $derived([
        {
            key: "Nacionalidad",
            name: "nacionalidad",
            value: nacionalidad
        },
        {
            key: "Cedula",
            name: "cedula",
            value: cedula 
        },
        {
            key: "Estado Civil",
            name: "estado_civil",
            value: estado_civil 
        },
        {
            key: "Sexo",
            name: "sexo",
            value: sexo 
        },
        {
            key: "Nombre",
            name: "nombre",
            value: nombre 
        },
        {
            key: "Apellido",
            name: "apellido",
            value: apellido
        },
        {
            key: "Direccion",
            name: "direccion",
            value: direccion 
        },
        {
            key: "Correo Electronico",
            name: "correo_electronico",
            value: correo
        },
        {
            key: "Telefono #1",
            name: "telefono_1",
            value: tel1 
        },
        {
            key: "Telefono #2",
            name: "telefono_2",
            value: tel2
        },
        {
            key: "Ocupacion",
            name: "ocupacion",
            value: ocupacion
        },
        {
            key: "Grado de Instruccion",
            name: "grado_instruccion",
            value: grado_instruccion
        },
        {
            key: "Fecha de Nacimiento",
            name: "fecha_nacimiento",
            value: fecha_nacimiento
        },
    ])

    function addData() {
        let container = document.getElementById('input_container') as HTMLDivElement
        keys.forEach(el => {
            let input = document.createElement('input')
            input.type = "hidden"
            input.name = el.name
            input.value = el.value

            container.appendChild(input)
        })
    }
    function deleteData() {
        let container = document.getElementById('input_container') as HTMLDivElement
        container.innerHTML = ""
    }
</script>

{#snippet personal()}
    <div class="w-full p-2 animate-x relative">
        <h3 class="font-semibold">Datos Personales</h3>

        <div class="w-full flex flex-col items-center justify-between rounded-md p-2 gap-3">
            <div class="w-full h-full flex gap-4">
                <!-- Nacionalidad -->
                <label class="form-control">
                    <div class="label">
                        <span class="label-text">Nacionalidad</span>
                    </div>
                    <select name="nacionalidad" class="btn btn-sm border border-base-content/60" bind:value={nacionalidad}>
                        <option selected disabled>Elegir</option>
                        <option value="Venezolano">Venezolano</option>
                        <option value="Extranjero">Extranjero</option>
                    </select>
                </label> 
                <!-- CEDULA -->
                <label class="form-control">
                    <div class="label">
                        <span class="label-text">Cédula</span>
                    </div>
                    <input type="number" name="cedula" class="input" placeholder="Cédula del Representante..." bind:value={cedula}>
                </label>   
                <!-- Estado CIVIL-->
                <label class="form-control">
                    <div class="label">
                        <span class="label-text">Estado Civil</span>
                    </div>
                    <select name="estado_civil" class="btn btn-sm border border-base-content/60" bind:value={estado_civil}>
                        <option selected disabled>Elegir</option>
                        <option value="Solter@">Solter@</option>
                        <option value="Casad@">Casad@</option>
                    </select>
                </label>
            </div>

            <div class="w-full h-full flex gap-4 flex-wrap">
                <!-- SEXO -->
                <label class="form-control">
                    <div class="label">
                        <span class="label-text">Sexo</span>
                    </div>
                    <select name="sexo" class="btn btn-sm border border-base-content/60" bind:value={sexo}>
                        <option selected disabled>Elegir</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Masculino">Femenino</option>
                    </select>
                </label> 
                <!-- APELLIDO -->
                <label class="form-control">
                    <div class="label">
                        <span class="label-text">Fecha de Nacimiento</span>
                    </div>
                    <input type="date" name="apellido" class="input" placeholder="Primer Apellido del Representante..." bind:value={fecha_nacimiento}>
                </label>
                <!-- NOMBRE -->
                <label class="form-control">
                    <div class="label">
                        <span class="label-text">Nombre</span>
                    </div>
                    <input type="text" name="nombre" class="input" placeholder="Primer Nombre del Representante..." bind:value={nombre}>
                </label>   

                <!-- APELLIDO -->
                <label class="form-control">
                    <div class="label">
                        <span class="label-text">Apellido</span>
                    </div>
                    <input type="text" name="apellido" class="input" placeholder="Primer Apellido del Representante..." bind:value={apellido}>
                </label>
            </div>

            <div class="w-full h-full flex gap-4">
                <!-- SEXO -->
                <label class="form-control">
                    <div class="label">
                        <span class="label-text">Grado de Instrucción</span>
                    </div>
                    <input type="text" name="nombre" class="input" placeholder="Primer Nombre del Representante..." bind:value={grado_instruccion}>
                </label> 
                <!-- NOMBRE -->
                <label class="form-control">
                    <div class="label">
                        <span class="label-text">Ocupacion</span>
                    </div>
                    <input type="text" name="nombre" class="input" placeholder="Primer Nombre del Representante..." bind:value={ocupacion}>
                </label>   
            </div>
        </div>

        <div class="w-full h-max mt-3 flex items-center justify-end">
            <button class="btn btn-accent btn-sm flex items-center justify-center" type="button"
            onclick="{() => { content = "contact" }}">
                <span>
                    <img src="{chevron_right}" alt="" class="icon">
                </span>
                <span>Siguiente</span>
            </button>
        </div>
    </div>
{/snippet}

{#snippet contact()}
    <div class="w-full rounded-md p-2 animate-x">
        <h3 class="font-semibold">Datos de Contacto</h3>

        <div class="w-full flex flex-col items-start justify-between gap-3">
            <div class="w-full h-full rounded-md p-2">
                <!-- DIRECCION -->
                <label class="form-control">
                    <div class="label">
                        <span class="label-text">Dirección</span>
                    </div>
                    <input type="text" name="direccion" class="input" placeholder="Dirección del Representante..." bind:value={direccion}>
                </label>   

                <!-- CORREO -->
                <label class="form-control max-w-xs">
                    <div class="label">
                        <span class="label-text">Correo Electrónico</span>
                    </div>
                    <input type="text" name="correo_electronico" class="input" placeholder="Correo Electrónico del Representante..." bind:value={correo}>
                </label>   
            </div>

            <div class="w-full flex items-center justify-between">
                <h3 class="font-semibold">Números de Contacto</h3>
            </div>

            <p class="text-sm text-base-content/60">Debe de ingresar al menos (2) numeros de telefono validos para continuar</p>

            <div class="w-full rounded-md flex items-center justify-start flex-wrap gap-2">
                <label class="form-control lg:max-w-[12rem]">
                    <div class="label">
                        <span class="label-text">Teléfono <b>1</b></span>
                    </div>
                    <input type="tel" name="telefono" class="input" placeholder="Telefono #1..." bind:value={tel1}>
                </label> 

                <label class="form-control lg:max-w-[12rem]">
                    <div class="label">
                        <span class="label-text">Teléfono <b>2</b></span>
                    </div>
                    <input type="tel" name="telefono" class="input" placeholder="Telefono #2..." bind:value={tel2}>
                </label>  
            </div>
        </div>

        <div class="w-full h-max mt-3 flex items-center justify-between ">
            <button class="btn btn-accent btn-circle btn-sm flex items-center justify-center" type="button"
            onclick="{() => { content = "personal" }}">
                <span>
                    <img src="{chevron_left}" alt="" class="icon">
                </span>
            </button>
            <button class="btn btn-accent btn-sm flex items-center justify-center" type="button"
            onclick="{() => { content = "preview"; addData() }}">
                <span>
                    <img src="{chevron_right}" alt="" class="icon">
                </span>
                <span>Siguiente</span>
            </button>
        </div>
    </div>
{/snippet}

{#snippet preview()}
    <h3 class="text-lg font-semibold mt-2">Previsualización</h3>
    <div class="overflow-x-auto rounded-md border border-base-content/30 bg-base-100 mt-2">
        <table class="table">
            <!-- head -->
            <thead>
                <tr class="border-b border-base-content/30 bg-primary/50">
                    <th>Campo</th>
                    <th>Valor</th>
                </tr>
            </thead>
            <tbody>
                {#each keys as k}
                    <tr class="border-y border-base-content/30">
                        <td>{k.key}</td>
                        <td class="border-l border-base-content/30 {!k.value || k.value === "Elegir" ? "text-error" : ""}">{!k.value || k.value === "Elegir" ? "No especificado" : k.value}</td>
                    </tr>                   
                {/each}
            </tbody>
        </table>
    </div>

    <div class="w-full h-max mt-3 flex items-center justify-between">
        <button class="btn btn-accent btn-circle btn-sm flex items-center justify-center" type="button"
        onclick="{() => { content = "contact"; deleteData() }}">
            <span>
                <img src="{chevron_left}" alt="" class="icon">
            </span>
        </button>
    </div>
    <div class="w-full h-max mt-1 flex items-center justify-end pb-6">
        <button class="btn btn-success btn-sm btn-wide" type="submit">
            Registrar
        </button>
    </div>
{/snippet}

<dialog id="create_representante_modal" class="modal modalopen modal-bottom sm:modal-middle">
    <div class="modal-box relative
                sm:w-10/12 sm:max-w-lg overflow-hidden">

        <Alert form={form} styles="absolute top-4 left-3 text-sm max-w-xs" />

        <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            id="eliminar_representante_close">✕</button>
        </form>

        <h1 class="text-xl font-bold">Registrar Representante</h1>
        <p class="text-sm text-base-content/60">Ingrese los datos correspondientes para registrar al nuevo representante.</p>

        <div class="w-full flex items-center border border-base-content/30 justify-center mt-4 p-2 rounded-md shadow-sm">
            <ul class="steps text-sm">
                <li class="step step-primary">Datos Personales</li>
                <li class="step {content == "contact" || content == "preview" ? "step-primary" : ""}">Datos de Contacto</li>
                <li class="step {content == "preview" ? "step-primary" : ""}">Finalizar</li>
            </ul>
        </div>

        <div class="modal-container">
            <form action="?/create" method="POST" use:enhance class="w-full h-auto">
                <div id="input_container">

                </div>

                {#if content === "contact"}
                    {@render contact()}
                {:else if content === "preview"}
                    {@render preview()}
                {:else}
                    {@render personal()} 
                {/if}                
            </form>
        </div>
    </div>
</dialog>

<style lang="postcss">
    .form-control {
        @apply my-2;
    }
    .form-control .label { 
        @apply h-fit p-0 px-2 py-1;
    }
    .form-control .label .label-text {
        @apply font-bold;
    }

    .modal-box {
        @apply border border-base-content/80;
    }          
    .modal-container {
        @apply flex max-h-[20rem] overflow-y-auto overflow-x-hidden;
        scrollbar-width: thin;
    }

    .input {
        @apply input-bordered focus:outline-0 input-sm w-full bg-base-200;
    }

    .input, .select {
        @apply relative border ;
    }

    select {
        @apply btn btn-sm border-base-content/30 border focus:outline-0;
    }
</style>