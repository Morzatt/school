<script lang="ts">
    import type { ActionData, PageData } from './$types';
    import search_icon from "$lib/images/icons/search_icon.svg"
    import filter_icon from "$lib/images/icons/filter_icon.svg"
    import clear_icon from "$lib/images/icons/clear_icon.svg"
    import chevron_left from "$lib/images/icons/chevron_left.svg"
    import ver_icon from "$lib/images/icons/details_icon.svg"
    import chevron_right from "$lib/images/icons/chevron_right.svg"

    import turno_all from "$lib/images/icons/turno_all.svg"
    import turno_mañana from "$lib/images/icons/turno_manana.svg"
    import turno_tarde from "$lib/images/icons/turno_tarde.svg"

    import { basePath } from '$lib';
    import Alert from '$lib/components/Messages/Alert.svelte';
    import { enhance } from '$app/forms';
    import { goto, invalidateAll } from '$app/navigation';
    import type { Niveles, Numeros, Secciones } from '$lib/database/types';

    let { data, form }: { data: PageData, form: ActionData } = $props();
    let { alumnos, matriculas } = $derived(data)

    let index = $state(data.index ? data.index : 0)
    let filter = $state("Filtro")
    let search = $state("")
    let nivel = $state("all")
    let estado = $state("all")

    let url = $derived(`${basePath}/alumnos?index=${index}&filter=${filter === "Filtro"?"":filter}&search=${search}&nivel=${nivel}&estado=${estado}`) 

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
        await goto(url, {  keepFocus: true })
    }

    let paginas = $derived(Math.floor(data.total_alumnos/15)) 

    function formatNumero(nm: Numeros | null) {
        switch (nm) {
            case "1":
                return "1er"
            case "2" :
                return "2do"
            case "3":
                return "3er"
            default:
                return `${nm}to`
        }
    }

    function filterGrado(numero: Numeros | null, nivel: Niveles | null, seccion: Secciones | null) {
        return (numero) && (nivel) && (seccion) ? true : false
    }
</script>

{#snippet stat(title:string, stat: any, ten: string, animation?: { animation: string, easing: string })}
    <div class="h-28 w-[calc(50%-0.25rem)] lg:w-1/4 {animation?.animation ? animation?.animation : ""}" style="--easing: {animation?.easing ? animation?.easing : ""}">
        <div class="border border-base-content/40 h-2/6
                    px-2 flex items-center justify-start
                    text-sm font-bold bg-primary text-base-100
                    rounded-md rounded-bl-none rounded-br-none border-b-0">
            <span>{title}</span>
        </div>
        <div class="border border-base-content/40 h-4/6
                    px-2 flex items-center justify-start 
                    rounded-md rounded-tl-none rounded-tr-none bg-base-100 border-t-0">
            <span class="text-4xl font-bold pr-4 border-r border-base-content/40">{stat}</span>
            <span class="bg-success rounded-lg text-xs ml-2 p-1 px-2 text-success-content">{ten}</span>
        </div>
    </div>
{/snippet}

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
                        <div class="flex items-center justify-end max-lg:flex-wrap lg:px-5 pt-5 lg:gap-5 gap-1 animate-y">
                            <div class="stats shadow">
                                <div class="stat">
                                    <div class="stat-figure text-primary">
                                        <img src="{turno_all}" alt=""  class="inline-block h-8 w-8 stroke-current icon">
                                    </div>
                                    <div class="stat-value">{matriculas.matricula?.alumnos}</div>
                                    <div class="stat-title">Total de Alumnos</div>
                                    <div class="stat-desc text-secondary">31 tasks remaining</div>
                                </div>

                                <div class="stat">
                                    <div class="stat-figure text-secondary">
                                        <img src="{turno_mañana}" alt="" class="inline-block h-8 w-8 stroke-current icon">
                                    </div>
                                    <div class="stat-title">Turno de la Mañana</div>
                                    <div class="stat-value text-primary">{matriculas.matricula_manana?.alumnos}</div>
                                    <div class="stat-desc">21% more than last month</div>
                                </div>

                                <div class="stat">
                                    <div class="stat-figure text-secondary">
                                        <img src="{turno_tarde}" alt="" class="inline-block h-8 w-8 stroke-current icon">
                                    </div>
                                    <div class="stat-title">Turno de la Tarde</div>
                                    <div class="stat-value text-secondary">{matriculas.matricula_tarde?.alumnos}</div>
                                    <div class="stat-desc">21% more than last month</div>
                                </div>
                            </div>
                        </div>                        

                        <!-- SEARCH, SORT, ADD -->
                        <div class="flex items-center justify-between px-5 pt-5 animate-y" style="--delay: 50ms">
                            <div class="inline-flex items-center gap-3"> 
                                <div class="join">
                                    <label class="form-control flex flex-row items-center 
                                    rounded-xl rounded-r-none border border-base-content/20
                                     py-1 px-3
                                     bg-base-100">
                                        <input bind:value={search} placeholder="Buscar Alumnos" oninput="{handleSearch}"
                                            class="input w-full focus:bg-transparent focus:border-transparent focus:outline-0 transition-all input-sm focus:outline-offset-0">
                                    </label>
                                    <button class="rounded-xl px-2 tooltip rounded-l-none border border-base-content/20 bg-base-200" data-tip="Buscar"
                                    onclick={() => {index=0;handleSearch()}}>
                                        <img src="{search_icon}" alt="" class="size-[1.8em] icon">
                                    </button>
                                </div>
                                <select class="btn btn-outline btn-sm px-5" oninput="{() =>{ index = 0; setTimeout(handleSearch,100) } }" bind:value={filter}>
                                    <option disabled selected>Filtro</option>
                                    <option value="cedula_escolar">Cedula</option>
                                    <option value="cedula_escolar">Nombre</option>
                                    <option value="cedula_escolar">Apellido</option>
                                </select>

                                <label class="form-control flex flex-row items-center border border-base-content/20">
                                    <input type="date" id="date_search" placeholder="Buscar Alumnos"
                                    class="w-full scale-0 absolute origin-left translate-x-[-50px] focus:border-transparent active:outline-0 transition-all input-sm active:outline-offset-0"
                                    oninput="{handleSearch}">
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
                        <div class="flex items-end mt-1 justify-between px-5 h-16 mb-4 animate-y" style="--delay: 100ms">
                            <div class="flex items-center justify-between gap-4">
                                <div class="join gap-4 flex items-end justify-between tooltip
                                [&_.label-text]:font-bold" data-tip="Seleccionar Filtro">
                                    <div class="select-none bg-base-100 border border-base-content/40 rounded-md btn-square btn-sm flex items-center justify-center">
                                        <img src="{filter_icon}" alt="" class="icon">
                                    </div>

                                    <div class="form-control">
                                        <div class="label">
                                            <span class="label-text">Nivel</span>
                                        </div>
                                        <div class="join grado-content rounded-md
                                        bg-base-content/10 p-1 gap-1 group">
                                            <button class="{nivel === "all" ? "bg-base-100" : "text-base-content/50"}" 
                                                onclick={() => {nivel = 'all'; index=0; handleSearch()}}>
                                                Todo
                                            </button>
                                            <button class="{nivel === "inicial" ? "bg-base-100" : "text-base-content/50"}" 
                                                onclick={() => {nivel = 'inicial'; index=0; handleSearch()}}>
                                                Inicial 
                                            </button>
                                            <button class="{nivel === "primaria" ? "bg-base-100" : "text-base-content/50"}" 
                                                onclick={() => {nivel = 'primaria'; index=0; handleSearch()}}>
                                                Primaria
                                            </button>
                                        </div>
                                    </div>

                                    <div class="form-control">
                                        <div class="label">
                                            <span class="label-text">Estado</span>
                                        </div>
                                        <div class="join grado-content rounded-md
                                        bg-base-content/10 p-1 gap-1 group">
                                            <button class="{estado === "all" ? "bg-base-100" : "text-base-content/50"}" 
                                                onclick={() => {estado = 'all'; index=0; handleSearch()}}>
                                                Todo
                                            </button>
                                            <button class="{estado === "activo" ? "bg-success" : "text-base-content/50"}" 
                                                onclick={() => {estado = 'activo'; index=0; handleSearch()}}>
                                                Activo
                                            </button>
                                            <button class="{estado === "retirado" ? "bg-error" : "text-base-content/50"}" 
                                                onclick={() => {estado = 'retirado'; index=0; handleSearch()}}>
                                                Retirado 
                                            </button>
                                        </div>
                                    </div>
                                </div>
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
                                onclick="{() => {index=0;filter=""; search="";nivel="all"; estado ='all'; handleSearch()}}"
                                 aria-label="pagination-next"
                                  class="btn mx-4 gap-2 btn-sm active:bg-neutral-800 group tooltip" data-tip="Limpiar Busqueda">
                                    <img src="{clear_icon}" alt="" class="size-[1.4em] group-active:invert filter icon">
                                </button>
                            </div>
                        </div>

                        <div class="divider"></div>

                        <!-- TABLE -->
                        <div class="overflow-auto animate-y bg-base-100 rounded-md p-2" style="--delay: 150ms">
                            <table class="table mt-2 text-center flex rounded-md">
                                <thead class="bg-base-content [&_span]:font-bold rounded-md">
                                    <tr class="rounded-md">
                                        <th><span class="text-sm font-medium text-base-100">#</span></th>
                                        <th><span class="text-sm font-medium text-base-100">Cédula</span></th>
                                        <th><span class="text-sm font-medium text-base-100">Nombres</span></th>
                                        <th><span class="text-sm font-medium text-base-100">Apellidos</span></th>
                                        <th><span class="text-sm font-medium text-base-100">Sexo</span></th>
                                        <th><span class="text-sm font-medium text-base-100">Aula</span></th>
                                        <th><span class="text-sm font-medium text-base-100">Turno</span></th>
                                        <th><span class="text-sm font-medium text-base-100">Edad</span></th>
                                        <th><span class="text-sm font-medium text-base-100">Estado</span></th>
                                        <th><span class="text-sm font-medium text-base-100">Ver</span></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {#if alumnos}
                                        {#each alumnos as alumno, i(alumno)}
                                            {@const grado = filterGrado(alumno.numero, alumno.nivel, alumno.seccion)}

                                            <tr class="bg-base-200" style="--delay: {(i*100)+150}ms">
                                                <th>{(i+1)+index}</th>
                                                <th>
                                                    <span>
                                                        {alumno.nacionalidad === "Venezolano" ? "V-" : "E-"}
                                                        {alumno.cedula_escolar}
                                                    </span>
                                                </th>
                                                <th>
                                                    <div>{alumno.primer_nombre}</div>
                                                    <div class="text-base-content/40">{alumno.segundo_nombre}</div>
                                                </th>
                                                <th>
                                                    <div>{alumno.primer_apellido}</div>
                                                    <div class="text-base-content/40">{alumno.segundo_apellido}</div>
                                                </th>
                                                <th class="{ alumno.sexo === "Masculino" ? "text-blue-600" : "text-pink-600"}">{alumno.sexo}</th>
                                                <th class="{grado ? "" : "text-error"}">
                                                    {
                                                        grado ? 
                                                            `${formatNumero(alumno.numero)} ${alumno.nivel === "Inicial" ? "Nivel" : "Grado"} ${(alumno.seccion)}`
                                                        : "No Asignado"
                                                    }
                                                </th>
                                                <th class="{ alumno.turno ? alumno.turno === "Mañana" ? "text-orange-500" : "text-purple-600" : "text-error" }">
                                                    {alumno.turno ? alumno.turno : "No asignado"}
                                                </th>
                                                <th>{alumno.edad}</th>
                                                <th>
                                                    <div class="{alumno.estado === "Retirado" ? "bg-error" : "bg-success"} p-2 rounded-sm">
                                                        {alumno.estado}
                                                    </div>
                                                </th>
                                                <th>
                                                    <a class="btn btn-sm btn-square btn-accent rounded-md" href="{basePath}/alumnos/{alumno.cedula_escolar}">
                                                        <img src="{ver_icon}" alt="" class="icon filter invert">
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
        @apply flex-grow p-1 pb-8 transition-all duration-150;
    }

    .red-filter {
        filter: brightness(0) saturate(100%) invert(38%) sepia(93%) saturate(2710%) hue-rotate(339deg) brightness(102%) contrast(86%);
    }
    .grado-content button {
        @apply font-semibold rounded-md px-2 py-0.5
        hover:bg-base-300
        transition-all duration-200 ease-in-out
        active:bg-base-300 active:scale-95;
    }

    .paginator button {
        @apply hover:scale-125 hover:text-accent px-2 hover:shadow-xl transition-all duration-200 ease-in-out shadow-accent-content;
    }
</style>