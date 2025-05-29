<script lang="ts">
    import { enhance } from "$app/forms";
    import { basePath, formatStringWithDots } from "$lib";
    import Alert from "$lib/components/Messages/Alert.svelte";
    import ver_icon from "$lib/images/icons/details_icon.svg"
    import type { Alumno, Grado, Numeros } from "$lib/database/types";

    let { form, grados, gradoActual, alumnos }: { alumnos: Alumno[] | undefined, gradoActual: Grado, form: any, grados: Grado[] | undefined } = $props()

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

    let prom: Grado | undefined = $state()
</script>

<dialog id="promociones" class="modal modal-bottom modal- sm:modal-middle">
    <div class="modal-box relative
                sm:w-full sm:max-w-lg overflow-hidden">

        <Alert form={form} styles="absolute top-4 left-3 max-w-sm" />

        <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            id="promociones_close" onclick={() => {
                let container = document.getElementById('input_container') as HTMLDivElement

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
            }}>✕</button>
        </form>

        <h2 class="font-bold text-xl">Promover Aula</h2>

        <div class="w-full text-start text-sm">
            <span>Elija un aula para promover los alumnos de la presente aula, hacia el aula, grado, seccion y turno especificados</span>
        </div>

        <div class="modal-container">
            <h2 class="font-bold text-lg">Elegir Alumnos</h2>
            <div class="w-full mt-3 max-h-[15rem]
                overflow-x-hidden overflow-y-auto 
                border border-base-content/40 px-4 pt-2 rounded-md" style="scrollbar-width: thin;">
                {#if alumnos && alumnos.length > 0}
                    {#each alumnos as alumno, i}
                        <div class="w-full h-max flex items-center justify-between">
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
                    <h1 class="text-xl text-base-content/90 px-2">Aula vacia.</h1> 
                    <h1 class="text-sm text-base-content/70 px-2 pb-4">Actualmente no existen alumnos asociados a esta aula.</h1> 
                {/if}
            </div>

            <div class="divider"></div>

            <h2 class="font-bold text-lg mt-4">Elegir Grado</h2>
            <div class="size-full grid grid-cols-3 gap-4 mt-2">
                {#if grados && grados.length > 0}
                    {#each grados as grado}
                        <button class="bg-base-200/30 hover:bg-base-200/80 hover:shadow-lg border border-base-content/70 rounded-md shadow-md p-2
                        transition-all duration-200"
                        onclick={ () => {
                            prom = grado;
                            document.getElementById('confirmation').showModal()
                        } }>
                            <b>{formatNumero(grado.numero)} {grado.nivel === "Inicial" ? "Nivel" : "Grado"} {grado.seccion}</b>
                            <div class="{grado.turno === "Mañana" ? "text-orange-500":"text-purple-600"} font-bold">{grado.turno}</div>
                        </button> 
                    {/each} 
                {:else}
                    <div class="col-span-3 w-full">
                        <h1 class="font-bold text-xl text-base-content/60">No existen aulas a dónde promover.</h1>
                    </div>
                {/if}
            </div>
        </div>
    </div>
</dialog>

<dialog id="confirmation" class="modal modal-bottom modal- sm:modal-middle">
    <div class="modal-box relative
                sm:w-full sm:max-w-md overflow-hidden">

        <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            id="confirmation_close" onclick={() => {
                let container = document.getElementById('input_container') as HTMLDivElement

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
            }}>✕</button>
        </form>

        {#if prom} 
            <h2 class="font-bold text-xl">¿Seguro que desea Promover toda esta sección al Aula <b>{formatNumero(prom.numero)} {prom.nivel === "Inicial" ? "Nivel" : "Grado"} {prom.seccion}</b>?</h2>
            <div class="w-full text-start text-sm">
                <div>Todos los alumnos seleccionados del aula actual serán promovidos; Se desvincularán del aula actual, y serán actualizados al aula especificada.</div>
                <div class="text-xs"> <b>NOTA:</b> No se eliminará el horario, ni las materias asignadas a la siguiente Aula.</div>
            </div>

            <div class="modal-container">
                <form action="?/prom" method="POST" use:enhance={() => {
                    document.getElementById('confirmation_close')?.click()
                    document.getElementById('promociones_close')?.click();
                }} class="h-auto w-full">
                    <div id="input_container">
                        <input type="hidden" value="{gradoActual.id_grado}" name="grado_actual">
                        <input type="hidden" value="{prom.id_grado}" name="grado_prom">
                    </div>

                    <button class="btn btn-success btn-sm mt-6"
                    onclick={() => {
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
                    }}>Promover Alumnos</button>
                </form>
            </div>
        {/if}
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