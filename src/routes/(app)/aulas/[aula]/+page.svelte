<script lang="ts">
    import { basePath } from '$lib';
    import type { PageData } from './$types';
    import cedula_escolar_icon from "$lib/images/icons/personalizar_icon.svg"
    import female_icon from "$lib/images/icons/female_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
    import male_icon from "$lib/images/icons/male_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
    import birhtday_icon from "$lib/images/icons/cake_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
    import edad_icon from "$lib/images/icons/description_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
    import delete_icon from "$lib/images/icons/borrar_icon.svg"
    import user_icon from "$lib/images/icons/username_icon.svg"
    import camera_icon from "$lib/images/icons/camara_icon.svg"   
    import edit_icon from "$lib/images/icons/edit_icon.svg"
    import add_icon from "$lib/images/icons/add_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
    import ver_icon from "$lib/images/icons/details_icon.svg"
    import { enhance } from '$app/forms';
    import Horario from './Horario.svelte';
    import type { ActionData } from '../$types';
    import AddAlumnosModal from './AddAlumnosModal.svelte';

    let { data, form }: { data: PageData, form: ActionData } = $props();
    let { grado, materias, alumnos } = $derived(data)

    let { lunes, martes, miercoles, jueves, viernes } = $derived(data.horarios)

    function openModal(id: string) {
        document!.getElementById(id)!.showModal()
    }
    function closeModal(id: string) {
        document!.getElementById(id)!.click()
    }
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
                            class="h-4 w-4 stroke-current">
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
                            class="h-4 w-4 stroke-current">
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
            <form use:enhance action="" method="POST" class="rounded-md p-4 bg-base-100">
                <div class="w-full h-max flex justify-between items-center ">
                    <h3 class="text-xl font-bold">Detalles del Aula</h3>

                    <button class="btn btn-circle btn-active btn-sm p-1 active:btn-primary group"
                        onclick="{() =>{ setTimeout(() => {},100) }}">
                        <img src="{edit_icon}" alt="" class="group-active:invert filter icon">
                    </button>
                </div>

                <div class="mt-2 bb">

                </div>
            </form>

            <div class="rounded-md p-4 bg-base-100 h-32">

            </div>
        </div>

        <!-- RIGHT / ALUMNOS -->
        <div class="rounded-md p-4 bg-base-100 min-h-[30rem]">
            <div class="w-full flex items-center justify-between">
                <h3 class="text-xl font-bold">Lista de Alumnos</h3>

                <button class="btn btn-circle btn-xs" onclick={() => {openModal('add_alumno_modal')}}>
                    <img src="{add_icon}" alt="" class="icon">
                </button>
                <AddAlumnosModal form={null}/>
            </div>

            <div class="w-full mt-3 max-h-[25rem]
                         overflow-x-hidden overflow-y-auto 
                         border border-base-content/40 p-3 rounded-md" style="scrollbar-width: thin;">
                {#if alumnos && alumnos.length > 0}
                    {#each alumnos as alumno, i}
                        <div class="w-full flex items-center justify-between">
                            <div class="flex items-center">
                                <b class="mr-3">{i+1}</b>
                                <div class="border-l border-base-content/40 pl-3">
                                    <p>{alumno.primer_nombre} {alumno.primer_apellido}</p>
                                    <span>
                                        <span class="text-sm">Cedula: </span>
                                        <span class="text-base-content/60 text-xs font-semibold">{alumno.cedula_escolar}</span>
                                    </span> 
                                </div>
                            </div>

                            <a href="{basePath}/alumnos/{alumno.cedula_escolar}" class="btn btn-xs btn-square p-0 m-0 flex items-center justify-center">
                                <img src="{ver_icon}" alt="" class="icon">
                            </a>
                        </div> 
                        <div class="bg-base-content/30 h-px my-1 py-0"></div>
                    {/each}                   
                {/if}
            </div>
        </div>
    </div>

    <!-- HORARIO -->
    <div class="w-full mt-4 bg-base-100 rounded-md p-4 h-max">
        <h3 class="text-xl font-bold">Horario</h3>
        <div class="mt-2 w-full">
            <Horario form={form} lunes={lunes} martes={martes} miercoles={miercoles} jueves={jueves} viernes={viernes}
            grado={grado?.id_grado} materias={materias}/>
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

<style>

</style>