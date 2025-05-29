<script lang="ts">
    import { enhance } from "$app/forms";
    import { basePath, formatStringWithDots } from "$lib";
    import Alert from "$lib/components/Messages/Alert.svelte";
    import search_icon from "$lib/images/icons/search_icon.svg"
    import clear_icon from "$lib/images/icons/clear_icon.svg"
    import chevron_left from "$lib/images/icons/chevron_left.svg"
    import chevron_right from "$lib/images/icons/chevron_right.svg"

    import type { Alumno, Grado, Numeros } from "$lib/database/types";
    import { onMount } from "svelte";
    let { form, gradoActual }: { gradoActual: Grado, form: any } = $props()

    function formatNumero(nm: Numeros) {
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

    let alumnos: Alumno[] | undefined = $state([]);

    let index = $state(0)
    let search = $state("")
    let nivel = $state("all")
    let estado = $state("all")
    let turno = $state("all")

    let url = $derived(`${basePath}/aulas/${gradoActual.id_grado}/?index=${index}&search=${search}`) 

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
        let response = await fetch(url)
        let data = await response.json()
        alumnos = data;
    }

    onMount(async () => {
        await handleSearch()
    })
</script>

<dialog id="add_alumno_modal" class="modal modal-bottom modal- sm:modal-middle">
    <div class="modal-box relative
                sm:w-full sm:max-w-lg overflow-hidden">

        <Alert form={form} styles="absolute top-4 left-3 max-w-sm" />

        <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            id="add_alumno_close" onclick={() => {
                let container = document.getElementById('input_container') as HTMLDivElement

                for (let i of container.childNodes) {
                    if (i instanceof HTMLInputElement && i.name === "alumnos") {
                        i.remove()
                    }
                }

                for (let i of container.childNodes) {
                    if (i instanceof HTMLInputElement && i.name === "alumnos") {
                        i.remove()
                    }
                }

                let checkList = document.getElementsByName('alumnos') 

                for (let i of checkList) {
                    if (i instanceof HTMLInputElement) {
                        if(i.checked) {
                            i.checked = false;
                        }
                    }
                }

                for (let i of checkList) {
                    if (i instanceof HTMLInputElement) {
                        if(i.checked) {
                            i.checked = false;
                        }
                    }
                }

                handleSearch()

            }}>✕</button>
        </form>

        <h2 class="font-bold text-xl">Agregar Alumnos al Aula</h2>

        <div class="w-full text-start text-sm">
            <span>Elija uno o varios alumnos para agregarlos como estudiantes del aula actual.</span>
        </div>

        <div class="w-full flex items-center justify-between gap-2">
            <div class="join mt-4 mb-2">
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

            <div class="join">
                <button onclick="{indexHandler.decrementIndex}" aria-label="pagination-prev"
                    class="btn join-item gap-2 btn-sm active:bg-neutral-800 group tooltip" data-tip="Anterior">
                    <img src="{chevron_left}" alt="" class="size-[1.4em] group-active:invert filter icon">
                </button>
                <button onclick="{indexHandler.incrementIndex}" aria-label="pagination-next" class="btn join-item gap-2 btn-sm active:bg-neutral-800 group tooltip" data-tip="Siguiente">
                    <img src="{chevron_right}" alt="" class="size-[1.4em] group-active:invert filter icon">
                </button>

                <button 
                onclick="{() => {index=0; search="";nivel="all"; estado ='all'; handleSearch()}}"
                    aria-label="pagination-next"
                    class="btn mx-4 gap-2 btn-sm active:bg-neutral-800 group tooltip" data-tip="Limpiar Busqueda">
                    <img src="{clear_icon}" alt="" class="size-[1.4em] group-active:invert filter icon">
                </button>
            </div>
        </div>

        <div class="modal-container">
            <h2 class="font-bold text-lg">Elegir Alumnos</h2>
            <div class="w-full mt-3 max-h-[15rem] min-h-[12rem]
                overflow-x-hidden overflow-y-auto 
                border border-base-content/40 px-4 pt-2 rounded-md" style="scrollbar-width: thin;">
                {#if alumnos && alumnos.length > 0}
                    {#each alumnos as alumno, i(alumno)}
                        <div class="w-full h-max flex items-center justify-between animate-pop-delayed" style="--delay: {i*100}ms">
                            <div class="flex h-20 items-center gap-2">
                                <b class="h-full w-8 flex items-center justify-center text-base-100 rounded-lg
                                {alumno.sexo === "Masculino" ? "bg-blue-600/80" : "bg-pink-600/80"}">
                                    {alumno.sexo[0]}
                                </b>

                                <div class="">
                                    <b>{alumno.primer_nombre} {alumno.primer_apellido}</b>
                                    <div>
                                        <span class="text-sm">Cedula: </span>
                                        <span class="text-sm font-semibold">{alumno.nacionalidad === "Venezolano" ? "V-" : "E-"}{(alumno.cedula_escolar)}</span>
                                    </div> 

                                    <div>
                                        <span class="text-xs">Edad: </span>
                                        <span class="text-base-content/60 text-xs font-semibold">{alumno.edad} Años</span>
                                    </div> 
                                </div>
                            </div>

                            <input type="checkbox" value={alumno.cedula_escolar} name="alumnos" class="checkbox">
                        </div> 
                        <div class="bg-base-content/30 h-px my-2 py-0"></div>
                    {/each}                   
                {:else}
                    <h1 class="text-xl text-base-content/90 px-2">No se han encontrado Alumnos .</h1> 
                    <h1 class="text-sm text-base-content/70 px-2 pb-4">Actualmente no existen alumnos aptos para ser agregados al aula.</h1> 
                {/if}
            </div>

            <div class="w-full mt-4 flex items-center justify-center">
                <form action="?/add" method="POST" use:enhance={() => {
                    document.getElementById('add_alumno_close')?.click();
                    handleSearch()
                }} class="h-auto w-full">
                    <div id="input_container">
                        <input type="hidden" value="{gradoActual.id_grado}" name="grado_actual">
                    </div>
                    <button class="btn px-8 btn-secondary" onclick={() => {
                        let checkList = document.getElementsByName('alumnos') 
                        let container = document.getElementById('input_container') as HTMLDivElement

                        for (let i of checkList) {
                            if (i instanceof HTMLInputElement) {
                                if(i.checked) {
                                    let alumnosInput = document.createElement('input')
                                    alumnosInput.type = "hidden"
                                    alumnosInput.name = "alumnos"
                                    alumnosInput.value = i.value
                                    container.appendChild(alumnosInput)
                                }
                            }
                            }
                    }}>Agregar Alumnos</button>
                </form>
            </div>
        </div>
    </div>
</dialog>

<style lang="postcss">
    .modal-box {
        @apply border border-base-content/80
        sm:w-10/12  overflow-hidden;
    }          
    .modal-container {
        @apply mt-1 max-h-[25rem] overflow-y-auto overflow-x-hidden;
        scrollbar-width: thin;
    }
</style>