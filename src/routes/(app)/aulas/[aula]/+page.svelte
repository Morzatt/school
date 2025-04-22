<script lang="ts">
    import { basePath, formatStringWithDots } from '$lib';
    import type { PageData } from './$types';
    import cedula_escolar_icon from "$lib/images/icons/personalizar_icon.svg"
    import delete_icon from "$lib/images/icons/borrar_icon.svg"
    import curso_actual from "$lib/images/icons/curso_actual.svg"
    import turnos from "$lib/images/icons/turnos_icon.svg"
    import print from "$lib/images/icons/print.svg"
    import seccion from "$lib/images/icons/seccion.svg"
    import inscripcion_icon from "$lib/images/icons/face_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
    import edit_icon from "$lib/images/icons/edit_icon.svg"
    import add_icon from "$lib/images/icons/add_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
    import ver_icon from "$lib/images/icons/details_icon.svg"
    import { enhance } from '$app/forms';
    import Horario from './Horario.svelte';
    import type { ActionData } from '../$types';
    import AddAlumnosModal from './AddAlumnosModal.svelte';
    import { downloadFile } from '$lib/utils/downloadFile';

    let { data, form }: { data: PageData, form: ActionData & { horarioId: string } } = $props();
    let { grado, materias, alumnos, profesor, bloques, materiasAula, clasesSemanales } = $derived(data)

    let { lunes, martes, miercoles, jueves, viernes } = $derived(data.horarios)

    function openModal(id: string) {
        document!.getElementById(id)!.showModal()
    }

    function closeModal(id: string) {
        document!.getElementById(id)!.click()
    }

    let personalData = $derived([
        {
            name: "profesor",
            updateable: true,
            icon: cedula_escolar_icon,
            title: "Docente de Aula",
            value: `<div class="text-end flex items-center justify-end gap-4">
                        <div>
                            <b>${profesor?.primer_nombre ? profesor.primer_nombre : "No"} ${profesor?.primer_apellido ? profesor.primer_apellido : "Asignado"}</b>
                            ${grado.profesor ? `<p class="text-base-content/60 text-sm">V-${formatStringWithDots(profesor?.cedula)}</p>` : ""}
                        </div>
                        ${grado.profesor ? 
                            `<a href="${basePath}/empleados/${profesor?.cedula}" class="btn btn-xs btn-square">
                                <img src="${ver_icon}" alt="" class="icon">
                            </a>` : ""
                        }
                    </div>`,
            nameValue: profesor?.cedula
        },
        {
            name: "alumnos",
            updateable: false,
            icon: inscripcion_icon,
            title: "Total de Alumnos",
            value: `${alumnos?.length} Alumnos`
        },
        {
            name: "materias",
            updateable: false,
            icon: seccion,
            title: "Total de Materias",
            value: `${materiasAula?.length} Materias`
        },
        {
            name: "clases",
            updateable: false,
            icon: curso_actual,
            title: "Total de Clases Semanales",
            value: `${clasesSemanales?.length} Clases`
        },
        {
            name: "turno",
            updateable: false,
            icon: turnos,
            title: "Turno",
            value: grado.turno
        }
    ])
    let edicion = $state(false)

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
    $effect(() => {
        if (form?.success && form?.form === "printHorario") {
            setTimeout(() => {
                downloadFile(`/downloads/${form.horarioId}?type=horario`, `horario_${form.horarioId}.pdf`)
            }, 1000)
        }

        if (form?.success && form?.form === "printAlumnos") {
            setTimeout(() => {
                downloadFile(`/downloads/${form.listaId}?type=lista`,`lista_${form.listaId}.pdf`)
            }, 1000)
        }
    })
</script>

<main class="w-full h-full relative">
    <div class="w-full h-max max-h-20 flex items-center justify-between">
        <div>
            <h2 class="text-xl font-bold">Administrar Aula</h2>
            <div class="breadcrumbs text-sm">
                <ul>
                    <li>
                        <a href="{basePath}/aulas">
                            <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            class="h-4 w-4 stroke-current icon">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
                            </svg>
                            Aulas
                        </a>
                    </li>
                    <li>
                        <span class="inline-flex items-center gap-2">
                            <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            class="h-4 w-4 stroke-current icon">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            Aula
                        </span>
                    </li>
                </ul>
            </div>
        </div>

        <button class="btn btn-sm btn-error *:filter *:invert font-bold" onclick="{() => {openModal("delete_confirmation")}}">
            <img src="{delete_icon}" alt="" class="icon">
            <span>Eliminar Aula</span>
        </button>
    </div>

    <div class="w-full mt-4 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
        <!-- LEFT -->
        <div class="grid grid-cols-1 gap-2">
            <form use:enhance action="?/editAula" method="POST" class="rounded-md p-4 bg-base-100 animate--y">
                <div class="w-full h-max flex justify-between items-center ">
                    <div>
                        <h3 class="text-xl font-bold">Detalles del Aula</h3>
                        <h2 class="text-lg font-semibold">
                            {formatNumero(grado.numero)} 
                            {grado.nivel == "Inicial" ? "Nivel" : grado.nivel === "Primaria" ? "Grado" : "Año"} 
                            "{grado.seccion}"
                        </h2>
                    </div>

                    <button class="btn btn-circle btn-active btn-sm p-1 active:btn-primary group" type="{edicion ? 'submit' : "button"}"
                        onclick="{() =>{ setTimeout(() => {edicion = !edicion},100) }}">
                        <img src="{edit_icon}" alt="" class="group-active:invert filter icon">
                    </button>
                </div>

                <div class="mt-2">
                    <input type="hidden" name="id_grado" value={grado.id_grado}>
                    {#each personalData as field}
                        <div class="w-full flex items-center justify-between px-4 py-2 text-[0.95rem]">
                            <div class="flex items-center justify-between gap-2">
                                <img src="{field.icon}" alt="" class="icon">
                                <p class="font-semibold text-base-content/80 ">{field.title}</p> 
                            </div>

                            {#if edicion && field.updateable}
                                <input type="text" 
                                    min="3"
                                    name="{field.name}"
                                    placeholder="{field.title}..."
                                    class="input input-bordered input-sm max-w-xs"
                                    value="{field.name === "profesor" ? field.nameValue : field.value}">
                            {:else}
                                {#if field.name === "profesor"}
                                    {@html field.value} 
                                {:else}
                                    <b class="{field.name === "turno" ? field.value === "Mañana" ? "text-orange-500" : "text-purple-600" : ""}">{field.value}</b> 
                                {/if}
                            {/if}
                        </div>
                    {/each}
                </div>
            </form>

            <div class="rounded-md p-4 bg-base-100 h-32 animate--y" style="--delay:200ms">

            </div>
        </div>

        <!-- RIGHT / ALUMNOS -->
        <div class="rounded-md p-4 bg-base-100 min-h-[30rem] animate-x" style="--delay:100ms">
            <div class="w-full flex items-start justify-between">
                <h3 class="text-xl font-bold">Lista de Alumnos</h3>

                <div class="flex flex-col items-end justify-start gap-4">
                    <button class="btn btn-circle btn-sm" onclick={() => {openModal('add_alumno_modal')}}>
                        <img src="{add_icon}" alt="" class="icon">
                    </button>
                    <form method="post" use:enhance action="?/printAlumnos">
                        <input type="hidden" name="id_grado" value={grado.id_grado}>
                        <button class="btn btn-sm btn-primary flex gap-2">
                            <img src="{print}" alt="" class="icon filter invert">
                            <span>Imprimir</span>
                        </button>           
                    </form>
                </div>

                <AddAlumnosModal form={null}/>
            </div>

            <div class="w-full mt-3 max-h-[25rem]
                         overflow-x-hidden overflow-y-auto 
                         border border-base-content/40 px-3 pt-2 rounded-md" style="scrollbar-width: thin;">
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
                                        <span class="text-sm font-semibold">{alumno.nacionalidad === "Venezolano" ? "V-" : "E-"}{formatStringWithDots(alumno.cedula_escolar)}</span>
                                    </div> 

                                    <div>
                                        <span class="text-xs">Edad: </span>
                                        <span class="text-base-content/60 text-xs font-semibold">{alumno.edad} Años</span>
                                        <!-- <span class="text-xs font-semibold {alumno.sexo === "Masculino" ? "text-blue-600" : "text-pink-600"}">
                                            {alumno.sexo}
                                        </span> -->
                                    </div> 
                                </div>
                            </div>

                            <a href="{basePath}/alumnos/{alumno.cedula_escolar}" class="btn btn-xs btn-square p-0 m-0 flex items-center justify-center">
                                <img src="{ver_icon}" alt="" class="icon">
                            </a>
                        </div> 
                        <div class="bg-base-content/30 h-px my-2 py-0"></div>
                    {/each}                   
                {:else}
                   <h1 class="text-xl text-base-content/90 px-2">Aula vacia.</h1> 
                   <h1 class="text-sm text-base-content/70 px-2 pb-4">Actualmente no existen alumnos asociados a esta aula.</h1> 
                {/if}
            </div>
        </div>
    </div>

    <!-- HORARIO -->
    <div class="w-full mt-4 bg-base-100 rounded-md p-4 h-max animate-y" style="--delay:300ms">
        <div class="flex items-center justify-between">
            <h3 class="text-xl font-bold">Horario</h3>

            <form method="post" use:enhance action="?/printHorario">
                <input type="hidden" name="id_grado" value={grado.id_grado}>
                <button class="btn btn-sm btn-primary">
                    <img src="{print}" alt="" class="icon filter invert">
                    <span>Imprimir Horario</span>
                </button>           
            </form>
        </div>

        <div class="mt-2 w-full">
            <Horario form={form} lunes={lunes} martes={martes} miercoles={miercoles} jueves={jueves} viernes={viernes}
            grado={grado?.id_grado} materias={materias} bloques={bloques}/>
        </div>
    </div>
</main>

<dialog id="delete_confirmation" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box relative
                sm:w-10/12 sm:max-w-md overflow-hidden">
        <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            id="delete_confirmation_close">✕</button>
        </form>
        <h3 class="text-lg mt-2 font-bold">¿Seguro que desea eliminar esta Aula?</h3>
        <p class="text-wrap text-sm">Los datos eliminados son irrecuperables, asegurese de realizar una copia de seguridad antes de realizar cambios.</p>

        <div class="modal-container">
            <form action="?/delete" method="POST" use:enhance class="h-auto w-full ">
                <input type="hidden" value="{grado!.id_grado}" name="grado">
                <button class="btn btn-error btn-sm mt-6">Eliminar</button>
            </form>
        </div>
    </div>
</dialog>

<style lang="postcss">

</style>