<script lang="ts">
    import type { PageData } from './$types';
    import Alert from "$lib/components/Messages/Alert.svelte"
    import delete_icon from "$lib/images/icons/borrar_icon.svg"
    import user_icon from "$lib/images/icons/username_icon.svg"
    import camera_icon from "$lib/images/icons/camara_icon.svg"   
    import edit_icon from "$lib/images/icons/edit_icon.svg"
    import add_icon from "$lib/images/icons/add_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
    import ver_icon from "$lib/images/icons/details_icon.svg"
    import success_icon from "$lib/images/icons/success_icon.svg"
    import type { ActionData } from '../$types';
    import { basePath, formatStringWithDots } from '$lib';
    import { enhance } from '$app/forms';

    let { data, form }: { data: PageData, form: ActionData } = $props();
    let { empleado } = $derived(data)

    function openModal(id: string) {
        document!.getElementById(id)!.showModal()
    }

    function closeModal(id: string) {
        document!.getElementById(id)!.click()
    }

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

    let personalData: Data[] = $derived([
        {
            name: "cedula",
            updateable: true,
            icon: cedula_escolar_icon,
            title: "Cédula de Identidad",
            value: `V-${formatStringWithDots(empleado.cedula)}`
        },
        {
            name: "sexo",
            updateable: false,
            icon: empleado.sexo === "Masculino" ? male_icon : female_icon,
            title: "Género",
            value: `${empleado.sexo}`
        },
        {
            name: "fecha_nacimiento",
            updateable: false,
            icon: birhtday_icon,
            title: "Fecha de Nacimiento",
            value: new Date(empleado.fecha_nacimiento).toLocaleDateString()
        },
        {
            name: "edad",
            updateable: false,
            icon: edad_icon,
            title: "Edad",
            value: `${empleado.edad} Años`
        }
    ])
    let edicionPersonal = $state(false)

    let profesionalData: Data[] = $derived([
        {
            name: "cedula",
            updateable: true,
            icon: cedula_escolar_icon,
            title: "Cédula de Identidad",
            value: `V-${formatStringWithDots(empleado.cedula)}`
        },
        {
            name: "sexo",
            updateable: false,
            icon: empleado.sexo === "Masculino" ? male_icon : female_icon,
            title: "Género",
            value: `${empleado.sexo}`
        },
        {
            name: "fecha_nacimiento",
            updateable: false,
            icon: birhtday_icon,
            title: "Fecha de Nacimiento",
            value: new Date(empleado.fecha_nacimiento).toLocaleDateString()
        },
        {
            name: "edad",
            updateable: false,
            icon: edad_icon,
            title: "Edad",
            value: `${empleado.edad} Años`
        }
    ])
</script>

<main class="w-full h-full relative">
    <Alert form={form} styles="lg:fixed absolute top-8 left-12 max-w-sm" />

    <div class="w-full h-max max-h-20 flex items-center justify-between">
        <div>
            <h2 class="text-xl font-bold">Datos del Empleado</h2>
            <div class="breadcrumbs text-sm">
                <ul>
                    <li>
                        <a href="{basePath}/empleados">
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
                            Empleados 
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
                            Empleado
                        </span>
                    </li>
                </ul>
            </div>
        </div>

        <button class="btn btn-sm btn-error *:filter *:invert font-bold" onclick="{() => {openModal("delete_confirmation")}}">
            <img src="{delete_icon}" alt="" class="icon">
            <span>Eliminar Empleado</span>
        </button>
    </div>

    <div class="w-full mt-4 flex flex-col-reverse lg:flex-row items-start justify-start gap-4">
        <div class="w-full lg:w-[70%] flex flex-col gap-3 items-start justify-start">
            <div class="w-full flex gap-3 items-start justify-start">
                <form use:enhance action="?/edit" method="POST" class="w-full animate--x min-h-60 rounded-md p-4 bg-base-100 shadow-md">
                    <div class="w-full h-max flex justify-between items-center ">
                        <h3 class="text-xl font-bold">Detalles Personales</h3>

                        <button class="btn btn-circle btn-active btn-sm p-1 active:btn-primary group"
                        onclick="{() =>{ setTimeout(() => { },100) }}"
                        type={"submit"}>
                            <img src="{edit_icon}" alt="" class="group-active:invert filter icon">
                        </button>
                    </div>

                    <div class="mt-2">
                        <input type="hidden" name="empleado" value={empleado.cedula}>
                        {#each personalData as field}
                            <div class="w-full flex items-center justify-between px-4 py-2 text-[0.95rem]">
                                <div class="flex items-center justify-between gap-2">
                                    <img src="{field.icon}" alt="" class="icon">
                                    <p class="font-semibold text-base-content/80 ">{field.title}</p> 
                                </div>

                                {#if edicionPersonal && field.updateable}
                                    <input type="text" 
                                        min="3"
                                        name="{field.name}"
                                        placeholder="{field.title}..."
                                        class="input input-bordered input-sm max-w-xs"
                                        value="{field.name === "cedula_escolar" ? stripDots(field.value) : field.value}">
                                {:else}
                                    <b class="{field.name === "sexo" ? empleado.sexo === "Masculino" ? "text-blue-600" : "text-pink-600" : ""}">{field.value}</b> 
                                {/if}
                            </div>
                        {/each}
                    </div>
                </form>

                <form use:enhance action="?/edit" method="POST" class="w-full animate--x min-h-60 rounded-md p-4 bg-base-100 shadow-md"
                style="--delay: 100ms">
                    <div class="w-full h-max flex justify-between items-center ">
                        <h3 class="text-xl font-bold">Detalles Profesionales</h3>

                        <button class="btn btn-circle btn-active btn-sm p-1 active:btn-primary group"
                        onclick="{() =>{ setTimeout(() => { },100) }}"
                        type={"submit"}>
                            <img src="{edit_icon}" alt="" class="group-active:invert filter icon">
                        </button>
                    </div>

                    <div class="mt-2">
                        <!-- <input type="hidden" name="alumno" value={alumno.cedula_escolar}>
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
                                    <b class="{field.name === "sexo" ? alumno.sexo === "Masculino" ? "text-blue-600" : "text-pink-600" : ""}">{field.value}</b> 
                                {/if}
                            </div>
                        {/each} -->
                    </div>
                </form>
            </div>

            <div class="w-full flex gap-3 items-start justify-start">
                <form use:enhance action="?/edit" method="POST" class="w-full animate-x min-h-60 rounded-md p-4 bg-base-100 shadow-md"
                style="--delay: 300ms">
                    <div class="w-full h-max flex justify-between items-center ">
                        <h3 class="text-xl font-bold">Datos Escolares</h3>

                        <button class="btn btn-circle btn-active btn-sm p-1 active:btn-primary group"
                        onclick="{() =>{ setTimeout(() => { },100) }}"
                        type={"submit"}>
                            <img src="{edit_icon}" alt="" class="group-active:invert filter icon">
                        </button>
                    </div>

                    <div class="mt-2">
                        <!-- <input type="hidden" name="alumno" value={alumno.cedula_escolar}>
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
                                    <b class="{field.name === "sexo" ? alumno.sexo === "Masculino" ? "text-blue-600" : "text-pink-600" : ""}">{field.value}</b> 
                                {/if}
                            </div>
                        {/each} -->
                    </div>
                </form>
            </div>
        </div>

        <div class="w-full lg:w-[30%] min-h-60 flex flex-col items-center justify-center animate--x" style="--delay: 150ms">
            <div class="w-full relative p-5 flex items-center justify-center flex-col rounded-md bg-base-100 shadow-lg">
                <div class="size-fit relative">
                    <img src="{user_icon}" alt="" class="size-36 icon">
                    <button type="button" class="absolute bottom-1 right-1 size-7 flex items-center justify-center p-0.5
                    hover:bg-base-content/20 active:bg-base-content/10 rounded-md transition-all duration-200">
                        <img src="{camera_icon}" alt="" class="size-full icon">
                    </button>
                </div>
                <h3 class="font-bold text-lg mt-2">{empleado.primer_nombre} {empleado.segundo_nombre} {empleado.primer_apellido} {empleado.segundo_apellido}</h3>
                <h3 class="{true === "Retirado" ? "text-error" : "text-base-content/60"} text-sm"> 
                    {
                        true === "Retirado" ?
                           'Empleado' 
                        : "Empleado Retirado"} 
                </h3>
            </div>
        </div>
    </div>
</main>

<style lang="postcss">
    .modal-container {
        @apply flex max-h-[20rem] overflow-y-auto overflow-x-hidden;
        scrollbar-width: thin;
    }
    .input {
        @apply focus:outline-0 ;
    }
    select {
        @apply btn btn-sm btn-outline border-base-content/40 focus:outline-0;
    }
</style>