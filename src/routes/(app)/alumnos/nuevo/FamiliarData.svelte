<script lang="ts">
    let { changeContent, setFormValues, sendFormValues }: { sendFormValues: () => void, setFormValues: (content: any, values: any) => void, changeContent: (newContent: any) => void } = $props()

    import icon from "$lib/images/icons/add_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
    import add_icon from "$lib/images/icons/add_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"

    type Familiar = {
        cedula: string,
        nombre: string,
        apellido: string,
        sexo: string,
    }

    let data: { key: string, value: string }[] = $state([])

    function up() {
        setData()
        setFormValues('familiar', data)
    }

    function down() {
        setFormValues('familiar', [])
    }

    let index = $state(1)
    let familiares: Record<`${number}`, Familiar> = $state({
        '1': {
            cedula: "",
            nombre: "",
            apellido: "",
            sexo: "",           
        },
    })

    function addFam() { 
        if (index >= 3) return; 
        index++;

        familiares[`${index}`] = {
            cedula: "",
            nombre: "",
            apellido: "",
            sexo: "",
        }
    }

    function subsFam() { 
        if (index=== 1) return;
        familiares[`${index}`] = undefined
        index--;
    }

    function setData() {
        for (let i in familiares) {
            let cedula = document.getElementById(`cedula_${i}`) as HTMLInputElement
            let nombre = document.getElementById(`nombre_${i}`) as HTMLInputElement
            let apellido = document.getElementById(`apellido_${i}`) as HTMLInputElement
            let sexo = document.getElementById(`sexo_${i}`) as HTMLInputElement

            let ind = i as `${number}`

            familiares[ind] = {
                cedula: cedula.value,
                nombre: nombre.value,
                apellido: apellido.value,
                sexo: sexo.value 
            }
        }

        for (let i in familiares) {
            for (let k in familiares[i]) {
                data.push({
                   key: `${k}_auth_${i}`,
                   value: familiares[i][k]
                })
            }
        }
    }
</script>

{#snippet fam_aut(i: number)}
    <div class="w-full lg:w-1/3 animate--y bb
        flex items-start justify-start flex-col relative" 
        id='item_{i}'
        style="--delay: 400ms"
        >

        <button type="button" class="tooltip btn btn-sm btn-circle btn-ghost absolute right-3 top-2
        {i === index ? '' : 'hidden'}"
        data-tip="Eliminar"
        onclick="{() => { subsFam(`item_${i}`) }}">
            ✕
        </button>

        <div class="flex items-center justify-start gap-2 size-fit">
            <img src="{icon}" alt="">
            <div>
                <h1 class="text-lg font-bold border-b-[3px] border-success/70 w-fit
                text-base-content/80">Familiar {i}</h1>
                <p class="text-base-content/70 text-sm mt-0.5">Persona/familiar autorizado para entregar/retirar al niño a la institución.</p>
            </div>
        </div> 

        <div class="pl-6 mt-2">
            <div class="form-control">
                <div class="label">
                    <b class="label-text">Cédula de Identidad</b>
                </div>
                <input type="number" class="input input-sm input-bordered bg-base-200" id="cedula_{i}">
            </div>           
            <div class="form-control">
                <div class="label">
                    <b class="label-text">Nombre</b>
                </div>
                <input type="text" class="input input-sm input-bordered bg-base-200" id="nombre_{i}">
            </div>                           
            <div class="form-control">
                <div class="label">
                    <b class="label-text">Apellido</b>
                </div>
                <input type="text" class="input input-sm input-bordered bg-base-200" id="apellido_{i}">
            </div>           
            <div class="form-control">
                <div class="label">
                    <b class="label-text">Sexo</b>
                </div>
                <select class="btn btn-sm border border-base-content/40" id="sexo_{i}">
                    <option disabled selected>Elegir</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                </select>
            </div>           
        </div>
    </div> 
{/snippet}

<div class="w-full mt-4 rounded-xl bg-base-100 p-4 h-max shadow-md animate-x
border border-base-content/30" style="--delay: 100ms">
    <div>
        <h1 class="text-2xl font-bold border-b-[3px] border-primary/70 w-fit animate-x" style="--delay: 700ms" >Datos Familiares</h1>
    </div>

    <div class="divider m-0 p-0"></div>
        
    <div class="w-full flex flex-col lg:flex-row items-start justify-start gap-4 mt-2 relative *:border *:border-base-content/20 *:p-4 *:rounded-xl">

        {#each {length: index}, i(i)}
           {@render fam_aut(i+1)} 
        {/each}

        <div class="{index === 3 ? "hidden" : ""} w-full lg:w-1/3 flex items-center justify-center min-h-[10rem] animate--y">
            <button onclick="{addFam}" type="button"
             class="p-3 rounded-md border border-base-content/30 btn tooltip tooltip-top" 
             data-tip="Añadir Familiar Autorizado">
                <img src="{add_icon}" alt="">
            </button>
        </div>
    </div>

    <div class="divider pb-0 mb-2"></div>

    <div class="w-full flex items-start justify-between">
        <button type="button" onclick={() => { down(); changeContent("escolar") }} class="btn btn-sm btn-primary">Atrás</button>
        <button type="button" onclick={() => { up(); changeContent("documentos") }} class="btn btn-sm btn-primary">Siguiente</button>
    </div>
</div>

<style lang="postcss">

</style>