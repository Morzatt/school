<script lang="ts">
    let { data, form }: { data: PageData, form: ActionData } = $props();

    import type { ActionData, PageData } from './$types';
    import search_icon from "$lib/images/icons/search_icon.svg"
    import filter_icon from "$lib/images/icons/filter_icon.svg"
    import clear_icon from "$lib/images/icons/clear_icon.svg"
    import chevron_left from "$lib/images/icons/chevron_left.svg"
    import ver_icon from "$lib/images/icons/details_icon.svg"
    import chevron_right from "$lib/images/icons/chevron_right.svg"
    import { basePath, formatStringWithDots } from '$lib';
    import { goto, invalidateAll } from '$app/navigation';
    import CreateRepresentanteModal from './CreateRepresentanteModal.svelte';
    import { getAge } from '$lib/utils/getAge';


    let { representantes } = $derived(data)
    let index = $state(data.index ? data.index : 0)
    let sexo = $state('all')
    let search = $state("")

    let url = $derived(`${basePath}/representantes?index=${index}&search=${search}&sexo=${sexo}`) 

    let indexHandler = {
        incrementIndex: async () => {
            if (representantes!.length <= 14) return;
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

    let paginas = $state(2)

    $effect(() => {
        if (form && form.success && form.form === "create") {
            document.getElementById('create_representante_close')?.click()
        }
    })
</script>

<CreateRepresentanteModal form={form}/>

<div class="">
    <h3 class="text-xl font-bold">Representantes</h3>

    <div class="w-full h-12 mt-4 flex items-center justify-between gap-4 px-5 animate-y" style="--delay: 100ms">
        <div class="flex items-center justify-start gap-4">
            <div class="join">
                <label class="form-control flex flex-row items-center 
                rounded-xl rounded-r-none border border-base-content/20py-1 px-3 bg-base-100">
                    <input bind:value={search} oninput="{handleSearch}" placeholder="Buscar Representante..."
                        class="input w-full focus:bg-transparent focus:border-transparent focus:outline-0 transition-all input-sm focus:outline-offset-0">
                </label>
                <button class="rounded-xl px-2 tooltip rounded-l-none border border-base-content/20 bg-base-200" data-tip="Buscar"
                onclick={() => { index=0 ;handleSearch() }}>
                    <img src="{search_icon}" alt="" class="size-[1.8em] icon">
                </button>
            </div>
        </div>

        <button class="btn btn-outline btn-sm px-5"
        onclick={() => {document.getElementById('create_representante_modal')!.showModal()!}}>
            <span>+</span>
            <span>Añadir</span>
        </button>
    </div>

    <div class="w-full h-12 mt-10 flex items-end justify-between gap-6 px-5 animate-y" style="--delay: 250ms">
        <div class="flex items-end justify-between gap-4">
            <div class="select-none bg-base-100 border border-base-content/40 rounded-md btn-square btn-sm flex items-center justify-center">
                <img src="{filter_icon}" alt="" class="icon">
            </div>
            <div class="form-control">
                <div class="label">
                    <b class="label-text">Género</b>
                </div>
                <div class="join grado-content rounded-md
                bg-base-content/10 p-1 gap-1 group">
                    <button class="{sexo === "all" ? "bg-base-100" : "text-base-content/50"}" 
                        onclick={() => {sexo = 'all'; index=0; handleSearch()}}>
                        Todo
                    </button>
                    <button class="{sexo === "masculino" ? "bg-base-100" : "text-base-content/50"}" 
                        onclick={() => {sexo = "masculino"; index=0;handleSearch();}}>
                        Masculino
                    </button>
                    <button class="{sexo === "femenino" ? "bg-base-100" : "text-base-content/50"}" 
                        onclick={() => {sexo = "femenino"; index=0;handleSearch();}}>
                        Femenino
                    </button>
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
            <button onclick="{() => {index=0; search=""; handleSearch()}}"
                aria-label="pagination-next"
                class="btn mx-4 gap-2 btn-sm active:bg-neutral-800 group tooltip" data-tip="Limpiar Busqueda">
                <img src="{clear_icon}" alt="" class="size-[1.4em] group-active:invert filter icon">
            </button>
        </div>
    </div>

    <div class="divider"></div>

    <div class="overflow-x-auto overflow-y-hidden animate-y p-2 bg-base-100 rounded-md" style="--delay: 300ms">
        <table class="table mt-2 text-center flex ">
            <thead class="bg-base-content [&_span]:font-bold">
                <tr>
                    <th><span class="text-sm font-medium text-base-100">#</span></th>
                    <th><span class="text-sm font-medium text-base-100">Cédula</span></th>
                    <th><span class="text-sm font-medium text-base-100">Nombre</span></th>
                    <th><span class="text-sm font-medium text-base-100">Apellido</span></th>
                    <th><span class="text-sm font-medium text-base-100">Sexo</span></th>
                    <th><span class="text-sm font-medium text-base-100">Edad</span></th>
                    <th><span class="text-sm font-medium text-base-100">Teléfono</span></th>
                    <th><span class="text-sm font-medium text-base-100">Ver</span></th>
                </tr>
            </thead>
            <tbody>
                {#if representantes && representantes.length > 0}
                    {#each representantes as representante, i(representante)}
                        <tr class="border-none animate-y bg-base-200" style="--delay: {(i*100)+300}ms">
                            <th>{(i+1)+index}</th>
                            <th>
                                {representante.nacionalidad === "Venezolano" ? "V-" : "E-"}
                                {formatStringWithDots(representante.cedula)}
                            </th>
                            <th>{representante.nombre}</th>
                            <th>{representante.apellido}</th>
                            <th class="{ representante.sexo === "Masculino" ? "text-blue-600" : "text-pink-600"}">{representante.sexo}</th>
                            <th>{getAge(new Date(representante.fecha_nacimiento).toLocaleDateString('sv-SE')).toLowerCase() === 'menos de un año' ? getAge(new Date(representante.fecha_nacimiento).toLocaleDateString('sv-SE')) : `${getAge(new Date(representante.fecha_nacimiento).toLocaleDateString('sv-SE'))} Años`}</th>
                            <th>{representante.telefono_1}</th>
                            <th>
                                <a class="btn btn-sm btn-square btn-accent text-base-100" href="{basePath}/representantes/{representante.cedula}">
                                    <img src="{ver_icon}" alt="" class="filter invert">
                                </a>
                            </th>
                        </tr>
                    {/each}                                       
                {/if}
            </tbody>
        </table>
    </div>
</div>

<style lang="postcss">
    .grado-content button {
        @apply font-semibold rounded-md px-2 py-0.5
        hover:bg-base-300
        transition-all duration-200 ease-in-out
        active:bg-base-300 active:scale-95;
    }
</style>
