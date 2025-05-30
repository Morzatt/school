<script lang="ts">
    import type { ActionData, PageData } from './$types';
    import { enhance } from '$app/forms';
    import { invalidateAll } from "$app/navigation"
    import Documento from './Documento.svelte';

    // UTILS IMPORT
    import { basePath, formatStringWithDots } from '$lib';
    import { getAge } from "$lib/utils/getAge"

    // IMAGES IMPORT
    import delete_icon from "$lib/images/icons/borrar_icon.svg"
    import user_icon from "$lib/images/icons/username_icon.svg"
    import edit_icon from "$lib/images/icons/edit_icon.svg"
    import add_icon from "$lib/images/icons/add_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
    import ver_icon from "$lib/images/icons/details_icon.svg"
    import success_icon from "$lib/images/icons/success_icon.svg"
    import description_icon from "$lib/images/icons/description_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
    import photo_icon from "$lib/images/icons/camara_icon.svg"

    let { data, form }: { data: PageData, form: ActionData & { documentId: string, paths: { name: string, path: string }[] } } = $props();

    let createRepresentanteForm = $derived.by(() => {
        let f = filterForm('asociarRepresentante');
        if (f?.success) {
            closeModal('create_representante_close')
        }
        return f
    })

    // let manageRepresentanteForm = $derived.by(() => filterForm('asociarRepresentante'))
    let deleteRepresentanteForm = $derived.by(() => filterForm('deleteRepresentante'))

    function filterForm(name: string) {
        return form?.form === name ? form : null
    }

    let { alumno, representantes, familiares, grados_cursados, documentos } = $derived(data)

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
    import RepresentanteModal from './RepresentanteModal.svelte';

    let personalData: Data[] = $derived([
        {
            name: "cedula_escolar",
            updateable: true,
            icon: cedula_escolar_icon,
            title: "Cédula Escolar",
            value: `${(alumno.cedula_escolar)}`
        },
        {
            name: "sexo",
            updateable: false,
            icon: alumno.sexo === "Masculino" ? male_icon : female_icon,
            title: "Género",
            value: `${alumno.sexo}`
        },
        {
            name: "fecha_nacimiento",
            updateable: false,
            icon: birhtday_icon,
            title: "Fecha de Nacimiento",
            value: new Date(alumno.fecha_nacimiento).toLocaleDateString()
        },
        {
            name: "edad",
            updateable: false,
            icon: edad_icon,
            title: "Edad",
            value: getAge(alumno.fecha_nacimiento.toLocaleDateString('sv-SE')).toLowerCase() === 'menos de un año' ? getAge(alumno.fecha_nacimiento.toLocaleDateString('sv-SE')) : `${getAge(alumno.fecha_nacimiento.toLocaleDateString('sv-SE'))} Años`
        }
    ])
    let edicion = $state(false)

    import curso_actual from "$lib/images/icons/curso_actual.svg"
    import turnos from "$lib/images/icons/turnos_icon.svg"
    import seccion from "$lib/images/icons/seccion.svg"
    import DeleteRepresentanteModal from './DeleteRepresentanteModal.svelte';
    import Alert from '$lib/components/Messages/Alert.svelte';
    import { downloadFile } from '$lib/utils/downloadFile';

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

    function openModal(id: string) {
        document!.getElementById(id)!.showModal()
    }

    function closeModal(id: string) {
        document!.getElementById(id)!.click()
    }

    let editEscolares = $state(false)
    let nivel = $state('')

    function stripDots(inputString: string) {
        return inputString.replace(/\./g, '');
    }

    $effect(() => {
        if (form && form.success && form.form === "getBuenaConducta") {
            downloadFile(`/downloads/${form.documentId}?type=buena_conducta`, `buena_conducta_${form.documentId}.pdf`)
        }
        if (form && form.success && form.form === "getAceptacion") {
            downloadFile(`/downloads/${form.documentId}?type=aceptacion`, `constancia_aceptacion_${form.documentId}.pdf`)
        }
        if (form && form.success && form.form === "getConstanciaEstudio") {
            downloadFile(`/downloads/${form.documentId}?type=estudio`, `constancia_estudio_${form.documentId}.pdf`)
        }
        if (form && form.success && form.form === "getConstanciaInscripcion") {
            downloadFile(`/downloads/${form.documentId}?type=inscripcion`, `constancia_incripcion_${form.documentId}.pdf`)
        }
        if (form && form.success && form.form === "getConstanciaRetiro") {
            downloadFile(`/downloads/${form.documentId}?type=retiro`, `constancia_retiro_${form.documentId}.pdf`)
        }

        if (form && form.success && form.form === "retirar") {
            form.paths.forEach((i) => {
                downloadFile(i.path, i.name)
            })
            invalidateAll()
            document.getElementById('retiro_confirmation_close').click()
        }
    })

    let fileTypes = ['partida_nacimiento' , 'foto_carnet' , 'cedula_estudiante' , 'cedula_representante' , 'certificado_vacunacion'];
</script>


<main class="w-full h-full relative">
    <Alert form={form} styles="lg:fixed absolute top-8 left-12 max-w-sm" />
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

    <div class="w-full mt-4 flex flex-col lg:flex-row items-start justify-start gap-4">
        <div class="w-full lg:w-max min-h-60 flex flex-col items-center justify-center animate--x">
            <div class="w-max max-w-xs relative p-5 flex items-center justify-center flex-col rounded-md bg-base-100 shadow-lg">
                <div class="size-fit relative">
                    {#if true}
                        {@const documento = documentos?.filter(i => { return i.tipo_documento === "foto_carnet"; })[0] }
                        <img src="{(documento && documento.path) ? `/downloads/0000?type=image&path=${documento.path}` : user_icon}" alt="" class="{(documento && documento.path) ? '' : 'icon'} size-36 mask mask-circle">                       
                        <Documento visible="false" alumno={alumno} tipo_documento={"foto_carnet"} documento={ documento ? documento : null }  />                               
                    {/if}
                    <button type="button" class="btn btn-sm btn-square absolute bottom-1 right-1 flex items-center justify-center p-0.5 px-1" 
                    onclick={() => {
                        document.getElementById(`foto_carnet_modal`).showModal()
                    }}>
                        <img src="{photo_icon}" alt="" class="size-full icon">
                    </button>
                </div>
                <h3 class="font-bold text-center text-lg mt-2 text-wrap">{alumno.primer_nombre} {alumno.segundo_nombre} {alumno.primer_apellido} {alumno.segundo_apellido}</h3>
                <h3 class="{alumno.estado === "Retirado" ? "text-error" : "text-base-content/60"} text-sm"> 
                    {
                        alumno.estado !== "Retirado" ?
                            alumno.nivel ? 
                            `Alumno de ${alumno.nivel === "Inicial" ? "Preescolar" : alumno.nivel}`
                            : "Nivel no asignado"
                        : "Alumno Retirado"} 
                </h3>
                <button class="{alumno.estado === "Retirado" ? "hidden" : ""} btn btn-sm btn-error text-base-100 mt-2 px-6"
                onclick={() => { document.getElementById('retiro_confirmation').showModal() }}>
                    <span>✕</span>
                    <span>Retirar</span>
                </button>
                <!-- CONSTANCIAS -->
                <div class="w-full h-max mt-4 rounded-md flex items-center justify-between gap-2 *:tooltip *:tooltip-top">
                    <form action="?/getConstanciaEstudio" method="post" use:enhance data-tip="Constancia de Estudio">
                        <input type="hidden" name="cedula_escolar" value={alumno.cedula_escolar}>
                        <button class="btn btn-circle btn-sm btn-neutral p-1 flex items-center justify-center hover:btn-info">
                            <img src="{description_icon}" alt="" class="filter invert icon">
                        </button> 
                    </form>
                    <form action="?/getBuenaConducta" method="post" use:enhance data-tip="Constancia de Buena Conducta">
                        <input type="hidden" name="cedula_escolar" value={alumno.cedula_escolar}>
                        <button class="btn btn-circle btn-sm btn-neutral p-1 flex items-center justify-center hover:btn-info">
                            <img src="{description_icon}" alt="" class="filter invert icon">
                        </button> 
                    </form>
                    <form action="?/getAceptacion" method="post" use:enhance data-tip="Carta de Aceptacion">
                        <input type="hidden" name="cedula_escolar" value={alumno.cedula_escolar}>
                        <button class="btn btn-circle btn-sm btn-neutral p-1 flex items-center justify-center hover:btn-info">
                            <img src="{description_icon}" alt="" class="filter invert icon">
                        </button> 
                    </form>

                    <form action="?/getConstanciaInscripcion" method="post" use:enhance data-tip="Constancia de Inscripcion">
                        <input type="hidden" name="cedula_escolar" value={alumno.cedula_escolar}>
                        <button class="btn btn-circle btn-sm btn-neutral p-1 flex items-center justify-center hover:btn-info">
                            <img src="{description_icon}" alt="" class="filter invert icon">
                        </button> 
                    </form>
                    <form action="?/getConstanciaRetiro" method="post" use:enhance data-tip="Constancia de Retiro">
                        <input type="hidden" name="cedula_escolar" value={alumno.cedula_escolar}>
                        <button class="btn btn-circle btn-sm btn-neutral p-1 flex items-center justify-center hover:btn-info">
                            <img src="{description_icon}" alt="" class="filter invert icon">
                        </button> 
                    </form>
                </div>
            </div>
        </div>

        <form use:enhance action="?/edit" method="POST" class="w-full lg:w-3/5 min-h-60 rounded-md p-4 bg-base-100 shadow-md animate-y" style="--delay: 100ms">
            <div class="w-full h-max flex justify-between items-center ">
                <h3 class="text-xl font-bold">Detalles del Alumno</h3>

                <button class="btn btn-circle btn-active btn-sm p-1 active:btn-primary group"
                 onclick="{() =>{ setTimeout(() => {edicion = !edicion;},100) }}"
                 type={edicion ? "submit" : "button"}>
                    <img src="{edit_icon}" alt="" class="group-active:invert filter icon">
                </button>
            </div>

            <div class="mt-2">
                <input type="hidden" name="alumno" value={alumno.cedula_escolar}>
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
                            <b class="{field.name === "sexo" ? alumno.sexo === "Masculino" ? "text-blue-600" : "text-pink-600" : ""}">{field.name === "cedula_escolar" ? `${alumno.nacionalidad === "Venezolano" ? "V-" : "E-"}${field.value}` : field.value}</b> 
                        {/if}
                    </div>
                {/each}
            </div>
        </form>

        <div class="hidden lg:flex flex-1 min-h-72 rounded-md p-4 bg-base-100 shadow-md animate--x" style="--delay:150ms">

        </div>
    </div>

    <div class="w-full mt-4 flex flex-col lg:flex-row items-center justify-start gap-4">
        <div class="w-full lg:w-[55%] min-h-60 order-base-content/30 rounded-md p-4 bg-base-100 shadow-md animate--x" style="--delay:250ms">
            <div class="w-full h-max flex justify-between items-center ">
                <h3 class="text-xl font-bold">Representantes</h3>

                <button class="btn btn-circle btn-active btn-sm p-1 active:btn-primary group"
                onclick="{() => openModal(`create_representante_modal`)}">
                    <img src="{add_icon}" alt="" class="group-active:invert filter icon">
                </button>
            </div>

            <div class="mt-3 w-full">
            {#if representantes && representantes.length > 0}
                <div class="p-1 border-base-content/40 mb-1 font-bold
                            pb-1 bg-base-content text-base-100
                            px-2
                            w-full grid text-sm grid-cols-[3fr_4fr_3fr_1.5fr_1.5fr]">
                    <p>Cedula</p>
                    <p>Nombre</p>
                    <p>Relación</p>
                    <p>Ver</p>
                    <p>Eliminar</p>
                </div>
                    {#each representantes as representante}
                        <div class="p-1 w-full grid textsm grid-cols-[3fr_4fr_3fr_1.5fr_1.5fr]">
                            <p>V-{formatStringWithDots(representante.cedula)}</p>
                            <p>{representante.nombre} {representante.apellido}</p>
                            <p>{representante.relacion}</p>
                            <button class="btn btn-xs btn-square" onclick={()=>{openModal(`representante_${representante.cedula}_modal`)}}>
                                <img src="{ver_icon}" alt="" class="icon">
                            </button>
                            <button class="btn btn-xs btn-square hover:btn-error hover:text-white" onclick={()=>{openModal(`delete_representante_${representante.cedula}_confirmation`)}}>
                               <span>✕</span>
                            </button>
                        </div>

                        <DeleteRepresentanteModal cedula_alumno={alumno.cedula_escolar} cedula_representante={representante.cedula} form={deleteRepresentanteForm}/>
                        <RepresentanteModal representante={ representante } form={null}/>                           
                    {/each}
                {:else}
                    <h2 class="text-base-content/70">El alumno no Representantes asociados.</h2>
                {/if}
            </div>

            <div class="w-full h-max flex justify-between items-center mt-2">
                <h3 class="text-lg font-bold">Familiares</h3>
            </div>

            <div class="mt-3 w-full">
                {#if familiares && familiares.length > 0}
                    <div class="p-1 mb-1 font-bold
                                pb-1 bg-info/60 text-base-content
                                px-2 
                                w-full grid text-sm grid-cols-[3fr_4fr_3fr_2fr]">
                        <p>Cedula</p>
                        <p>Nombre</p>
                        <p>Autorización</p>
                        <p>Eliminar</p>
                    </div>
                    {#each familiares as familiar, i(familiar)}
                        <div class="p-1 w-full grid textsm grid-cols-[3fr_4fr_3fr_2fr]">
                            <p>V-{formatStringWithDots(familiar.cedula)}</p>
                            <p>{familiar.nombre} {familiar.apellido}</p>
                            <p>Entrada/Retiro</p>
                            <button class="btn btn-xs btn-square hover:btn-error hover:text-white"
                            onclick={ document.getElementById(`delete_familiar_${familiar.cedula}`).showModal() }>
                               <span>✕</span>
                            </button>
                        </div>

                        <dialog id="delete_familiar_{familiar.cedula}" class="modal modal-bottom sm:modal-middle">
                            <div class="modal-box relative
                                        sm:w-10/12 sm:max-w-md overflow-hidden">
                                <form method="dialog">
                                    <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" id="delete_familiar_{familiar.cedula}_close">✕</button>
                                </form>

                                <h3 class="text-lg mt-4 font-bold">¿Seguro que desea desvincular este familiar del Alumno?</h3>

                                <div class="modal-container">
                                    <form action="?/deleteFamiliar" method="POST" use:enhance={() => { document.getElementById(`delete_familiar_${familiar.cedula}_close`).click() }} class="h-auto w-full ">
                                        <input type="hidden" value="{familiar.cedula}" name="cedula_familiar">
                                        <input type="hidden" value="{alumno.cedula_escolar}" name="cedula_alumno">
                                        <button class="btn btn-error btn-sm mt-6">Eliminar</button>
                                    </form>
                                </div>
                            </div>
                        </dialog>
                    {/each}
                {:else}
                    <h2 class="text-base-content/70">El alumno no posee familiares autorizados.</h2>
                {/if}
            </div>
        </div>

        <form action="?/editAula" method="POST" use:enhance class="w-full lg:w-[45%] min-h-60 shadow-md order-base-content/30 rounded-md p-4 bg-base-100 animate-x" style="--delay:250ms">
            <div class="w-full h-max flex justify-between items-center ">
                <h3 class="text-xl font-bold">Datos Escolares</h3>

                <button class="btn btn-circle btn-active btn-sm p-1 active:btn-primary group" 
                onclick="{() =>{setTimeout(() => {editEscolares = !editEscolares}, 100)}}"
                type={editEscolares? "submit" : "button"}>
                    <img src="{edit_icon}" alt="" class="group-active:invert filter icon">
                </button>
            </div>

            <div class="mt-2 [&_.label]:hidden">
                <input type="hidden" name="cedula_escolar" value={alumno.cedula_escolar}>

                <div class="w-full flex items-center justify-between px-4 py-2 text-[0.95rem]">
                    <div class="flex items-center justify-between gap-2">
                        <img src="{curso_actual}" alt="" class="icon">
                        <p class="font-semibold text-base-content/80">Curso Actual</p> 
                    </div>

                    {#if editEscolares}
                        <div class="w-fit flex items-center justify-normal gap-3">
                            <label class="form-control">
                                <div class="label">
                                    <span class="label-text">Nivel</span>
                                </div>
                                <select name="nivel" bind:value={nivel} required>
                                    <option disabled selected>Elegir</option>
                                    <option value="Inicial">Inicial</option>
                                    <option value="Primaria">Primaria</option>
                                </select>
                            </label>

                            <div class="form-control focus:outline-0">
                                <div class="label">
                                    <span class="label-text">
                                        Grado
                                    </span>
                                </div>

                                <label class="flex items-center justify-start 
                                input input-sm input-bordered focus:outline-0 
                                rounded-md max-w-[12rem]">
                                    <input type="number" name="numero" 
                                    placeholder="..."
                                    class="max-w-[3rem] focus:outline-0" required>
                                    <p class="select-none">{nivel === "Elegir" ?  "Seleccionar" : nivel === 'Inicial' ? 'Nivel' : 'Grado'}</p>
                                </label>
                            </div>
                        </div>
                    {:else}
                        <b class="flex items-center justify-between gap-2">
                            {alumno.numero && alumno.nivel ?
                            `${formatNumero(alumno.numero)} 
                            ${alumno.nivel == "Inicial" ? "Nivel" : alumno.nivel === "Primaria" ? "Grado" : "Año"}` :
                            "No Asignado"}

                            <a href="{basePath}/aulas/{alumno.id_grado}" class="btn {!alumno.id_grado ? "hidden" : ""} btn-xs btn-square">
                                <img src="{ver_icon}" alt="" class="icon">
                            </a>
                        </b> 
                    {/if}
                </div>

                <div class="w-full flex items-center justify-between px-4 py-2 text-[0.95rem]">
                    <div class="flex items-center justify-between gap-2">
                        <img src="{seccion}" alt="" class="icon">
                        <p class="font-semibold text-base-content/80">Seccion</p> 
                    </div>

                    {#if editEscolares}
                        <label class="form-control">
                            <div class="label">
                                <span class="label-text">Seccion</span>
                            </div>
                            <select name="seccion" required>
                                <option disabled selected>Elegir</option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                                <option value="D">D</option>
                            </select>
                        </label>
                    {:else}
                        <b>"{alumno.seccion ? alumno.seccion : "No Asignado"}"</b> 
                    {/if}
                </div>

                <div class="w-full flex items-center justify-between px-4 py-2 text-[0.95rem]">
                    <div class="flex items-center justify-between gap-2">
                        <img src="{turnos}" alt="" class="icon">
                        <p class="font-semibold text-base-content/80">Turno</p> 
                    </div>

                    {#if editEscolares}
                        <label class="form-control">
                            <div class="label">
                                <span class="label-text">Turno</span>
                            </div>
                            <select name="turno" required>
                                <option disabled selected>Elegir</option>
                                <option value="Mañana">Mañana</option>
                                <option value="Tarde">Tarde</option>
                            </select>
                        </label>
                    {:else}
                        <b class="{alumno.turno ? alumno.turno === "Mañana" ? "text-orange-500" : "text-purple-600" : "No Asignado"}">{alumno.turno}</b> 
                    {/if}
                </div>
            </div>
        </form>  
    </div>

    <div class="w-full mt-4 flex flex-col lg:flex-row items-center lg:items-start justify-start gap-4">
        <div class="w-full lg:w-2/4 min-h-80 order-base-content/30 rounded-md p-4 bg-base-100 shadow-md animate-y">
            <div class="w-full h-max flex justify-between items-center ">
                <h3 class="text-xl font-bold">Grados Cursados</h3>
            </div>

            <div class="mt-4 max-h-80 overflow-y-auto">
                {#if grados_cursados && grados_cursados.length > 0}
                    {#each grados_cursados as gradoCursado}
                        <div class="w-full mb-6 {gradoCursado.grado.includes('Nivel') ? "bg-primary/10" : "bg-accent/10"}
                        min-h-16 rounded-xl py-3 px-6
                        flex items-center justify-between">
                            <div>
                                <b class="text-xl">{gradoCursado.grado}</b>
                                <p class="text-sm text-base-content/90">{gradoCursado.fecha}</p>
                            </div>

                            <div class="flex items-center justify-center gap-2 bg-success rounded-xl px-3 py-2 text-base-content">
                                <b class="">{gradoCursado.estado}</b>
                                <img src="{success_icon}" alt="" class="size-8 icon">
                            </div>
                        </div>
                    {/each}
                {:else}
                    <h1 class="text-2xl text-base-content/80">No existen grados cursados</h1>
                {/if}
            </div>
        </div>  

        <div class="w-full lg:w-2/4 min-h-80 order-base-content/30 rounded-md p-4 bg-base-100 shadow-md animate-y">
            <div>
                <h3 class="text-xl font-bold">Documentos</h3>
                <p class="text-sm text-base-content/60">Presione sobre un icono para editar el documento.</p>
            </div>

            <div class="mt-4 max-h-80 overflow-y-auto">
                <div class="w-full gap-4 grid grid-cols-1 lg:grid-cols-3">
                    {#each fileTypes as fileType}
                        {@const documento = documentos?.filter(i => { return i.tipo_documento === fileType; })[0] }

                        {#if fileType !== "foto_carnet"}
                            <Documento alumno={alumno} tipo_documento={fileType} documento={ documento ? documento : null }  />                               
                        {/if}
                    {/each}
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
        <h3 class="text-lg mt-2 font-bold">¿Seguro que retirar al Alumno del sistema?</h3>
        <p class="text-wrap text-sm">Una vez retirado, el alumno no podrá ser asignado a ningún grado ni sección, y sus datos serán cambiados al modo <i>sólo lectura.</i> </p>

        <div class="modal-container">
            <form action="?/retirar" method="POST" use:enhance class="h-auto w-full ">
                <input type="hidden" value="{alumno.cedula_escolar}" name="cedula_escolar">
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

<dialog id="create_representante_modal" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box relative
                sm:w-10/12 sm:max-w-lg overflow-hidden">

        <Alert form={createRepresentanteForm} styles="absolute top-4 left-3 w-3/4 text-sm" />

        <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            id="create_representante_close">✕</button>
        </form>

        <h3 class="text-lg mt-2 font-bold">Introduzca el número de cédula del Representante</h3>
        <p class="text-wrap text-sm">Para asociar un nuevo representante al alumno, introduzca su número de cédula y su relación o parentesco con el alumno</p>
        <p class="text-wrap text-xs mt-3"> <b>IMPORTANTE: </b> El representante debe estar registrado de antemano con sus datos dentro del sistema. En caso de no encontrarse registrado dirigirse a <b>Registrar Representante</b></p>

        <div class="modal-container">
            <form action="?/asociarRepresentante" method="POST" use:enhance class="h-auto w-full">
                <input type="hidden" value="{alumno.cedula_escolar}" name="cedula_escolar">
                
                <div class="w-full">
                    <div class="form-control w-2/4 h-full ">
                        <div class="label">
                            <span class="label-text font-bold">Cédula</span>
                        </div>
                        <input type="text" class="input input-bordered w-full input-sm" 
                        name="cedula_representante" placeholder="Representante...">
                    </div> 

                    <div class="form-control w-2/4 h-full mt-2">
                        <div class="label">
                            <span class="label-text font-bold">Parentesco/Relación al Alumno</span>
                        </div>
                        <input type="text" class="input input-bordered w-full input-sm" 
                        name="relacion" placeholder="Parentesco...">
                    </div> 
                </div>


                <button class="btn btn-success btn-sm mt-6">Asociar</button>
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