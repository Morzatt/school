<script lang="ts">
    import { goto, invalidateAll } from '$app/navigation';
    import { basePath } from '$lib';
    import type { ActionData, PageData } from './$types';

    let { data, form }: { data: PageData, form: ActionData } = $props();

    let type = $state('all')
    let turno = $state("all")

    let url = $derived(`${basePath}/materias?type=${type}&turno=${turno}`) 
    async function handleSearch() {
        // await invalidateAll()
        goto(url)
    }

    let materias = $state()
</script>

<div class="">
    <h1 class="font-bold text-2xl">Materias</h1>

    <div class="w-full h-12 mt-8 flex items-end justify-between">
        <div class="flex items-end justify-start gap-6">
            <div class="form-control">
                <div class="label">
                    <b class="label-text">Nivel</b>
                </div>
                <div class="join grado-content rounded-md
                bg-base-content/10 p-1 gap-1 group">
                    <button class="{type === "all" ? "bg-base-100" : "text-base-content/50"}" 
                        onclick={async () => {type = "all"; await handleSearch();}}>
                        Todo
                    </button>
                    <button class="{type === "inicial" ? "bg-base-100" : "text-base-content/50"}" 
                        onclick={async () => {type = "inicial"; await handleSearch();}}>
                        Inicial
                    </button>
                    <button class="{type === "primaria" ? "bg-base-100" : "text-base-content/50"}" 
                        onclick={async () => {type = "primaria"; await handleSearch();}}>
                        Primaria
                    </button>
                </div>
            </div>
            
            <div class="form-control">
                <div class="label">
                    <b class="label-text">Turno</b>
                </div>
                <div class="join grado-content rounded-md
                bg-base-content/10 p-1 gap-1 group">
                    <button class="{turno === "all" ? "bg-base-100" : "text-base-content/50"}" 
                        onclick={async () => {turno = "all"; await handleSearch();}}>
                        Todo
                    </button>
                    <button class="{turno === "mañana" ? "bg-base-100" : "text-base-content/50"}" 
                        onclick={async () => {turno = "mañana"; await handleSearch();}}>
                        Mañana
                    </button>
                    <button class="{turno === "tarde" ? "bg-base-100" : "text-base-content/50"}" 
                        onclick={async () => {turno = "tarde"; await handleSearch();}}>
                        Tarde
                    </button>
                </div>
            </div>

            <button class="btn btn-sm btn-accent"
            onclick="{() => {document.getElementById('create_aula_modal')!.showModal()}}">
                <span>+</span>
                <span>Añadir</span>
            </button>
        </div>
    </div>

    <div class="divider"></div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full gap-3">

    </div>
</div>


<style lang="postcss">
    .grado-content button, a {
        @apply font-semibold rounded-md px-2 py-0.5
        hover:bg-base-300
        transition-all duration-200 ease-in-out
        active:bg-base-300 active:scale-95;
    }
</style>
