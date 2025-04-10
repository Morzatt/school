<script lang="ts">
    import { basePath, formatStringWithDots } from '$lib';
    import type { ActionData, PageData } from './$types';
    import delete_icon from "$lib/images/icons/borrar_icon.svg"
    import user_icon from "$lib/images/icons/username_icon.svg"
    import camera_icon from "$lib/images/icons/camara_icon.svg"   
    import edit_icon from "$lib/images/icons/edit_icon.svg"
    import add_icon from "$lib/images/icons/add_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
    import ver_icon from "$lib/images/icons/details_icon.svg"
    import success_icon from "$lib/images/icons/success_icon.svg"
    import { enhance } from '$app/forms';

    let { data, form }: { data: PageData, form: ActionData } = $props();

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

    let { alumno, representantes, telefonos, familiares, grados_cursados } = $derived(data)

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
            value: `${formatStringWithDots(alumno.cedula_escolar)}`
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
            value: `${alumno.edad} Años`
        }
    ])
    let edicion = $state(false)

    import curso_actual from "$lib/images/icons/curso_actual.svg"
    import turnos from "$lib/images/icons/turnos_icon.svg"
    import seccion from "$lib/images/icons/seccion.svg"
    import DeleteRepresentanteModal from './DeleteRepresentanteModal.svelte';
    import Alert from '$lib/components/Messages/Alert.svelte';

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

    function filterCellphoneNumber(id: string): string[] | undefined {
        let n: string[] | undefined;
        telefonos?.forEach(i => 
            i.representante === id ? n = i.telefonos as string[] : null
        )
        return n
    }

    let editEscolares = $state(false)
    let nivel = $state('')

    function stripDots(inputString: string) {
        return inputString.replace(/\./g, '');
    }
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
            <div class="w-max p-5 flex items-center justify-center flex-col rounded-md bg-base-100 shadow-lg">
                <div class="size-fit relative">
                    <img src="{user_icon}" alt="" class="size-36 icon">
                    <button type="button" class="absolute bottom-1 right-1 size-7 flex items-center justify-center p-0.5
                    hover:bg-base-content/20 active:bg-base-content/10 rounded-md transition-all duration-200">
                        <img src="{camera_icon}" alt="" class="size-full icon">
                    </button>
                </div>
                <h3 class="font-bold text-lg mt-2">{alumno.primer_nombre} {alumno.segundo_nombre} {alumno.primer_apellido} {alumno.segundo_apellido}</h3>
                <h3 class="text-base-content/60 text-sm"> 
                    {
                        alumno.estado !== "Retirado" ?
                            alumno.nivel ? 
                            `Alumno de ${alumno.nivel === "Inicial" ? "Preescolar" : alumno.nivel}`
                            : "Nivel no asignado"
                        : "Alumno Retirado"} 
                </h3>
                <div class="w-full h-max shadow-md mt-4 rounded-md bg-base-300 flex items-center justify-between gap-3 px-4 py-2">
                    {#each [1,2,3,4] as i}
                        <button class="btn btn-circle btn-sm btn-neutral p-1 flex items-center justify-center hover:btn-info">
                            <img src="{camera_icon}" alt="" class="filter invert icon">
                        </button> 
                    {/each}
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
                            <b class="{field.name === "sexo" ? alumno.sexo === "Masculino" ? "text-blue-600" : "text-pink-600" : ""}">{field.value}</b> 
                        {/if}
                    </div>
                {/each}
            </div>
        </form>

        <div class="hidden lg:flex flex-1 min-h-72 rounded-md p-4 bg-base-100 shadow-md animate--x" style="--delay:150ms">

        </div>
    </div>

    <div class="w-full mt-4 flex flex-col lg:flex-row items-center justify-start gap-4">
        <div class="w-full lg:w-2/4 min-h-60 order-base-content/30 rounded-md p-4 bg-base-100 shadow-md animate--x" style="--delay:250ms">
            <div class="w-full h-max flex justify-between items-center ">
                <h3 class="text-xl font-bold">Representantes</h3>

                <button class="btn btn-circle btn-active btn-sm p-1 active:btn-primary group"
                onclick="{() => openModal(`create_representante_modal`)}">
                    <img src="{add_icon}" alt="" class="group-active:invert filter icon">
                </button>
            </div>

            <div class="mt-3 w-full">
                <div class="p-1 border-base-content/40 mb-1 font-bold
                            pb-1 bg-base-content text-base-100
                            px-2
                            w-full grid text-sm grid-cols-[3fr_4fr_3fr_2fr_2fr]">
                    <p>Cedula</p>
                    <p>Nombre</p>
                    <p>Relación</p>
                    <p>Ver</p>
                    <p>Eliminar</p>
                </div>
                {#if representantes && representantes.length > 0}
                    {#each representantes as representante}
                        <div class="p-1 w-full grid textsm grid-cols-[3fr_4fr_3fr_2fr_2fr]">
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
                        <RepresentanteModal representante={ representante } form={null} tel={filterCellphoneNumber(representante.cedula)}/>                           
                    {/each}
                {/if}
            </div>

            <div class="w-full h-max flex justify-between items-center mt-2">
                <h3 class="text-lg font-bold">Familiares</h3>
            </div>

            <div class="mt-2 w-full flex gap-2">
            </div>
        </div>

        <form action="?/editAula" method="POST" use:enhance class="w-full lg:w-2/4 min-h-60 shadow-md order-base-content/30 rounded-md p-4 bg-base-100 animate-x" style="--delay:250ms">
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

                            <a href="{basePath}/aulas/{alumno.id_grado}" class="btn btn-xs btn-square">
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
                        <b>"{alumno.turno ? alumno.turno : "No Asignado"}"</b> 
                    {/if}
                </div>
            </div>
        </form>  
    </div>

    <div class="w-full mt-4 flex items-center justify-start gap-4">
        <div class="w-full min-h-80 order-base-content/30 rounded-md p-4 bg-base-100 shadow-md animate-y">
            <div class="w-full h-max flex justify-between items-center ">
                <h3 class="text-xl font-bold">Grados Cursados</h3>

                <button class="btn btn-circle btn-active btn-sm p-1 active:btn-primary group" onclick="{() =>{edicion = !edicion;}}">
                    <img src="{edit_icon}" alt="" class="group-active:invert filter icon">
                </button>
            </div>

            <div class="mt-4 flex items-center justify-start w-full">
                {#if grados_cursados && grados_cursados.length > 0}
                    <ul class="timeline timeline-vertical w-full m-0 p-5 px-12 max-h-80 overflow-x-auto
                    timeline-snap-icon max-md:timeline-compact">
                        {#each grados_cursados as gradoCursado, i}
                            {#if i % 2}
                                <li>
                                    <hr class="bg-primary">
                                        <p class="timeline-start text-base-content/90">{gradoCursado.fecha}</p>
                                        <div class="timeline-middle">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                                class="h-5 w-5">
                                                <path
                                                fill-rule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                                clip-rule="evenodd" />
                                            </svg>
                                        </div>
                                        <div class="w-full {gradoCursado.grado.includes('Nivel') ? "bg-primary/10" : "bg-accent/10"}
                                        min-h-16 rounded-xl py-3 px-6 timeline-box timeline-end
                                        flex items-center justify-between">
                                            <div>
                                                <b class="text-xl">{gradoCursado.grado}</b>
                                            </div>

                                            <div class="flex items-center justify-center gap-2 {gradoCursado.estado === "En Curso" ? "bg-warning" : "bg-success"} rounded-xl px-3 py-2 text-neutral">
                                                <b class="">{gradoCursado.estado}</b>
                                                <img src="{success_icon}" alt="" class="size-8 icon">
                                            </div>
                                        </div>
                                    <hr class="bg-primary" />
                                </li>
                            {:else}
                                <li>
                                    <hr class="bg-primary">
                                        <p class="timeline-end text-base-content/90">{gradoCursado.fecha}</p>
                                        <div class="timeline-middle">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                                class="h-5 w-5">
                                                <path
                                                fill-rule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                                                clip-rule="evenodd" />
                                            </svg>
                                        </div>
                                        <div class="w-full {gradoCursado.grado.includes('Nivel') ? "bg-primary/10" : "bg-accent/10"}
                                        min-h-16 rounded-xl py-3 px-6 timeline-box timeline-start
                                        flex items-center justify-between">
                                            <div>
                                                <b class="text-xl">{gradoCursado.grado}</b>
                                            </div>

                                            <div class="flex items-center justify-center gap-2 {gradoCursado.estado === "En Curso" ? "bg-warning" : "bg-success"} rounded-xl px-3 py-2 text-neutral">
                                                <b class="">{gradoCursado.estado}</b>
                                                <img src="{success_icon}" alt="" class="size-8 icon">
                                            </div>
                                        </div>
                                    <hr class="bg-primary" />
                                </li>
                            {/if}
                        {/each}
                    </ul>
                {:else}
                    <h1 class="text-2xl text-base-content/80">No existen grados cursados</h1>
                {/if}
            </div>

            <!-- <div class="mt-4 max-h-80 overflow-y-auto">
                {#if grados_cursados && grados_cursados.length > 0}
                    {#each grados_cursados as gradoCursado}
                        <div class="w-full my-2 {gradoCursado.grado.includes('Nivel') ? "bg-primary/10" : "bg-accent/10"}
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
            </div> -->
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