<script lang="ts">
    import { enhance } from '$app/forms';
    import { goto } from '$app/navigation';
    import type { PageData } from './$types';
    import DocumentosData from './DocumentosData.svelte';
    import EscolarData from './EscolarData.svelte';
    import FamiliarData from './FamiliarData.svelte';
    import PersonalData from './PersonalData.svelte';

    let { data }: { data: PageData } = $props();
    let { rep, hasCedula, relacion } = $derived(data)

    type Content = "personal" | "escolar" | "familiar" | "documentos" | "preview"
    let content: Content = $state('personal')

    function changeContent(newContent: Content) {
        content = newContent;
    }

    function asignStep(step: Content) {
        switch (true) {
            case step === "personal":
                return true
            case content !== "personal" && step === "escolar":
                return true
            case content !== "escolar" && content !== "personal" && step === "familiar":
                return true
            case content !== "escolar" && content !== "personal" && content  !== "familiar" && step === "documentos":
                return true
            case content !== "escolar" && content !== "personal" && content  !== "familiar" && content !== "documentos" && step === "preview":
                return true
            default: 
                return false
        }
    }

    type FormValues = { key: string, value: string }
    type FormState = Record<Content, FormValues[]>

    let formState: FormState = $state({
        personal:   [],
        escolar:    [],
        familiar:   [],
        documentos: [],
        preview:    [],
    })

    function setFormValues(content: Content, formData: FormValues[]) {
       formState[content] = formData
    }

    $inspect(formState)
</script>

<div id="top">
    <h1 class="text-2xl font-bold" >Registrar Alumno</h1>
    <p class="text-sm text-base-content/70">Registre los datos y documentos necesarios para ingresar al alumno al sistema y a la institución.</p>
</div>

<div class="w-full items-start rounded-xl lg:p-2 lg:px-20">
    <div class="w-full  rounded-md p-2 animate--y">
        <ul class="steps w-full">
            <li data-content="{asignStep('personal') ? "✓" : "?"}" class="step {asignStep("personal") ? "step-primary" : ""}">Información Personal</li>               
            <li data-content="{asignStep('escolar') ? "✓" : "?"}" class="step {asignStep("escolar") ? "step-primary" : ""}">Información Escolar</li>               
            <li data-content="{asignStep('familiar') ? "✓" : "?"}" class="step {asignStep("familiar") ? "step-primary" : ""}">Información Familiar</li>               
            <li data-content="{asignStep('documentos') ? "✓" : "?"}" class="step {asignStep("documentos") ? "step-primary" : ""}">Documentos</li>               
            <li data-content="{asignStep('preview') ? "✓" : "?"}" class="step {asignStep("preview") ? "step-primary" : ""}">Preview</li>               
        </ul>
    </div>

    <form action="?/createAlumno" method="POST" use:enhance class="size-full">
        {#if content === "personal"}
            <PersonalData setFormValues={setFormValues} hasCedula={hasCedula} changeContent={changeContent}/>
        {:else if content === "escolar"}
            <EscolarData setFormValues={setFormValues} hasCedula={hasCedula} changeContent={changeContent}/>
        {:else if content === "familiar"}
            <FamiliarData setFormValues={setFormValues} changeContent={changeContent}/>
        {:else if content === "documentos"}
            <DocumentosData setFormValues={setFormValues} changeContent={changeContent}/>
        {/if}
    </form>
</div>