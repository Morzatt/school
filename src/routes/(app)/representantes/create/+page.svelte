<script lang="ts">
    import { enhance } from '$app/forms';
    import { FormResponse } from '$lib/classes/responses.classes';
    import Alert from '$lib/components/Messages/Alert.svelte';
    import type { ActionData, PageData } from './$types';
    import delete_icon from "$lib/images/icons/borrar_icon.svg"
    import { basePath } from '$lib';
    import chevron from "$lib/images/icons/chevron_left.svg"

    let { data, form }: { data: PageData, form: ActionData } = $props();

    let genForm = $derived.by(() => {
        return form?.form === "delete" ? null : form;
    })

    let deleteForm = $derived.by(() => {
        if (form?.form === "delete") {
            if (form?.success) {
                document.getElementById("eliminar_representante_close")!.click()
                form = new FormResponse('').success('Representante Eliminado Correctamente')
            }
            return form
        } else {
            return null 
        }
    })

    let telefonos: string[] = $state([""])

    function addNumber() {
        if (telefonos.length >= 2) {
            form = new FormResponse('Validacion').error('Número de teléfonos máximo: 2')
            return
        }

        telefonos.push("")
    }

    function deleteNumber(i: number) {
        telefonos.pop()
    }
</script>

<div class="lg:py-6 lg:px-[10rem] size-full relative">
    <a href="{basePath}/alumnos" class="absolute left-2 top-2 btn btn-sm btn-circle flex items-center justify-center tooltip tooltip-right"
    data-tip="Administrar Alumnos">
        <img src="{chevron}" alt="">
    </a>

    <Alert form={ genForm } styles="text-sm max-w-sm fixed lg:absolute top-16 left-4"/>
    <form action="?/create" method="POST" use:enhance class="w-full
                           bg-base-100 rounded-md shadow-md border border-base-300
                           p-4 ">

        <div class="w-full flex items-center justify-between">
            <h1 class="text-xl font-bold">Registrar Representante</h1>

            <button class="btn btn-sm btn-error" type="button"
            onclick="{() => {document.getElementById('eliminar_representante_modal')!.showModal()}}">Eliminar Representante</button>
        </div>

        <div class="w-full border border-base-content/30 rounded-md mt-4 p-2">
            <h3 class="font-semibold">Datos Personales</h3>

            <div class="w-full mt-3 flex flex-col lg:flex-row items-start justify-between gap-3">
                <div class="w-full lg:w-2/5 h-full bg-base-200 rounded-md p-2">
                    <!-- CEDULA -->
                    <label class="form-control max-w-[10rem]">
                        <div class="label">
                            <span class="label-text">Cédula</span>
                        </div>
                        <input type="text" name="cedula" class="input" placeholder="Cédula del Representante...">
                    </label>   

                    <!-- NOMBRE -->
                    <label class="form-control max-w-xs">
                        <div class="label">
                            <span class="label-text">Nombre</span>
                        </div>
                        <input type="text" name="nombre" class="input" placeholder="Primer Nombre del Representante...">
                    </label>   

                    <!-- APELLIDO -->
                    <label class="form-control max-w-xs">
                        <div class="label">
                            <span class="label-text">Apellido</span>
                        </div>
                        <input type="text" name="apellido" class="input" placeholder="Primer Apellido del Representante...">
                    </label>   
                </div>

                <div class="w-full lg:w-3/5 h-full bg-base-200 rounded-md p-2">
                    <!-- SEXO -->
                    <label class="form-control max-w-[10rem]">
                        <div class="label">
                            <span class="label-text">Sexo</span>
                        </div>
                        <select name="sexo" class="btn btn-sm border border-base-content/60">
                            <option selected disabled>Elegir</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Masculino">Femenino</option>
                        </select>
                    </label>   

                    <!-- DIRECCION -->
                    <label class="form-control max-w-xs">
                        <div class="label">
                            <span class="label-text">Dirección</span>
                        </div>
                        <input type="text" name="direccion" class="input" placeholder="Dirección del Representante...">
                    </label>   

                    <!-- CORREO -->
                    <label class="form-control max-w-xs">
                        <div class="label">
                            <span class="label-text">Correo Electrónico</span>
                        </div>
                        <input type="text" name="correo_electronico" class="input" placeholder="Correo Electrónico del Representante...">
                    </label>   
                </div>
            </div>
        </div>

        <div class="w-full p-3 mt-2 rounded-md border border-base-content/50">
            <div class="flex items-center justify-between">
                <h3 class="font-semibold">Añadir teléfonos</h3>

                <button type="button" class="btn btn-accent btn-sm" onclick="{addNumber}">
                    <span>+</span>
                    <span>Añadir Teléfono</span>
                </button>
            </div>

            <div class="w-full p-2 mt-3 rounded-md bg-base-200 flex items-center justify-start flex-wrap gap-2">
                {#each telefonos as telefono, i}
                    <!-- TELEFONO #{i} -->
                    <label class="form-control lg:max-w-[12rem] border border-base-content/30 p-2 relative"
                    id="telefono_{i}">
                        <div class="label">
                            <span class="label-text">Teléfono <b>{i+1}</b></span>
                            <button class="btn btn-error btn-xs p-0"
                            onclick="{() => {deleteNumber(i)}}" type="button">
                                <img src="{delete_icon}" class="filter invert icon" alt="">
                            </button>
                        </div>
                        <input type="text" name="telefono" class="input" placeholder="Telefono #{i+1}...">
                    </label>  
                {/each}
            </div>
        </div>       

        <div class="w-full h-max mt-3 flex items-center justify-center">
            <button class="btn btn-success btn-sm btn-wide" type="submit">
                Registrar
            </button>
        </div>
    </form>
</div>


<dialog id="eliminar_representante_modal" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box relative
                sm:w-10/12 sm:max-w-lg overflow-hidden">
        <Alert form={deleteForm} styles="absolute top-4 left-3 text-sm max-w-xs" />
        <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            id="eliminar_representante_close">✕</button>
        </form>

        <h3 class="text-lg mt-2 font-bold">Eliminar Representante</h3>
        <p class="text-xs font-bold">Para proceder, introducir una cédula válida del representante a eliminar.</p>
        <p class="text-sm">Es importante tener en cuenta que una vez eliminados los datos, estos se eliminarán al mismo tiempo de todo Alumno representado.</p>
        <div class="modal-container">
            <form action="?/delete" method="POST" use:enhance class="h-auto w-full">
                <!-- CEDULA -->
                <label class="form-control max-w-[15rem] mt-3">
                    <div class="label">
                        <span class="label-text">Cédula</span>
                    </div>
                    <input type="text" name="cedula" class="input" placeholder="Cédula del Representante a Eliminar...">
                </label>  
                <button class="btn btn-error btn-sm mt-6">Eliminar</button>
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
    .form-control .label .labe-text {
        @apply font-bold;
    }

    .input {
        @apply input-bordered focus:outline-0 input-sm w-full;
    }
</style>