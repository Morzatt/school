<script lang="ts">
    import { basePath, formatStringWithDots } from '$lib';
    import type { ActionData, PageData } from './$types';
    import delete_icon from "$lib/images/icons/borrar_icon.svg"
    import user_icon from "$lib/images/icons/username_icon.svg"
    import camera_icon from "$lib/images/icons/camara_icon.svg"   
    import print from "$lib/images/icons/print.svg"
    import add_icon from "$lib/images/icons/add_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
    import edit_icon from "$lib/images/icons/edit_icon.svg"
    import { enhance } from '$app/forms';
    import ver_icon from "$lib/images/icons/details_icon.svg"
    let { data, form }: { data: PageData, form: ActionData } = $props();

    let { representante, alumnos } = $derived(data)

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
    import { getAge } from '$lib/utils/getAge';
    import { downloadFile } from '$lib/utils/downloadFile';
    import Documento from './Documento.svelte';

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
            value: getAge(new Date(representante.fecha_nacimiento).toLocaleDateString('sv-SE')).toLowerCase() === 'menos de un año' ? getAge(new Date(representante.fecha_nacimiento).toLocaleDateString('sv-SE')) : `${getAge(new Date(representante.fecha_nacimiento).toLocaleDateString('sv-SE'))} Años`
        },
        {
            name: "grado_instruccion",
            updateable: true,
            icon: representante.sexo === "Masculino" ? male_icon : female_icon,
            title: "Grado de Instruccion",
            value: `${representante.grado_instruccion}`
        },
        {
            name: "ocupacion",
            updateable: true,
            icon: representante.sexo === "Masculino" ? male_icon : female_icon,
            title: "Ocupacion",
            value: `${representante.ocupacion}`
        },
    ])

    let contactData: Data[] = $derived([
        {
            name: "direccion",
            updateable: true,
            icon: cedula_escolar_icon,
            title: "Dirección",
            value: `${representante.direccion}`
        },
        {
            name: "correo_electronico",
            updateable: true,
            icon: cedula_escolar_icon,
            title: "Correo Electronico",
            value: `${representante.correo_electronico}`
        },
    ])

    let editContacto = $state(false)

    function stripDots(inputString: string) {
        return inputString.replace(/\./g, '');
    }

    $effect(() => {
        if (form && form.success && form.form === 'printRepresentante') {
            downloadFile(`/downloads/${form.documentoId}?type=representante`, `representante_${form.documentoId}.pdf`)
        }
    })
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

        <div class="flex items-center justify-between gap-6">
            <form method="post" use:enhance action="?/printRepresentante">
                <input type="hidden" name="cedula" value={representante.cedula}>
                <button class="btn btn-sm btn-primary flex gap-2">
                    <img src="{print}" alt="" class="icon filter invert">
                    <span>Imprimir</span>
                </button>           
            </form>
            <button class="btn btn-sm btn-error *:filter *:invert font-bold" onclick="{() => {document.getElementById("delete_representante").showModal()}}">
                <img src="{delete_icon}" alt="" class="icon">
                <span>Eliminar Representante</span>
            </button>
        </div>
    </div>

    <div class="w-full mt-4 flex flex-col lg:flex-row items-start justify-start gap-4 ">
        <div class="w-full lg:max-w-xs min-h-60 flex flex-col items-center justify-center lg:items-start gap-4 ">
            <div class="w-max gap-5 p-5 flex items-center justify-center rounded-md bg-base-100 shadow-lg animate--x">
                <!-- IMAGEN DE PERFIL -->
                <div class="size-fit relative">
                    <img src="{(representante.foto_path) ? `/downloads/0000?type=image&path=${representante.foto_path}` : user_icon}" alt="" class="{(representante.foto_path) ? '' : 'icon'} size-36 mask mask-circle">                       
                    <Documento visible="false" representante={representante} tipo_documento={"foto_perfil"} path={representante.foto_path}  />                               

                    <button type="button" class="btn btn-sm btn-square absolute bottom-1 right-1 flex items-center justify-center p-0.5 px-1" 
                    onclick={() => {
                        document.getElementById(`foto_perfil_modal`).showModal()
                    }}>
                        <img src="{camera_icon}" alt="" class="size-full icon">
                    </button>
                </div>

                <div class="">
                    <h3 class="font-bold text-lg mt-2">{representante?.nombre} {representante?.apellido}</h3>
                    <h3 class="text-base-content/60 text-sm"> 
                        Representante
                    </h3>
                </div>
            </div>

            <div class="w-full gap-5 py-5 px-4 rounded-md bg-base-100 shadow-lg animate--x" style="--delay: 200ms">
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

                <div class="w-full mt-3 max-h-[25rem] border border-base-content/30 rounded-md p-3
                            overflow-x-hidden overflow-y-auto" style="scrollbar-width: thin;">
                    {#if alumnos && alumnos.length > 0}
                        {#each alumnos as alumno, i}
                            <div class="w-full flex items-center justify-between border-0 border-base-content/30 px-2 rounded-md">
                                <div class="flex h-[7rem] items-center gap-2 py-2">
                                    <b class="h-full w-8 flex items-center justify-center text-base-100 rounded-lg
                                    {alumno.sexo === "Masculino" ? "bg-blue-600/80" : "bg-pink-600/80"}">
                                        {alumno.sexo[0]}
                                    </b>

                                    <div>
                                        <b>{alumno.primer_nombre} {alumno.primer_apellido}</b>
                                        <div>
                                            <span class="text-sm">Cedula: </span>
                                            <span class="text-sm font-semibold">{alumno.nacionalidad === "Venezolano" ? "V-" : "E-"}{(alumno.cedula_escolar)}</span>
                                        </div> 

                                        <div>
                                            <span class="text-xs">Edad: </span>
                                            <span class="text-base-content/60 text-xs font-semibold">{alumno.edad} Años</span>
                                        </div> 

                                        <div>
                                            <span class="text-sm">Relacion: </span>
                                            <span class="text-sm font-semibold">{alumno.relacion}</span>
                                        </div> 
                                    </div>
                                </div>

                                <a href="{basePath}/alumnos/{alumno.cedula_escolar}" class="btn btn-sm btn-square p-0 m-0 flex items-center justify-center">
                                    <img src="{ver_icon}" alt="" class="icon">
                                </a>
                            </div> 
                            <div class="bg-base-content/30 h-px my-2 py-0"></div>
                        {/each}                   
                    {:else}
                        <h2 class="text-sm text-base-content/70">El representante aún no tiene alumnos asociados.</h2>
                    {/if}
                </div>
            </div>
        </div>

        <div class="w-full min-h-60 flex flex-col items-center justify-start gap-4 ">
            <div class="w-full gap-5 flex flex-col items-center justify-center">
                <form use:enhance action="?/edit" method="POST" class="w-full rounded-md p-4 bg-base-100 shadow-md animate-x" style="--delay: 100ms">
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

                <form use:enhance action="?/edit" method="POST" class="w-full rounded-md p-4 bg-base-100 shadow-md animate-x" style="--delay: 400ms">
                    <div class="w-full h-max flex justify-between items-center ">
                        <h3 class="text-xl font-bold">Detalles del Contacto</h3>

                        <button class="btn btn-circle btn-active btn-sm p-1 active:btn-primary group"
                        onclick="{() =>{ setTimeout(() => { editContacto= !editContacto;},100) }}"
                        type={editContacto ? "submit" : "button"}>
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

                                {#if editContacto && field.updateable}
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

                        <div class="w-full flex items-center justify-between px-4 py-2 text-[0.95rem]">
                            <div class="flex items-center justify-between gap-2">
                                <img src="" alt="" class="icon">
                                <p class="font-semibold text-base-content/80 ">Telefono #1</p> 
                            </div>

                            {#if editContacto}
                                <input type="text" 
                                    min="3"
                                    name="telefono_1"
                                    placeholder="Numero de telefono #1..."
                                    class="input input-bordered input-sm max-w-xs"
                                    value="{representante.telefono_1}">
                            {:else}
                                <b class="">{representante.telefono_1}</b> 
                            {/if}
                        </div>

                        <div class="w-full flex items-center justify-between px-4 py-2 text-[0.95rem]">
                            <div class="flex items-center justify-between gap-2">
                                <img src="" alt="" class="icon">
                                <p class="font-semibold text-base-content/80 ">Telefono #1</p> 
                            </div>

                            {#if editContacto}
                                <input type="text" 
                                    min="3"
                                    name="telefono_2"
                                    placeholder="Numero de telefono #2..."
                                    class="input input-bordered input-sm max-w-xs"
                                    value="{representante.telefono_2}">
                            {:else}
                                <b class="">{representante.telefono_2}</b> 
                            {/if}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</main>

<dialog id="delete_representante" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box relative
                sm:w-10/12 sm:max-w-md overflow-hidden">
        <Alert form={form} styles="absolute top-4 left-3" />
        <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            id="delete_representante_close">✕</button>
        </form>

        <h3 class="text-lg mt-2 font-bold">¿Seguro que desea eliminar el Representante?</h3>
        <p class="text-wrap text-sm">Los datos eliminados son irrecuperables, asegurese de realizar una copia de seguridad antes de realizar cambios.</p>

        <div class="modal-container">
            <form action="?/delete" method="POST" use:enhance={() => {
                document.getElementById('delete_representante_close').click()
            }} class="h-auto w-full ">
                <input type="hidden" value="{representante.cedula}" name="cedula_representante">
                <button class="btn btn-error btn-sm mt-6">Eliminar</button>
            </form>
        </div>
    </div>
</dialog>