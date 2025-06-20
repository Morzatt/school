<script lang="ts">
    import { enhance } from '$app/forms';
    import Alert from '$lib/components/Messages/Alert.svelte';
    import type { ActionData, PageData } from './$types';
    import DocumentosData from './DocumentosData.svelte';
    import EscolarData from './EscolarData.svelte';
    import FamiliarData from './FamiliarData.svelte';
    import PersonalData from './PersonalData.svelte';

    let { data, form }: { data: PageData, form: ActionData } = $props();
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
    type FormState = Record<Content, FormValues[] | string[][]>

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

    function sendFormValues() {
        let container = document.getElementById('input_container') as HTMLDivElement
        for (let el in formState)  {
            formState[el]!.forEach((i) => {
                let input = document.createElement('input')
                input.type = "hidden"
                input.name = i.key
                input.value = i.value
                container.appendChild(input)
            })
        }
    }

    function deleteData() {
        let container = document.getElementById('input_container') as HTMLDivElement
        container.innerHTML = ""
    }

    $effect(() => {
        if (form && !form.success && form.type === "Warning") {
            let container = document.getElementById('input_container') as HTMLDivElement
            content = "personal"
            container.innerHTML = ""
        }
    })
</script>

<div id="top" class="relative">
    <h1 class="text-2xl font-bold" >Registrar Alumno</h1>
    <p class="text-sm text-base-content/70">Registre los datos y documentos necesarios para ingresar al alumno al sistema y a la institución.</p>
    <Alert form={form} styles="fixed top-4 left-4 max-w-xs"/>
</div>

<div class="w-full items-start rounded-xl lg:p-2 lg:px-20">
    <div class="w-full max-w-full overflow-auto rounded-md p-2 animate--y">
        <ul class="steps w-full min-w-[50rem]">
            <li data-content="{asignStep('personal') ? "✓" : "?"}" class="step {asignStep("personal") ? "step-primary" : ""}">
                <p class="text-base-content/70 text-sm">Paso 1</p> 
                <b>Información Personal</b>
                <b class="badge {asignStep('personal') ? "badge-primary" : "badge-accent"}">
                    {asignStep('personal') ? "Completado" : "Pendiente"}
                </b>
            </li>               
            <li data-content="{asignStep('escolar') ? "✓" : "?"}" class="step {asignStep("escolar") ? "step-primary" : ""}">
                <p class="text-base-content/70 text-sm">Paso 2</p> 
                <b>Información Escolar</b>
                <b class="badge {asignStep('escolar') ? "badge-primary" : "badge-neutral"}">
                    {asignStep('escolar') ? "Completado" : "Pendiente"}
                </b>
            </li>               
            <li data-content="{asignStep('familiar') ? "✓" : "?"}" class="step {asignStep("familiar") ? "step-primary" : ""}">
                <p class="text-base-content/70 text-sm">Paso 3</p>                
                <b>Información Familiar</b>
                <b class="badge {asignStep('familiar') ? "badge-primary" : "badge-neutral"}">
                    {asignStep('familiar') ? "Completado" : "Pendiente"}
                </b>
            </li>               
            <li data-content="{asignStep('documentos') ? "✓" : "?"}" class="step {asignStep("documentos") ? "step-primary" : ""}">
                <p class="text-base-content/70 text-sm">Paso 4</p>                
                <b>Documentos</b>
                <b class="badge {asignStep('documentos') ? "badge-primary" : "badge-neutral"}">
                    {asignStep('documentos') ? "Completado" : "Pendiente"}
                </b>
            </li>   
        </ul>
    </div>

    <form action="?/createAlumno" method="POST" use:enhance class="size-full" enctype="multipart/form-data">
        <input type="hidden" name="representante" value={rep.cedula}>
        <input type="hidden" name="hasCedula" value={hasCedula}>
        <input type="hidden" name="relacion" value={relacion}>
        <div id="input_container"></div>

        {#if content === "personal"}
            <PersonalData relacion={relacion} setFormValues={setFormValues} hasCedula={hasCedula} changeContent={changeContent}/>
        {:else if content === "escolar"}
            <EscolarData setFormValues={setFormValues} hasCedula={hasCedula} changeContent={changeContent}/>
        {:else if content === "familiar"}
            <FamiliarData setFormValues={setFormValues} changeContent={changeContent} sendFormValues={sendFormValues}/>
        {:else if content === "documentos"}
            <DocumentosData setFormValues={setFormValues} changeContent={changeContent} sendFormValues={sendFormValues}/>
        {/if}
    </form>
</div>