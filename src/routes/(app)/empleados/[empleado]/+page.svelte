<script lang="ts">
    import type { PageData } from './$types';
    import Alert from "$lib/components/Messages/Alert.svelte"
    import delete_icon from "$lib/images/icons/borrar_icon.svg"
    import print from "$lib/images/icons/print.svg"
    import user_icon from "$lib/images/icons/username_icon.svg"
    import camera_icon from "$lib/images/icons/camara_icon.svg"   
    import description_icon from "$lib/images/icons/description_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
    import edit_icon from "$lib/images/icons/edit_icon.svg"
    import ver_icon from "$lib/images/icons/details_icon.svg"
    import success_icon from "$lib/images/icons/success_icon.svg"
    import type { ActionData } from '../$types';
    import { basePath, formatStringWithDots } from '$lib';
    import { enhance } from '$app/forms';

    let { data, form }: { data: PageData, form: ActionData & { documentId: string } } = $props();
    let { empleado, grado } = $derived(data)

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
        value: string | any,
        updateable?: boolean,
    }

    import cedula_escolar_icon from "$lib/images/icons/personalizar_icon.svg"
    import female_icon from "$lib/images/icons/female_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
    import male_icon from "$lib/images/icons/male_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
    import birhtday_icon from "$lib/images/icons/cake_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
    import edad_icon from "$lib/images/icons/description_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
    import { capitalizeFirstLetter } from '$lib/utils/capitlizeFirstLetter';
    import { formatGrado } from '$lib/utils/createGradoId';

    let personalData: Data[] = $derived([
        {
            name: "cedula",
            updateable: false,
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
            value: getAge(empleado.fecha_nacimiento.toLocaleDateString('sv-SE')).toLowerCase() === 'menos de un año' ? getAge(empleado.fecha_nacimiento.toLocaleDateString('sv-SE')) : `${getAge(empleado.fecha_nacimiento.toLocaleDateString('sv-SE'))} Años`
        }
    ])
    let edicionPersonal = $state(false)

    // import grado_instruccion from "$lib/images/icons/"
    import area_icon from "$lib/images/icons/class_icon.svg"
    import especializacion_icon from "$lib/images/icons/email_icon.svg"
    import grado_icon from "$lib/images/icons/school_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
    import cargo_icon from "$lib/images/icons/profesor.svg"

    let profesionalData: Data[] = $derived([
        {
            name: "grado_instruccion",
            updateable: true,
            icon: grado_icon,
            title: "Grado de Instrucción",
            value: capitalizeFirstLetter(empleado.grado_instruccion)
        },
        {
            name: "especializacion",
            updateable: true,
            icon: especializacion_icon,
            title: "Especialización",
            value: capitalizeFirstLetter(empleado.especializacion)
        },
        {
            name: "area",
            updateable: true,
            icon: area_icon,
            title: "Área",
            value: capitalizeFirstLetter(empleado.area)
        },
        {
            name: "cargo",
            updateable: true,
            icon: cargo_icon,
            title: "Cargo",
            value: capitalizeFirstLetter(empleado.cargo)
        }
    ])
    let edicionProfesional = $state(false)

    import tiempo_servicio from "$lib/images/icons/historial_icon.svg"
    import turno_ma from "$lib/images/icons/turno_manana.svg"
    import turno_ta from "$lib/images/icons/turno_tarde.svg"
    import ingreso_icon from "$lib/images/icons/book_icon.svg"
    import { getAge } from '$lib/utils/getAge';
    import { downloadFile } from '$lib/utils/downloadFile';
    import Documento from "./Documento.svelte"

    let institucionData: Data[] = $derived([
        {
            name: "fecha_ingreso",
            updateable: false,
            icon: ingreso_icon,
            title: "Fecha de Ingreso",
            value: empleado.fecha_ingreso
        },
        {
            name: "tiempo_servicio",
            updateable: false,
            icon: tiempo_servicio,
            title: "Tiempo de Servicio",
            value: getAge(String(empleado.fecha_ingreso))
        },
        {
            name: "turno",
            updateable: true,
            icon: empleado.turno === "Tarde" ? turno_ta : turno_ma,
            title: "Turno",
            value: empleado.turno
        },
    ])
    let edicionInstitucion = $state(false)

    $effect(() => {
        if (form && form.success && form.form === 'getConstanciaAceptacion') {
           downloadFile(`/downloads/${form.documentoId}?type=constanciaAceptacionEmpleados`, `constancia_aceptacion_${form.documentoId}.pdf`)
        }

        if (form && form.success && form.form === 'printEmpleado') {
           downloadFile(`/downloads/${form.documentoId}?type=empleado`, `empleado_${form.documentoId}.pdf`)
        }
    })
</script>

<main class="w-full h-full relative pb-4">
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

        <div class="flex gap-6">
            <form method="post" use:enhance action="?/printEmpleado">
                <input type="hidden" name="cedula" value={empleado.cedula}>
                <button class="btn btn-sm btn-primary flex gap-2">
                    <img src="{print}" alt="" class="icon filter invert">
                    <span>Imprimir</span>
                </button>           
            </form>

            <button class="btn btn-sm btn-error *:filter *:invert font-bold" onclick="{() => {openModal("delete_confirmation")}}">
                <img src="{delete_icon}" alt="" class="icon">
                <span>Eliminar Empleado</span>
            </button>
        </div>
    </div>

    <div class="w-full mt-4 flex flex-col-reverse lg:flex-row items-start justify-start gap-4">
        <div class="w-full lg:w-[70%] flex flex-col gap-3 items-start justify-start">
            <div class="w-full flex gap-3 items-start justify-start">
                <form use:enhance action="?/edit" method="POST" class="w-full animate--x min-h-60 rounded-md p-4 bg-base-100 shadow-md">
                    <div class="w-full h-max flex justify-between items-center ">
                        <h3 class="text-xl font-bold">Detalles Personales</h3>

                        <!-- <button class="btn btn-circle btn-active btn-sm p-1 active:btn-primary group"
                        onclick="{() =>{ setTimeout(() => { },100) }}"
                        type={"submit"}>
                            <img src="{edit_icon}" alt="" class="group-active:invert filter icon">
                        </button> -->
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
                        onclick="{() =>{ setTimeout(() => { edicionProfesional = !edicionProfesional; }, 100) }}"
                        type={edicionProfesional ? "submit" : "button"}>
                            <img src="{edit_icon}" alt="" class="group-active:invert filter icon">
                        </button>
                    </div>

                    <div class="mt-2">
                        <input type="hidden" name="empleado" value={empleado.cedula}>
                        {#each profesionalData as field}
                            <div class="w-full flex items-center justify-between px-4 py-2 text-[0.95rem]">
                                <div class="flex items-center justify-between gap-2">
                                    <img src="{field.icon}" alt="" class="icon">
                                    <p class="font-semibold text-base-content/80 ">{field.title}</p> 
                                </div>

                                {#if edicionProfesional && field.updateable}
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
            </div>

            <div class="w-full flex gap-3 items-start justify-start">
                <form use:enhance action="?/edit" method="POST" class="w-full animate-x min-h-60 rounded-md p-4 bg-base-100 shadow-md"
                style="--delay: 300ms">
                    <div class="w-full h-max flex justify-between items-center ">
                        <h3 class="text-xl font-bold">Datos dentro de la Institución</h3>

                        <button class="btn btn-circle btn-active btn-sm p-1 active:btn-primary group"
                        onclick="{() =>{ setTimeout(() => { edicionInstitucion = !edicionInstitucion },100) }}"
                        type={edicionInstitucion ? "submit" : "button"}>
                            <img src="{edit_icon}" alt="" class="group-active:invert filter icon">
                        </button>
                    </div>

                    <div class="mt-2">
                        <input type="hidden" name="empleado" value={empleado.cedula}>
                        {#each institucionData as field}
                            <div class="w-full flex items-center justify-between px-4 py-2 text-[0.95rem]">
                                <div class="flex items-center justify-between gap-2">
                                    <img src="{field.icon}" alt="" class="icon">
                                    <p class="font-semibold text-base-content/80 ">{field.title}</p> 
                                </div>


                                {#if edicionInstitucion && field.updateable}
                                    <label class="form-control">
                                        <div class="label">
                                            <span class="label-text">Turno</span>
                                        </div>
                                        <select name="turno" required>
                                            <option disabled selected>{field.value}</option>
                                            <option value="Mañana">Mañana</option>
                                            <option value="Tarde">Tarde</option>
                                        </select>
                                    </label>
                                {:else}
                                    <b class="{field.name === "turno" ? field.value === "Mañana" ? "text-orange-500" : "text-purple-600" : ""}">{field.value}</b> 
                                {/if}
                            </div>
                        {/each}

                        {#if empleado.area === "Docente"}
                            <div class="w-full flex items-center justify-between px-4 py-2 text-[0.95rem]">
                                <div class="flex items-center justify-between gap-2">
                                    <img src="{success_icon}" alt="" class="icon">
                                    <p class="font-semibold text-base-content/80 ">Aula Asignada</p> 
                                </div>
                                {#if grado}
                                    <div class="flex items-center justify-between gap-4">
                                        <b class="">{formatGrado(grado)}</b>
                                        <a href="{basePath}/aulas/{grado.id_grado}" class="btn btn-xs btn-square">
                                            <img src="{ver_icon}" alt="" class="icon">
                                        </a>
                                    </div>
                                {:else}
                                    <b>Sin Asignar</b>
                                {/if}
                            </div>
                        {/if}
                    </div>
                </form>
            </div>
        </div>

        <div class="w-full h-full lg:w-[30%] gap-3 min-h-60 flex flex-col items-center justify-center animate--x" style="--delay: 150ms">
            <div class="w-full h-full relative p-5 flex items-center justify-center flex-col rounded-md bg-base-100 shadow-lg">
                <!-- IMAGEN DE PERFIL -->
                <div class="size-fit relative">
                    <img src="{(empleado.foto_path) ? `/downloads/0000?type=image&path=${empleado.foto_path}` : user_icon}" alt="" class="{(empleado.foto_path) ? '' : 'icon'} size-36 mask mask-circle">                       
                    <Documento visible="false" empleado={empleado} tipo_documento={"foto_perfil"} path={empleado.foto_path}  />                               

                    <button type="button" class="btn btn-sm btn-square absolute bottom-1 right-1 flex items-center justify-center p-0.5 px-1" 
                    onclick={() => {
                        document.getElementById(`foto_perfil_modal`).showModal()
                    }}>
                        <img src="{camera_icon}" alt="" class="size-full icon">
                    </button>
                </div>

                <h3 class="font-bold text-center text-lg mt-2">{empleado.primer_nombre} {empleado.segundo_nombre} {empleado.primer_apellido} {empleado.segundo_apellido}</h3>
                <h3 class="{empleado.estado === "Retirado" ? "text-error" : "text-base-content/60"} text-sm"> 
                    {
                        empleado.estado === "Retirado" ?
                           'Empleado Retirado' 
                        : "Empleado"} 
                </h3>
                <button class="btn {empleado.estado === "Retirado" ? "hidden" : ""} mt-3 btn-sm btn-error *:filter *:invert font-bold" onclick="{() => {openModal("retiro_confirmation")}}">
                    <span>✕</span>
                    <span>Retirar Empleado</span>
                </button>
                <div class="w-full h-max mt-4 rounded-md flex items-center justify-around gap-2 *:tooltip *:tooltip-top">
                    <form action="?/getConstanciaAceptacion" method="post" use:enhance data-tip="Constancia de Aceptacion">
                        <input type="hidden" name="cedula" value={empleado.cedula}>
                        <button class="btn btn-circle btn-sm btn-neutral p-1 flex items-center justify-center hover:btn-info">
                            <img src="{description_icon}" alt="" class="filter invert icon">
                        </button> 
                    </form>
                </div>
            </div>
        </div>
    </div>
</main>

<dialog id="retiro_confirmation" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box relative
                sm:w-10/12 sm:max-w-md overflow-hidden">
        <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            id="retiro_confirmation_close">✕</button>
        </form>
        <h3 class="text-lg mt-2 font-bold">¿Seguro que retirar al Empleado del sistema?</h3>
        <p class="text-wrap text-sm">Una vez retirado, el alumno no podrá ser asignado a ningún grado ni sección, y sus datos serán cambiados al modo <i>sólo lectura.</i> </p>

        <div class="modal-container">
            <form action="?/retirar" method="POST" use:enhance class="h-auto w-full ">
                <input type="hidden" value="{empleado.cedula}" name="empleado">
                <button class="btn btn-error btn-sm mt-6">Retirar</button>
            </form>
        </div>
    </div>
</dialog>

<dialog id="delete_confirmation" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box relative
                sm:w-10/12 sm:max-w-md overflow-hidden">
        <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            id="delete_confirmation_close">✕</button>
        </form>
        <h3 class="text-lg mt-2 font-bold">¿Seguro que eliminar el Empleado?</h3>
        <p class="text-wrap text-sm">Los datos eliminados son irrecuperables, asegurese de realizar una copia de seguridad antes de realizar cambios.</p>

        <div class="modal-container">
            <form action="?/eliminar" method="POST" use:enhance class="h-auto w-full ">
                <input type="hidden" value="{empleado.cedula}" name="empleado">
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
    select {
        @apply btn btn-sm btn-outline border-base-content/40 focus:outline-0;
    }
</style>