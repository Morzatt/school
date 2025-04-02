<script lang="ts">
    import { basePath, formatStringWithDots } from '$lib';
    import type { ActionData, PageData } from './$types';
    import delete_icon from "$lib/images/icons/borrar_icon.svg"
    import user_icon from "$lib/images/icons/username_icon.svg"
    import add_icon from "$lib/images/icons/add_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
    import edit_icon from "$lib/images/icons/edit_icon.svg"
    import { enhance } from '$app/forms';
    import ver_icon from "$lib/images/icons/details_icon.svg"
    let { data, form }: { data: PageData, form: ActionData } = $props();

    let { representante, alumnos, telefonos } = $derived(data)

    type Data = {
        name: string,
        icon: string,
        title: string,
        value: string,
        updateable?: boolean,
    }

    import cedula_escolar_icon from "$lib/images/icons/personalizar_icon.svg"
    import female_icon from "$lib/images/icons/female_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
    import male_icon from "$lib/images/icons/male_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
    import birhtday_icon from "$lib/images/icons/cake_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
    import edad_icon from "$lib/images/icons/description_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"

    let edicion = $state(false)

    import curso_actual from "$lib/images/icons/curso_actual.svg"
    import turnos from "$lib/images/icons/turnos_icon.svg"
    import seccion from "$lib/images/icons/seccion.svg"
    import Alert from '$lib/components/Messages/Alert.svelte';
    import CreateAlumnoModal from './CreateAlumnoModal.svelte';

    let personalData: Data[] = $derived([
        {
            name: "cedula",
            updateable: false,
            icon: cedula_escolar_icon,
            title: "Cédula de Identidad",
            value: `${formatStringWithDots(representante.cedula)}`
        },
        {
            name: "sexo",
            updateable: false,
            icon: representante.sexo === "Masculino" ? male_icon : female_icon,
            title: "Género",
            value: `${representante.sexo}`
        },
        {
            name: "fecha_nacimiento",
            updateable: false,
            icon: birhtday_icon,
            title: "Fecha de Nacimiento",
            value: new Date(representante.fecha_nacimiento).toLocaleDateString()
        },
        {
            name: "edad",
            updateable: false,
            icon: edad_icon,
            title: "Edad",
            value: `${representante.edad}`
        },
        {
            name: "grado_instruccion",
            updateable: false,
            icon: representante.sexo === "Masculino" ? male_icon : female_icon,
            title: "Grado de Instruccion",
            value: `${representante.grado_instruccion}`
        },
        {
            name: "ocupacion",
            updateable: false,
            icon: representante.sexo === "Masculino" ? male_icon : female_icon,
            title: "Ocupacion",
            value: `${representante.ocupacion}`
        },
    ])

    let contactData: Data[] = $derived([
        {
            name: "direccion",
            updateable: false,
            icon: cedula_escolar_icon,
            title: "Dirección",
            value: `${representante.direccion}`
        },
        {
            name: "correo_electronico",
            updateable: false,
            icon: cedula_escolar_icon,
            title: "Correo Electronico",
            value: `${representante.correo_electronico}`
        },
    ])

    function stripDots(inputString: string) {
        return inputString.replace(/\./g, '');
    }
</script>

<main class="w-full h-full relative">
    <Alert form={form} styles="lg:fixed absolute top-8 left-12 max-w-sm" />
    <div class="w-full h-max max-h-20 flex items-center justify-between">
        <div>
            <h2 class="text-xl font-bold">Datos del Representante</h2>
            <div class="breadcrumbs text-sm">
                <ul>
                    <li>
                        <a href="{basePath}/representantes">
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
                            Representantes
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
                            Representante
                        </span>
                    </li>
                </ul>
            </div>
        </div>

        <button class="btn btn-sm btn-error *:filter *:invert font-bold" onclick="{() => {openModal("delete_confirmation")}}">
            <img src="{delete_icon}" alt="" class="icon">
            <span>Eliminar Representante</span>
        </button>
    </div>

    <div class="w-full mt-4 flex flex-col lg:flex-row items-start justify-start gap-4 ">
        <div class="w-full lg:max-w-xs min-h-60 flex flex-col items-center justify-center lg:items-start gap-4 ">
            <div class="w-max gap-5 p-5 flex items-center justify-center rounded-md bg-base-200 shadow-lg">
                <div class="size-fit relative">
                    <img src="{user_icon}" alt="" class="size-28 icon">
                </div>
                <div class="">
                    <h3 class="font-bold text-lg mt-2">{representante?.nombre} {representante?.apellido}</h3>
                    <h3 class="text-base-content/60 text-sm"> 
                        Representante
                    </h3>
                </div>
            </div>

            <div class="w-full gap-5 py-5 px-4 rounded-md bg-base-200 shadow-lg">
                <div class="flex w-full items-center justify-between">
                    <h2 class="text-lg font-semibold">Alumnos Representados</h2>
                    <button class="btn btn-circle btn-active btn-sm p-1 active:btn-primary group flex items-center justify-center tooltip tooltip-top"
                    data-tip="Añadir Alumno"
                    onclick="{() => document.getElementById(`create_alumno_modal`).showModal()}">
                        <img src="{add_icon}" alt="" class="group-active:invert filter icon">
                    </button>
                </div>

                <CreateAlumnoModal form={null} representante={representante}/>

                <div class="divider p-0 m-0"></div>

                <div class="w-full mt-3 max-h-[25rem]
                            overflow-x-hidden overflow-y-auto" style="scrollbar-width: thin;">
                    {#if alumnos && alumnos.length > 0}
                        {#each alumnos as alumno, i}
                            <div class="w-full flex items-center justify-between border border-base-content/30 px-4 rounded-md">
                                <div class="flex items-center">
                                    <div>
                                        <b>{alumno.primer_nombre} {alumno.primer_apellido}</b>
                                        <div>
                                            <span class="text-sm">Cedula: </span>
                                            <span class="text-sm font-semibold">{alumno.cedula_escolar}</span>
                                        </div> 

                                        <div>
                                            <span class="text-xs">Edad: </span>
                                            <span class="text-base-content/60 text-xs font-semibold">{alumno.edad} Años</span>
                                            <span>-</span>
                                            <span class="text-xs font-semibold {alumno.sexo === "Masculino" ? "text-blue-600" : "text-pink-600"}">
                                                {alumno.sexo}
                                            </span>
                                        </div> 

                                        <div>
                                            <span class="text-sm">Relacion: </span>
                                            <span class="text-sm font-semibold">{alumno.relacion}</span>
                                        </div> 
                                    </div>
                                </div>

                                <a href="{basePath}/alumnos/{alumno.cedula_escolar}" class="btn btn-xs btn-square p-0 m-0 flex items-center justify-center">
                                    <img src="{ver_icon}" alt="" class="icon">
                                </a>
                            </div> 
                            <div class="bg-base-content/30 h-px my-2 py-0"></div>
                        {/each}                   
                    {/if}
                </div>
            </div>
        </div>

        <div class="w-full min-h-60 flex flex-col items-center justify-start gap-4 ">
            <div class="w-full gap-5 p-5 flex flex-col items-center justify-center rounded-md bg-base-200 shadow-lg">
                <form use:enhance action="?/edit" method="POST" class="w-full rounded-md p-4 border border-base-content/40 bg-base-200 shadow-md">
                    <div class="w-full h-max flex justify-between items-center ">
                        <h3 class="text-xl font-bold">Detalles del Representante</h3>

                        <button class="btn btn-circle btn-active btn-sm p-1 active:btn-primary group"
                        onclick="{() =>{ setTimeout(() => {edicion = !edicion;},100) }}"
                        type={edicion ? "submit" : "button"}>
                            <img src="{edit_icon}" alt="" class="group-active:invert filter icon">
                        </button>
                    </div>

                    <div class="mt-2 w-full">
                        <input type="hidden" name="cedula" value={representante.cedula}>

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
                                        value="{field.name === "cedula_escolar" ? stripDots(field.value) : field.value}">
                                {:else}
                                    <b class="{field.name === "sexo" ? representante.sexo === "Masculino" ? "text-blue-600" : "text-pink-600" : ""}">{field.value}</b> 
                                {/if}
                            </div>
                        {/each}
                    </div>
                </form>

                <form use:enhance action="?/edit" method="POST" class="w-full rounded-md p-4 border border-base-content/40 bg-base-200 shadow-md">
                    <div class="w-full h-max flex justify-between items-center ">
                        <h3 class="text-xl font-bold">Detalles del Contacto</h3>

                        <button class="btn btn-circle btn-active btn-sm p-1 active:btn-primary group"
                        onclick="{() =>{ setTimeout(() => {edicion = !edicion;},100) }}"
                        type={edicion ? "submit" : "button"}>
                            <img src="{edit_icon}" alt="" class="group-active:invert filter icon">
                        </button>
                    </div>

                    <div class="mt-2 w-full">
                        <input type="hidden" name="cedula" value={representante.cedula}>

                        {#each contactData as field}
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
                                        value="{field.name === "cedula_escolar" ? stripDots(field.value) : field.value}">
                                {:else}
                                    <b class="{field.name === "sexo" ? representante.sexo === "Masculino" ? "text-blue-600" : "text-pink-600" : ""}">{field.value}</b> 
                                {/if}
                            </div>
                        {/each}

                        {#if telefonos}
                            {#each telefonos as field, index}
                                {@const i = index+1}
                                <div class="w-full flex items-center justify-between px-4 py-2 text-[0.95rem]">
                                    <div class="flex items-center justify-between gap-2">
                                        <img src="" alt="" class="icon">
                                        <p class="font-semibold text-base-content/80 ">Telefono #{i}</p> 
                                    </div>

                                    {#if edicion}
                                        <input type="text" 
                                            min="3"
                                            name="telefono"
                                            placeholder="Numero de telefono #{i}..."
                                            class="input input-bordered input-sm max-w-xs"
                                            value="{field.numero_telefono}">
                                    {:else}
                                        <b class="">{field.numero_telefono}</b> 
                                    {/if}
                                </div>
                            {/each}     
                        {/if}
                    </div>
                </form>
            </div>
        </div>
    </div>
</main>