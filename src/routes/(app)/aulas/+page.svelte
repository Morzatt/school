<script lang="ts">
    import { basePath } from '$lib';
    import type { ActionData, PageData } from './$types';
    import AulaCard from './AulaCard.svelte';
    import CreateAulaModal from './CreateAulaModal.svelte';

    let { data, form }: { data: PageData, form: ActionData } = $props();
    let { grados } = $derived(data)

    let gradoContent: 'all' | 'inicial' | 'primaria' = $state('all')
</script>

<div class="">
    <h1 class="font-bold text-2xl">Aulas</h1>

    <div class="w-full h-12 mt-4 flex items-center justify-start gap-6">
        <div class="join grado-content rounded-md
        bg-base-content/10 p-1 gap-1 group">
            <a href="{basePath}/aulas?type=all" class="{gradoContent === "all" ? "bg-base-100" : "text-base-content/50"}" 
                onclick={() => {gradoContent = "all";}}>
                Todo
            </a>
            <a href="{basePath}/aulas?type=inicial" class="{gradoContent === "inicial" ? "bg-base-100" : "text-base-content/50"}" 
                onclick={() => {gradoContent = "inicial";}}>
                Inicial
            </a>
            <a href="{basePath}/aulas?type=primaria" class="{gradoContent === "primaria" ? "bg-base-100" : "text-base-content/50"}" 
                onclick={() => {gradoContent = "primaria";}}>
                Primaria
            </a>
        </div>

        <button class="btn btn-outline btn-sm"
        onclick="{() => {document.getElementById('create_aula_modal')!.showModal()}}">
            <span>+</span>
            <span>Añadir</span>
        </button>
    </div>

    <div class="divider"></div>

    <div class="grid grid-cols-3 w-full gap-3">
        {#if grados}
            {#each grados as grado}
                <AulaCard grado={ grado }/>
            {/each}           
        {/if}
    </div>
</div>

<CreateAulaModal form={form} />

<style lang="postcss">
    .grado-content button, a {
        @apply font-semibold rounded-md px-2 py-0.5
        hover:bg-base-300
        transition-all duration-200 ease-in-out
        active:bg-base-300 active:scale-95;
    }
</style>