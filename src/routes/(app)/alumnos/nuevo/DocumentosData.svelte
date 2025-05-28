<script lang="ts">
    let { changeContent, setFormValues, sendFormValues }: { sendFormValues: () => void, setFormValues: (content: any, values: any) => void, changeContent: (newContent: any) => void } = $props()

    import icon from "$lib/images/icons/add_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
    import task_icon from "$lib/images/icons/task_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
    import add_photo_icon from "$lib/images/icons/add_photo_alternate_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
    import delete_icon from "$lib/images/icons/borrar_icon.svg"

    function up() {

    }

    function down() {

    }

    // PARTIDA DE NACIMIENTO, COPIA DE C.I, FOTO TIPO CARNET, COPIA DE CERTIFICADO DE VACUNA, C.I DEL REPRESENTANTE 

    function showFilePreview(name: string) {
        let input = document.getElementById(`${name}_input`) as HTMLInputElement 
        let preview = document.getElementById(`${name}_preview`) as HTMLDivElement
        let file_title = document.getElementById(`${name}_file_title`) as HTMLHeadingElement
        let file_size = document.getElementById(`${name}_file_size`) as HTMLParagraphElement

        if (!input.files || input.files.length < 1) {
            return
        }

        let file = input.files[0]

        file_title.innerText = file.name;
        file_size.innerText = `${file.size/1000}Kb`;
        preview.classList.add('flex')
        preview.classList.remove('hidden')
    }
</script>

{#snippet documentInput(title: string, name: string, key: string)}
    <div class="flex flex-col flex-wrap items-start justify-start">
        <div class="flex items-center justify-start gap-2">
            <img src="{icon}" alt="">
            <h1 class="text-lg font-bold border-b-[3px] border-secondary/70 w-fit
            text-base-content/80" >{title}</h1>
        </div> 

        <div class="ml-3 mt-3 w-full">
            <label class="input-file">

                <div class="flex flex-col justify-center items-center">
                    <img src="{add_photo_icon}" alt="" class="size-14">
                    <h2 class="text-base-content/70 text-sm text-center"><b>Suba o Arrastre el archivo</b></h2>
                </div>

                <input accept="image/*" type="file" class="hidden" name={name} id="{name}_input" oninput="{() => { showFilePreview(name) }}">
            </label>

            <div class="w-full hidden bg-primary/30 h-14 mt-2 rounded-md px-2 items-center justify-between
            animate-pop"
            id="{name}_preview">
                <div class="flex items-center justify-between gap-2 overflow-hidden truncate w-[95%]">
                    <div class="size-12 rounded-full bg-primary flex items-center p-1.5 justify-center">
                        <img src="{task_icon}" alt="" class="filter invert size-full">
                    </div>

                    <div class="flex flex-col w-[75%]">
                        <h2 class="font-bold truncate" id="{name}_file_title">Nombre Archivo Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error quod autem optio! Quas assumenda quibusdam exercitationem odit repellendus necessitatibus libero voluptate eius ea esse placeat ad doloribus maiores, iste culpa.</h2>
                        <p class="text-sm" id="{name}_file_size">0.00kb</p>
                    </div>
                </div>

                <!-- <button class="bg-error p-1 rounded-md active:scale-90 ease-in-out transition-all duration-200"
                onclick={() => {
                    let input = document.getElementById(`${name}_input`) as HTMLInputElement
                    if (!input.files || input.files.length < 1) {
                        return
                    }
                }}>
                    <img src="{delete_icon}" alt="" class="filter invert">
                </button> -->
            </div>
        </div>
    </div>
{/snippet}


<div class="w-full mt-4 rounded-xl bg-base-100 p-4 h-max shadow-md animate-x
border border-base-content/30" style="--delay: 100ms">
    <div>
        <h1 class="text-2xl font-bold border-b-[3px] border-primary/70 w-fit animate-x" style="--delay: 700ms" >Documentos <b>*</b></h1>
        <p class="text-base-content/70 text-sm mt-0.5">En caso de no poseer alguno de los documentos al momento, registrar .</p>
    </div>

    <div class="divider m-0 p-0"></div>

    <div class="w-full flex flex-col items-start justify-start gap-4 mt-2 relative *:border *:border-base-content/20 *:p-4 *:rounded-xl">
        <div class="w-full grid grid-cols-1 lg:grid-cols-3 gap-4 animate--y " style="--delay: 400ms">
            {@render documentInput('Partida de Nacimiento', 'partida_nacimiento', 'k_pn')}
            {@render documentInput('Foto tipo Carnet', 'foto_carnet', 'k_fc')}
            {@render documentInput('Cédula del Estudiante', 'cedula_estudiante', 'k_ce')}
            {@render documentInput('Cédula del Representante', 'cedula_representante', 'k_cr')}
            {@render documentInput('Cédula del Representante', 'certificado_vacuna', 'k_cv')}
        </div> 
    </div>

    <div class="divider pb-0 mb-2"></div>

    <div class="w-full flex items-start justify-between">
        <button type="button" onclick={() => { changeContent("familiar") }} class="btn btn-sm btn-primary">Atrás</button>
        <button type="submit" onclick={() => { up(); sendFormValues() }} class="btn btn-sm btn-success">Enviar</button>
    </div>
</div>

<style lang="postcss">
    .input-file {
        @apply w-full p-4
        flex flex-col items-center justify-center
        rounded-lg border border-base-content/70 border-dashed
        hover:cursor-pointer hover:bg-base-300 hover:shadow-md
        transition-all duration-200;
    }
</style>