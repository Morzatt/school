<script lang="ts">
    import { basePath, formatStringWithDots } from '$lib';
    import type { PageData } from './$types';
    import delete_icon from "$lib/images/icons/borrar_icon.svg"
    import user_icon from "$lib/images/icons/username_icon.svg"
    import camera_icon from "$lib/images/icons/camara_icon.svg"   
    import edit_icon from "$lib/images/icons/edit_icon.svg"
    import add_icon from "$lib/images/icons/add_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
    import ver_icon from "$lib/images/icons/details_icon.svg"
    import { enhance } from '$app/forms';


    let { data }: { data: PageData } = $props();

    let { alumno, representantes, telefonos } = $derived(data)

    type PersonalData = {
        name: string,
        icon: string,
        title: string,
        value: string,
    }

    import cedula_escolar_icon from "$lib/images/icons/personalizar_icon.svg"
    import female_icon from "$lib/images/icons/female_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
    import male_icon from "$lib/images/icons/male_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
    import birhtday_icon from "$lib/images/icons/cake_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
    import edad_icon from "$lib/images/icons/description_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
    import RepresentanteModal from './RepresentanteModal.svelte';

    let personalData: PersonalData[] = $derived([
        {
            name: "cedula_escolar",
            icon: cedula_escolar_icon,
            title: "Cédula Escolar",
            value: `${formatStringWithDots(alumno.cedula_escolar)}`
        },
        {
            name: "sexo",
            icon: alumno.sexo === "Masculino" ? male_icon : female_icon,
            title: "Género",
            value: `${alumno.sexo}`
        },
        {
            name: "fecha_nacimiento",
            icon: birhtday_icon,
            title: "Fecha de Nacimiento",
            value: new Date(alumno.fecha_nacimiento).toLocaleDateString()
        },
        {
            name: "edad",
            icon: edad_icon,
            title: "Edad",
            value: `${alumno.edad}`
        }
    ])

    let edicion = $state(false)

    function openModal(id: string) {
        document.getElementById(id).showModal()
    }
</script>

<main class="w-full h-full">
    <div class="w-full h-max max-h-20 flex items-center justify-between">
        <div>
            <h2 class="text-xl font-bold">Datos del Alumno</h2>
            <div class="breadcrumbs text-sm">
                <ul>
                    <li>
                        <a href="{basePath}/alumnos">
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
                            Alumnos
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
                            Alumno
                        </span>
                    </li>
                </ul>
            </div>
        </div>

        <button class="btn btn-sm btn-error *:filter *:invert font-bold" onclick="{() => {openModal("delete_confirmation")}}">
            <img src="{delete_icon}" alt="" class="icon">
            <span>Eliminar Alumno</span>
        </button>
    </div>

    <div class="w-full mt-4 flex items-start justify-start gap-4">
        <div class="w-max min-h-60 flex flex-col items-center justify-center">
            <div class="w-max p-5 flex items-center justify-center flex-col rounded-md bg-base-200 shadow-lg">
                <div class="size-fit relative">
                    <img src="{user_icon}" alt="" class="size-36 icon">
                    <button type="button" class="absolute bottom-1 right-1 size-7 flex items-center justify-center p-0.5
                    hover:bg-base-content/20 active:bg-base-content/10 rounded-md transition-all duration-200">
                        <img src="{camera_icon}" alt="" class="size-full icon">
                    </button>
                </div>
                <h3 class="font-bold text-lg mt-2">{alumno.primer_nombre} {alumno.segundo_nombre} {alumno.primer_apellido} {alumno.segundo_apellido}</h3>
                <h3 class="text-base-content/60 text-sm">Alumno de Primaria</h3>
                <div class="w-full h-max shadow-md mt-4 rounded-md bg-base-100 flex items-center justify-between gap-3 px-4 py-2">
                    {#each [1,2,3,4] as i}
                        <button class="btn btn-circle btn-sm btn-neutral p-1 flex items-center justify-center hover:btn-info">
                            <img src="{camera_icon}" alt="" class="filter invert icon">
                        </button> 
                    {/each}
                </div>
            </div>
        </div>

        <div class="w-3/5 min-h-60 rounded-md p-4 bg-base-100">
            <div class="w-full h-max flex justify-between items-center ">
                <h3 class="text-xl font-bold">Detalles del Alumno</h3>

                <button class="btn btn-circle btn-active btn-sm p-1 active:btn-primary group" onclick="{() =>{edicion = !edicion;}}">
                    <img src="{edit_icon}" alt="" class="group-active:invert filter icon">
                </button>
            </div>

            <div class="mt-2">
                {#each personalData as field}
                    <div class="w-full flex items-center justify-between px-4 py-2 text-[0.95rem]">
                        <div class="flex items-center justify-between gap-2">
                            <img src="{field.icon}" alt="" class="icon">
                            <p class="font-semibold text-base-content/80">{field.title}</p> 
                        </div>

                        {#if edicion}
                            <input type="text" 
                                name="{field.name}"
                                placeholder="{field.title}..."
                                class="input input-bordered input-sm max-w-xs"
                                value="{field.value}">
                        {:else}
                            <b>{field.value}</b> 
                        {/if}
                    </div>
                {/each}
            </div>
        </div>

        <div class="flex-1 min-h-72 rounded-md p-4 bg-base-100">

        </div>
    </div>

    <div class="w-full mt-4 flex items-center justify-start gap-4">
        <div class="w-2/4 min-h-60 order-base-content/30 rounded-md p-4 bg-base-100">
            <div class="w-full h-max flex justify-between items-center ">
                <h3 class="text-xl font-bold">Representantes</h3>

                <button class="btn btn-circle btn-active btn-sm p-1 active:btn-primary group">
                    <img src="{add_icon}" alt="" class="group-active:invert filter icon">
                </button>
            </div>

            <div class="mt-3 w-full">
                <div class="p-1 border-base-content/40 mb-1 font-bold bg-base-content text-base-100
                            w-full grid text-sm grid-cols-[2fr_3fr_3fr_2fr_1fr]">
                    <p>Cedula</p>
                    <p>Nombre</p>
                    <p>Teléfono</p>
                    <p>Relación</p>
                    <p>Ver</p>
                </div>
                {#if representantes && representantes.length > 0}
                    {#each representantes as representante}
                        <div class="p-1 w-full grid text-sm grid-cols-[2fr_3fr_3fr_2fr_1fr]">
                            <p>{formatStringWithDots(representante.cedula)}</p>
                            <p>{representante.nombre} {representante.apellido}</p>
                            <p>{representante.telefono}</p>
                            <p>{representante.relacion}</p>
                            <button class="btn btn-xs btn-square" onclick={()=>{openModal(`representante_${representante.cedula}_modal`)}}>
                                <img src="{ver_icon}" alt="" class="icon">
                            </button>
                        </div>
                    
                        <RepresentanteModal representante={ representante } lista_telefonos={telefonos}/>
                    {/each}
                {/if}
            </div>
        </div>

        <div class="w-2/4 min-h-60 order-base-content/30 rounded-md p-4 bg-base-100">
            <div class="w-full h-max flex justify-between items-center ">
                <h3 class="text-xl font-bold">Detalles del Alumno</h3>

                <button class="btn btn-circle btn-active btn-sm p-1 active:btn-primary group" onclick="{() =>{edicion = !edicion;}}">
                    <img src="{edit_icon}" alt="" class="group-active:invert filter icon">
                </button>
            </div>

            <div class="mt-2">
                {#each personalData as field}
                    <div class="w-full flex items-center justify-between px-4 py-2 text-[0.95rem]">
                        <div class="flex items-center justify-between gap-2">
                            <img src="{field.icon}" alt="" class="icon">
                            <p class="font-semibold text-base-content/80">{field.title}</p> 
                        </div>

                        {#if edicion}
                            <input type="text" 
                                placeholder="{field.title}..."
                                class="input input-bordered input-sm max-w-xs"
                                value="{field.value}">
                        {:else}
                            <b>{field.value}</b> 
                        {/if}
                    </div>
                {/each}
            </div>
        </div>  
    </div>

    <div class="w-full mt-4 flex items-center justify-start gap-4">
        <div class="w-full min-h-60 order-base-content/30 rounded-md p-4 bg-base-100">
            <div class="w-full h-max flex justify-between items-center ">
                <h3 class="text-xl font-bold">Grados Cursados</h3>

                <button class="btn btn-circle btn-active btn-sm p-1 active:btn-primary group" onclick="{() =>{edicion = !edicion;}}">
                    <img src="{edit_icon}" alt="" class="group-active:invert filter icon">
                </button>
            </div>

            <div class="mt-2">
                {#each personalData as field}
                    <div class="w-full flex items-center justify-between px-4 py-2 text-[0.95rem]">
                        <div class="flex items-center justify-between gap-2">
                            <img src="{field.icon}" alt="" class="icon">
                            <p class="font-semibold text-base-content/80">{field.title}</p> 
                        </div>

                        {#if edicion}
                            <input type="text" 
                                placeholder="{field.title}..."
                                class="input input-bordered input-sm max-w-xs"
                                value="{field.value}">
                        {:else}
                            <b>{field.value}</b> 
                        {/if}
                    </div>
                {/each}
            </div>
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

        <h3 class="text-lg mt-2 font-bold">¿Seguro que desea eliminar el Alumno?</h3>
        <p class="text-wrap text-sm">Los datos eliminados son irrecuperables, asegurese de realizar una copia de seguridad antes de realizar cambios.</p>
        <div class="modal-container">
            <form action="?/delete" method="POST" use:enhance class="h-auto w-full ">
                <input type="hidden" value="{alumno.cedula_escolar}" name="cedula_escolar">
                <button class="btn btn-error btn-sm mt-6">Eliminar</button>
            </form>
        </div>
    </div>
</dialog>

<style lang="postcss">
    .modal-container {
        @apply flex max-h-[20rem] overflow-y-auto overflow-x-hidden;
        scrollbar-width: thin;
    }
    .input {
        @apply focus:outline-0 ;
    }
</style>