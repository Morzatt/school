<script lang="ts">
    import type { ActionData, PageData } from './$types';
    import search_icon from "$lib/images/icons/search_icon.svg"
    import filter_icon from "$lib/images/icons/filter_icon.svg"
    import clear_icon from "$lib/images/icons/clear_icon.svg"
    import chevron_left from "$lib/images/icons/chevron_left.svg"
    import ver_icon from "$lib/images/icons/details_icon.svg"
    import chevron_right from "$lib/images/icons/chevron_right.svg"
    import { basePath } from '$lib';
    import Alert from '$lib/components/Messages/Alert.svelte';
    import { enhance } from '$app/forms';
    import { goto, invalidateAll } from '$app/navigation';

    let { data, form }: { data: PageData, form: ActionData } = $props();
    let { alumnos } = $derived(data)

    let index = $state(data.index ? data.index : 0)
    let filter = $state("")
    let search = $state("")

    let url = $derived(`${basePath}/alumnos?index=${index}&filter=${filter}&search=${search}`) 

    let indexHandler = {
        incrementIndex: async () => {
            if (alumnos!.length <= 14) return;
            index += 15
            handleSearch()
        },

        decrementIndex: async () => {
            if (index === 0) return;
            index -= 15
            handleSearch()
        }
    }

    async function handleSearch() {
        await invalidateAll()
        goto(url)
    }

    let paginas = $derived(Math.floor(data.total_alumnos/15)) 
</script>

<div class="w-full h-full relative">
    <Alert form={ form } styles="fixed right-6 top-12 max-w-sm"/>
    <div class="content-wrapper">
        <div>
            <div>
                <h3 class="text-xl font-bold">Alumnos</h3>
                <p class="text-sm">Lista de Alumnos, agregar, eliminar, administrar y más...</p>
            </div>

            <div class="mt-4">
                <div aria-label="Card" class="card rounded-md">
                    <div class="card-body p-0">

                        <!-- STATS -->
                        <div class="flex items-center justify-between max-lg:flex-wrap lg:px-5 pt-5 lg:gap-5 gap-1">
                            {#each [1,2,3,4] as i}
                                <div class="h-28 w-[calc(50%-0.25rem)] lg:w-1/4">
                                    <div class="border border-base-content/40 h-2/6
                                                px-2 flex items-center justify-start
                                                text-sm font-bold bg-primary text-base-100
                                                rounded-md rounded-bl-none rounded-br-none border-b-0">
                                        <span>Total Matricula</span>
                                    </div>
                                    <div class="border border-base-content/40 h-4/6
                                                px-2 flex items-center justify-start 
                                                rounded-md rounded-tl-none rounded-tr-none bg-base-100 border-t-0">
                                        <span class="text-4xl font-bold pr-4 border-r border-base-content/40">12</span>
                                        <span class="bg-success rounded-lg text-xs ml-2 p-1 px-2 text-success-content">+231</span>
                                    </div>
                                </div> 
                            {/each}
                        </div>                        

                        <!-- SEARCH, SORT, ADD -->
                        <div class="flex items-center justify-between px-5 pt-5">
                            <div class="inline-flex items-center gap-3">
                                <div class="join">
                                    <label class="form-control flex flex-row items-center 
                                    rounded-xl rounded-r-none border border-base-content/20
                                     py-1 px-3
                                     bg-base-100">
                                        <input bind:value={search} placeholder="Buscar Alumnos"
                                            class="input w-full focus:bg-transparent focus:border-transparent focus:outline-0 transition-all input-sm focus:outline-offset-0">
                                    </label>
                                    <button class="rounded-xl px-2 tooltip rounded-l-none border border-base-content/20 bg-base-200" data-tip="Buscar"
                                    onclick={() => {index=0;handleSearch()}}>
                                        <img src="{search_icon}" alt="" class="size-[1.8em] icon">
                                    </button>
                                </div>

                                <label class="form-control flex flex-row items-center border border-base-content/20">
                                    <input type="date" id="date_search" placeholder="Buscar Donantes"
                                    class="w-full scale-0 absolute origin-left translate-x-[-50px] focus:border-transparent active:outline-0 transition-all input-sm active:outline-offset-0"
                                    oninput="{searchHandler.search}">
                                </label>
                            </div>

                            <div class="flex items-center justify-end px-5 pb-5 pt-3">
                                <button class="btn btn-accent-content btn-outline ml-6 btn-sm"
                                onclick="{() => {document.getElementById("creation_modal")!.showModal()}}">
                                    <span>+</span>
                                    <span>Añadir</span>
                                </button>
                            </div>
                        </div>
                        
                        <!-- FILTER -->
                        <div class="flex items-center justify-between px-5 h-16">
                            <div class="join gap-2 *:bg-base-100 flex items-center justify-between tooltip" data-tip="Seleccionar Filtro">
                                <div class="select-none border border-base-content/40 rounded-md btn-square btn-sm flex items-center justify-center">
                                    <img src="{filter_icon}" alt="" class="icon">
                                </div>
                                <select oninput="{() =>{ index = 0; handleSearch() } }" bind:value={filter}
                                    class="max-w-xs p-1
                                            text-sm 
                                            btn btn-sm
                                            rounded-none border border-base-content/20
                                            focus:outline-0 focus:outline-offset-0">
                                    <option disabled selected>Filtro</option>
                                    <option value="cedula_escolar">Cédula Escolar</option>
                                    <option value="primer_nombre">Nombre</option>
                                    <option value="primer_apellido">Apellido</option>
                                    <option value="edad">Edad</option>
                                </select>       
                            </div>

                            <div class="join">
                                <div class="mr-4 px-3 text-sm font-bold flex items-center justify-center">
                                    <p class="text-base-content/60">Pag. <b class="text-base-content">{index/15}</b> de {paginas === 0 ? 1 : paginas}</p>
                                </div>
                                <button onclick="{indexHandler.decrementIndex}" aria-label="pagination-prev"
                                    class="btn join-item gap-2 btn-sm active:bg-neutral-800 group tooltip" data-tip="Anterior">
                                    <img src="{chevron_left}" alt="" class="size-[1.4em] group-active:invert filter icon">
                                </button>
                                <button onclick="{indexHandler.incrementIndex}" aria-label="pagination-next" class="btn join-item gap-2 btn-sm active:bg-neutral-800 group tooltip" data-tip="Siguiente">
                                    <img src="{chevron_right}" alt="" class="size-[1.4em] group-active:invert filter icon">
                                </button>

                                <button 
                                onclick="{() => {index=0;filter="", search=""; handleSearch()}}"
                                 aria-label="pagination-next"
                                  class="btn mx-4 gap-2 btn-sm active:bg-neutral-800 group tooltip" data-tip="Limpiar Busqueda">
                                    <img src="{clear_icon}" alt="" class="size-[1.4em] group-active:invert filter icon">
                                </button>
                            </div>
                        </div>

                        <!-- TABLE -->
                        <div class="overflow-auto">
                            <table class="table mt-2 text-center flex">
                                <thead class="bg-base-100 [&_span]:font-bold">
                                    <tr>
                                        <th><span class="text-sm font-medium text-base-content/80">#</span></th>
                                        <th><span class="text-sm font-medium text-base-content/80">Cédula</span></th>
                                        <th><span class="text-sm font-medium text-base-content/80">Nombre</span></th>
                                        <th><span class="text-sm font-medium text-base-content/80">Apellido</span></th>
                                        <th><span class="text-sm font-medium text-base-content/80">Fecha de Nacimiento</span></th>
                                        <th><span class="text-sm font-medium text-base-content/80">Edad</span></th>
                                        <th><span class="text-sm font-medium text-base-content/80">Sexo</span></th>
                                        <th><span class="text-sm font-medium text-base-content/80">Ver</span></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {#if alumnos}
                                        {#each alumnos as alumno, i}
                                            <tr class="border-none">
                                                <th>{(i+1)+index}</th>
                                                <th>{alumno.cedula_escolar}</th>
                                                <th>{alumno.primer_nombre}</th>
                                                <th>{alumno.primer_apellido}</th>
                                                <th>{new Date(alumno.fecha_nacimiento).toLocaleDateString()}</th>
                                                <th>{alumno.edad}</th>
                                                <th>{alumno.sexo}</th>
                                                <th>
                                                    <a class="btn btn-sm btn-square" href="{basePath}/alumnos/{alumno.cedula_escolar}">
                                                        <img src="{ver_icon}" alt="" class="icon">
                                                    </a>
                                                </th>
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

        <form action="?/createAlumno" method="POST" use:enhance class="min-h-12 mt-5">
            <input type="text" name="cedula_escolar" placeholder="cedula_escolar">

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