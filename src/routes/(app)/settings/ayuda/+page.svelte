<script lang="ts">
    import type { PageData } from './$types';
    import manual_icon from "$lib/images/icons/book-bookmark-svgrepo-com.svg"
    import alumnos_icon from "$lib/images/icons/student-svgrepo-com.svg"
    import representantes_icon from "$lib/images/icons/parent-and-child-svgrepo-com.svg"
    import empleados_icon from "$lib/images/icons/teacher-medium-dark-skin-tone-svgrepo-com.svg"
    import aulas_icon from "$lib/images/icons/desk-classroom-svgrepo-com.svg"
    import personalizacion_icon from "$lib/images/icons/art-palette-svgrepo-com.svg"
    import chevron_left from "$lib/images/icons/chevron_left.svg"
    import { enhance } from '$app/forms';

    let { data }: { data: PageData } = $props();

    type ContentTypes = "menu" | "alumnos" | "representantes" | "empleados" | "aulas" | "personalizacion"
    let content: ContentTypes = $state('menu')

    type SectionItems = {
        title: string, 
        description: string | undefined,
        video: string
    };

    type Section = {
        title: string,
        items: SectionItems[]
    };

    const AlumnosSection: Section = {
        title: "Alumnos",
        items: [
            {
                title: "Creación de Alumnos",
                description: "Aprenda a registrar nuevos alumnos de forma rápida y sencilla. Este tutorial le guiará paso a paso para añadir la información esencial de cada estudiante y tenerla disponible al instante.",
                video: "/tutoriales/CrearAlumno.mp4"
            },
            {
                title: "Generación de Constancias",
                description: "Descubre cómo generar rápidamente constancias de estudio, buena conducta y otros documentos importantes. Este tutorial te muestra el proceso para obtener la certificación que necesitas en pocos clics.",
                video: "/tutoriales/ConstanciasAlumnos.mp4"
            },
            {
                title: "Actualización de Documentos",
                description: "Aprende a subir y actualizar documentos importantes de tus alumnos en la aplicación. Este tutorial te guía para mantener expedientes completos y siempre al día..",
                video: "/tutoriales/ActualizarDocumentosAlumnos.mp4"
            },
            {
                title: "Asignar Aula a Alumnos",
                description: "Descubre cómo asignar alumnos a sus aulas en la aplicación. Este tutorial te guía para organizar a tus estudiantes de forma eficiente y mantener tus grupos actualizados.",
                video: "/tutoriales/AsignarAula.mp4"
            },
        ]
    }

    const EmpleadosSection: Section = {
        title: "Empleados",
        items: [
            {
                title: "Creación de Empleados",
                description: "Aprende a registrar nuevos empleados en la aplicación. Este tutorial te muestra cómo ingresar su información de forma rápida y sencilla para mantener tu equipo al día.",
                video: "/tutoriales/CrearEmpleado.mp4"
            },
        ]
    }

    const RepresentantesSection: Section = {
        title: "Representantes",
        items: [
            {
                title: "Creación de Representantes",
                description: "Aprende a registrar nuevos representantes en la aplicación. Este tutorial te guía paso a paso para añadir su información de contacto y mantener todos los datos importantes organizados.",
                video: "/tutoriales/CrearRepresentante.mp4"
            },
        ]
    }

    const AulasSection: Section = {
        title: "Aulas",
        items: [
            {
                title: "Creación de Aulas, Asignaturas y Horarios",
                description: "Descubre cómo crear y organizar aulas, definir asignaturas y establecer horarios en la aplicación. Este tutorial te guía para estructurar tu planificación académica de forma eficiente y sencilla.",
                video: "/tutoriales/AulasMateriasHorarios.mp4"
            },
            {
                title: "Promover Alumnos de Aula",
                description: "Aprende a promover alumnos al siguiente grado en la aplicación. Este tutorial te guía a través del proceso para actualizar el nivel académico de tus estudiantes de forma rápida y sencilla.",
                video: "/tutoriales/PromoverAlumnos.mp4"
            },
        ]
    }

    const PersonalizacionSection: Section = {
        title: "Personalizacion",
        items: [
            {
                title: "Cambio de Tema",
                description: "Aprende a cambiar el tema y la paleta de colores de tu aplicación. Este tutorial te muestra cómo personalizar la apariencia para ajustarla a tus preferencias o identidad visual.",
                video: "/tutoriales/personalizacion.mp4"
            },
        ]
    }
</script>

{#snippet videoPlayer(id: string, source: string, title: string)}
    <dialog id="{id}_modal" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box relative
                    sm:w-full sm:max-w-3xl overflow-hidden">

            <form method="dialog">
                <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                id="{id}_modal">✕</button>
            </form>

            <h2 class="font-bold text-xl">{title}</h2>

            <div class="modal-container">
                <div class="w-full">
                    <div class="h-fit w-full relative rounded-md border-2 border-base-content bg-transparent">
                        <div class="w-full h-fit border-b-2 border-inherit">
                            <div class="w-fit gap-2 h-[fit] bg-inherit flex items-center justify-start p-1 select-none rounded-md">
                                <b class="size-5 rounded-full bg-red-600"></b>
                                <b class="size-5 rounded-full bg-yellow-500"></b>
                                <b class="size-5 rounded-full bg-green-600"></b>
                            </div>
                        </div>
                        <div class="w-full h-[13rem] min-[370px]:h-[15rem] min-[480px]:h-[17rem] min-[580px]:h-[19rem] min-[680px]:h-[22rem] md:h-[24rem] min-[860px]:h-[26rem] lg:h-[20rem] p-1 flex flex-col items-center justify-center 
                                transition-all duration-100 ease-linear text-white">
                            <iframe src="{source}" width="100%" height="100%" allow="autoplay" title="project-video" class="rounded-md"></iframe>
                        </div>
                    </div>
                </div>
            </div>
    </dialog>
{/snippet}

{#snippet section(info: Section)}
   <div class="w-full animate-y">
        <div class="min-h-8 my-4 w-full flex gap-4 items-center">
            <button class="btn btn-square btn-secondary btn-sm" onclick={() => { content = "menu" }}>
                <img src="{chevron_left}" alt="" class="icon size-8 filter invert">
            </button>
            <h1 class="font-bold text-4xl">{info.title}</h1>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 animate--x pb-12 px-4" style="--delay: 400ms">
            {#each info.items as item}
                {@const itemId = item.title.toLocaleLowerCase().replaceAll(' ', '')}

                <button class="border border-base-content rounded-lg p-3 shadow-[5px_5px] bg-base-100/40
                hover:bg-base-100 hover:shadow-[1px_1px] hover:cursor-pointer hover:scale-95
                transition-all duration-300 ease-in-out"
                onclick={() => { document.getElementById(`${itemId}_modal`).showModal(); }}>
                    <h1 class="font-bold text-xl">{item.title}</h1>                   
                    <p class="text-base-content/70 text-sm">{item.description}</p>
                </button>

                {@render videoPlayer(itemId, item.video, item.title)}
            {/each}
        </div>
   </div> 
{/snippet}

<div class="w-full animate-y">
    <div class="w-full bg-gradient-to-br from-primary to-accent rounded-md min-h-24 flex items-center justify-center
    p-6 text-white shadow-lg gap-2 relative overflow-hidden">

        <div class="w-3/4 text-center py-8">
            <h1 class="text-6xl font-bold">Documentación</h1>
            <p class="text-lg">Guías y tutoriales completos paso a paso para aprender sobre RevApp.</p>
        </div>
    </div>

    {#if content === "menu"}
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-2 mt-4 animate-y" style="--delay: 100ms">
            <a href="/settings/ayuda/manual" class="border border-base-content/50 min-h-40 flex flex-col items-center justify-center text-center
            p-4 hover:scale-95
            hover:shadow-md hover:bg-base-100/20 hover:rounded-md hover:cursor-pointer
            transition-all duration-200 ease-in-out">
                <img src="{manual_icon}" alt="" class="size-[50%] icon">
                <h2 class="text-primary font-bold text-2xl">Manual de Usuario</h2>
                <h2 class="text-base-content/70 text-sm">Revise el Manual de Usuario de la aplicación, aprenda sobre los módules y descargue una copia PDF.</h2>
            </a> 

            <button class="border border-base-content/50 min-h-40 flex flex-col items-center justify-center text-center
            p-4 hover:scale-95
            hover:shadow-md hover:bg-base-100/20 hover:rounded-md hover:cursor-pointer
            transition-all duration-200 ease-in-out" onclick={() => { content = "alumnos" }}>
                <img src="{alumnos_icon}" alt="" class="size-[50%]">
                <h2 class="text-primary font-bold text-2xl">Alumnos</h2>
                <h2 class="text-base-content/70 text-sm">Aprenda a crear, administrar, actualizar y gestionar alumnos, junto a su información relacionada.</h2>
            </button> 

            <button class="border border-base-content/50 min-h-40 flex flex-col items-center justify-center text-center
            p-4 hover:scale-95
            hover:shadow-md hover:bg-base-100/20 hover:rounded-md hover:cursor-pointer
            transition-all duration-200 ease-in-out" onclick={() => { content = "representantes" }}>
                <img src="{representantes_icon}" alt="" class="size-[50%] icon">
                <h2 class="text-primary font-bold text-2xl">Representantes</h2>
                <h2 class="text-base-content/70 text-sm">Aprenda sobre la administración de representantes y la gestión de información de contacto.</h2>
            </button> 

            <button class="border border-base-content/50 min-h-40 flex flex-col items-center justify-center text-center
            p-4 hover:scale-95
            hover:shadow-md hover:bg-base-100/20 hover:rounded-md hover:cursor-pointer
            transition-all duration-200 ease-in-out" onclick={() => { content = "empleados" }}>
                <img src="{empleados_icon}" alt="" class="size-[50%]">
                <h2 class="text-primary font-bold text-2xl">Empleados y Docentes</h2>
                <h2 class="text-base-content/70 text-sm">Aprenda sobre la administración de empleados, docentes y especializaciones.</h2> 
            </button> 

            <button class="border border-base-content/50 min-h-40 flex flex-col items-center justify-center text-center
            p-4 hover:scale-95
            hover:shadow-md hover:bg-base-100/20 hover:rounded-md hover:cursor-pointer
            transition-all duration-200 ease-in-out" onclick={() => { content = "aulas" }}>
                <img src="{aulas_icon}" alt="" class="size-[50%]">
                <h2 class="text-primary font-bold text-2xl">Aulas y Grados</h2>
                <h2 class="text-base-content/70 text-sm">Aprenda sobre las aulas y grados escolares, la promoción de alumnos, la creación y administración de horarios, entre otras cosas.</h2> 
            </button> 

            <button class="border border-base-content/50 min-h-40 flex flex-col items-center justify-center text-center
            p-4 hover:scale-95
            hover:shadow-md hover:bg-base-100/20 hover:rounded-md hover:cursor-pointer
            transition-all duration-200 ease-in-out" onclick={() => { content = "personalizacion" }}>
                <img src="{personalizacion_icon}" alt="" class="size-[50%]">
                <h2 class="text-primary font-bold text-2xl">Personalización</h2>
                <h2 class="text-base-content/70 text-sm">Aprenda sobre las opciones de personalización y temas de la aplicación.</h2> 
            </button> 
        </div>       
    {:else if content === "alumnos"}
        {@render section(AlumnosSection)}
    {:else if content === "empleados"}
        {@render section(EmpleadosSection)}
    {:else if content === "representantes"}
        {@render section(RepresentantesSection)}
    {:else if content === "aulas"}
        {@render section(AulasSection)}
    {:else if content === "personalizacion"}
        {@render section(PersonalizacionSection)}
    {/if}
</div>


<style lang="postcss">
    .create-section {
        @apply w-full h-max
            my-4 p-2
            border border-base-content/30 rounded-md
            grid 
            grid-cols-1 text-center;
    }

    .create-section h3 {
        @apply text-wrap text-center font-semibold text-lg mb-1 pb-1 border-b border-base-content/30; 
    }
    
    .create-form {
        @apply w-full flex flex-wrap gap-4;
    }


    .modal-box {
        @apply border border-base-content/80
        sm:w-10/12  overflow-hidden;
    }          
    .modal-container {
        @apply flex mt-3 max-h-[30rem] overflow-y-auto overflow-x-hidden;
        scrollbar-width: thin;
    }

    .input, .select {
        @apply relative border;
    }

    .input {
        @apply bg-base-100 focus:outline-0 py-2 rounded-md;
    }

    select {
        @apply btn btn-sm hover:border-base-content/30 hover:border focus:outline-0;
    }
</style>