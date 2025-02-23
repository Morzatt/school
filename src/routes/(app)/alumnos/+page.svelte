<script lang="ts">
    import type { PageData } from './$types';
    import search_icon from "$lib/images/icons/search_icon.svg"
    import chevron_left from "$lib/images/icons/chevron_left.svg"
    import chevron_right from "$lib/images/icons/chevron_right.svg"
    import { basePath } from '$lib';
    import Alert from '$lib/components/Messages/Alert.svelte';
    import { enhance } from '$app/forms';

    let { data }: { data: PageData } = $props();
    let { alumnos } = $derived(data)

    let form = $state<object>()

    function asignStatusColor(estado: string): string {
        let result = ""
        if (estado === "Por Asignar" || estado === "Diferido") {
            result = "bg-yellow-100 text-yellow-600"
        } else if (estado === "Descartado") {
            result = "bg-red-100 text-red-600"
        } else if (estado === "Activo") {
            result = "bg-green-100 text-green-600"
        }
        return result
    }

    let index = $state(0)
    let number_of_records = 0

    let indexHandler = {
        incrementIndex: async () => {
            if (index === data.number_of_records || (index + 15) >= data.number_of_records || donantes!.length <= 14) return;
            index += 15
            searchHandler.search()
        },

        decrementIndex: async () => {
            if (index === 0) return;
            index -= 15
            searchHandler.search()
        }
    }

    let searchHandler = {
        search: async () => {
            let { inputElement, selectElement, searchBack, dateInput } = getElements()
            let search: string | undefined = inputElement.value.toLowerCase();
            let field: string | undefined = selectElement.value.toLowerCase();
            if (field == undefined || field == "" || field == "Filtro") field = "cedula";
            handleClearUp(search, field, searchBack, inputElement, selectElement, dateInput)
            if (field === "created_at") { search = dateInput.value }
            let response = await fetch(`${basePath}/donors/manage?index=${index}&field=${field}&search=${search}`)
            let donors = await response.json()
        }
    }

    function getElements() {
        let inputElement = document.getElementById("search") as HTMLInputElement
        let selectElement = document.getElementById("select") as HTMLSelectElement
        let searchBack = document.getElementById("search_back") as HTMLButtonElement
        let dateInput = document.getElementById("date_search") as HTMLInputElement
        return { inputElement, selectElement, searchBack, dateInput }
    }

    function removeClasses(element: HTMLElement, classes: string[]) {
        for (let c of classes) { element.classList.remove(c) }
    }
    function addClasses(element: HTMLElement, classes: string[]) {
        for (let c of classes) { element.classList.add(c) }
    }

    function handleClearUp(search: string | undefined, field: string | undefined, searchBack: HTMLButtonElement, inputElement: HTMLInputElement, selectElement: HTMLSelectElement, dateInput: HTMLInputElement) {
        if (search || field) { removeClasses(searchBack, ["scale-0", "absolute", "translate-x-[-50px]"]) }
        if (field === "created_at") { removeClasses(dateInput, ["scale-0", "absolute", "translate-x-[-50px]"]) }

        searchBack.addEventListener("click", async () => {
            inputElement.value = "";
            selectElement.value = "Filtro";
            search = undefined;
            field = undefined;
            index = 0;
            addClasses(searchBack, ["scale-0", "absolute", "translate-x-[-50px]"])
            addClasses(dateInput, ["scale-0", "absolute", "translate-x-[-50px]"])
            let response = await fetch(`${basePath}/donors/manage?index=${index}`)
            let donors = await response.json()
        })
    }
</script>

<div class="w-full h-full relative">
    <Alert form={ form } styles="fixed right-6 top-12 max-w-sm"/>
    <div class="content-wrapper">
        <div>
            <div>
                <h3 class="text-xl font-semibold">Alumnos</h3>
                <p class="text-sm">Administrar alumnos</p>
            </div>

            <div class="mt-5">
                <div aria-label="Card" class="card mt-5 card-bordered rounded-md">
                    <div class="card-body p-0">

                        <div class="flex items-center justify-between px-5 pt-5">

                            <div class="inline-flex items-center gap-3">
                                <button id="search_back" class="origin-left translate-x-[-50px] transition-all duration-300 btn scale-0 absolute btn-circle btn-neutral-500 btn-sm active:bg-neutral-800 group">
                                    <img src="{chevron_left}" alt="" class="group-active:invert filter">
                                </button>

                                <div class="join">
                                    <label class="form-control flex flex-row items-center rounded-sm border border-base-content/20 ps-3">
                                        <img src="{search_icon}" alt="" class="size-[1.2em]">
                                        <input id="search" placeholder="Buscar Alumnos"
                                        class="input w-full focus:border-transparent focus:outline-0 transition-all input-sm focus:outline-offset-0"
                                        oninput="{() => {index=0;searchHandler.search()}}">
                                    </label>

                                    <select oninput="{() =>{ index = 0; searchHandler.search(); } }" 
                                        id="select" 
                                        class="text-sm ps-3 max-w-xs rounded-none p-1 border border-base-content/20 focus:outline-0 focus:outline-offset-0">
                                        <option disabled selected>Filtro</option>
                                        <option value="cedula">Cedula</option>
                                        <option value="primer_nombre">Nombre</option>
                                        <option value="primer_apellido">Apellido</option>
                                        <option value="edad">Edad</option>
                                        <option value="created_at">Fecha</option>
                                    </select>       
                                </div>

                                <label class="form-control flex flex-row items-center border border-base-content/20">
                                    <input type="date" id="date_search" placeholder="Buscar Donantes"
                                    class="w-full scale-0 absolute origin-left translate-x-[-50px] focus:border-transparent active:outline-0 transition-all input-sm active:outline-offset-0"
                                    oninput="{searchHandler.search}">
                                </label>
                            </div>

                            <div class="flex items-center justify-end px-5 pb-5 pt-3">
                                <div class="join">
                                    <button onclick="{indexHandler.decrementIndex}" aria-label="pagination-prev"
                                     class="btn join-item gap-2 btn-sm active:bg-neutral-800 group">
                                        <img src="{chevron_left}" alt="" class="size-[1.4em] group-active:invert filter">
                                    </button>
                                    
                                    <div class="btn join-item btn-sm btn-neutral-700 btn-active">
                                        Pag. {index/15}
                                    </div>

                                    <button onclick="{indexHandler.incrementIndex}" aria-label="pagination-next" class="btn join-item gap-2 btn-sm active:bg-neutral-800 group">
                                        <img src="{chevron_right}" alt="" class="size-[1.4em] group-active:invert filter">
                                    </button>
                                </div>

                                <button class="btn btn-outline ml-6 btn-sm"
                                onclick="{() => {document.getElementById("creation_modal")!.showModal()}}">
                                    <span>+</span>
                                    <span>Añadir</span>
                                </button>
                            </div>
                        </div>

                        <div class="overflow-auto">
                            <table class="table mt-2 text-center flex">
                                <thead>
                                    <tr>
                                        <th><span class="text-sm font-medium text-base-content/80">Ver</span></th>
                                        <th><span class="text-sm font-medium text-base-content/80">Cédula</span></th>
                                        <th><span class="text-sm font-medium text-base-content/80">Nombre</span></th>
                                        <th><span class="text-sm font-medium text-base-content/80">Apellido</span></th>
                                        <th><span class="text-sm font-medium text-base-content/80">Fecha de Nacimiento</span></th>
                                        <th><span class="text-sm font-medium text-base-content/80">Sexo</span></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {#if alumnos}
                                        {#each alumnos as alumno}
                                            <tr>
                                                <th><a class="btn btn-xs" href="{basePath}/alumnos/{alumno.cedula_escolar}">Ver</a></th>
                                                <th>{alumno.cedula_escolar}</th>
                                                <th>{alumno.primer_nombre}</th>
                                                <th>{alumno.primer_apellido}</th>
                                                <th>{new Date(alumno.fecha_nacimiento).toLocaleDateString()}</th>
                                                <th>{alumno.sexo}</th>
                                            </tr>
                                        {/each}                                       
                                    {/if}

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<dialog id="creation_modal" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box">
        <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>

        <h3 class="text-xl font-bold">Registrar Alumno</h3>
        <p class="text-sm text-base-300">Añadir alumno</p>

        <form action="?/createAlumno" method="POST" use:enhance class="min-h-12 bb mt-5">
            <input type="text" name="cedula_escolar" placeholder="cedula_escolar">
            <input type="text" name="cedula_alumno" placeholder="cedula_alumno">

            <input type="text" name="primer_nombre" placeholder="primer_nombre">
            <input type="text" name="segundo_nombre" placeholder="segundo_bombre">
            <input type="text" name="primer_apellido" placeholder="primer_apellido">
            <input type="text" name="segundo_apellido" placeholder="segundo_apellido">

            <select name="sexo">
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
            </select>

            <input type="date" name="fecha_nacimiento" >

            <button type="submit" class="btn btn-success">Aceptar</button>
        </form>
    </div>
</dialog>

<style lang="postcss">
    .content-wrapper {
        @apply flex-grow p-1 pb-8 xl:px-6 transition-all duration-150;
    }

    .red-filter {
        filter: brightness(0) saturate(100%) invert(38%) sepia(93%) saturate(2710%) hue-rotate(339deg) brightness(102%) contrast(86%);
    }
</style>