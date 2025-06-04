<script lang="ts">
    import type { PageData } from './$types';
    import manual_icon from "$lib/images/icons/book-bookmark-svgrepo-com.svg"
    import alumnos_icon from "$lib/images/icons/student-svgrepo-com.svg"
    import representantes_icon from "$lib/images/icons/parent-and-child-svgrepo-com.svg"
    import empleados_icon from "$lib/images/icons/teacher-medium-dark-skin-tone-svgrepo-com.svg"
    import aulas_icon from "$lib/images/icons/desk-classroom-svgrepo-com.svg"

    let { data }: { data: PageData } = $props();
</script>

<div class="w-full animate-y">
    <div class="w-full bg-primary/20 rounded-md min-h-24 flex items-center justify-center">
        <div class="w-3/4 text-center py-8">
            <h1 class="text-6xl font-bold">Documentación</h1>
            <p class="text-lg">Guías y tutoriales completos paso a paso para aprender sobre RevApp.</p>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-2 mt-4 animate-y" style="--delay: 100ms">
        <a href="/settings/ayuda/manual" class="border border-base-content/50 min-h-40 flex flex-col items-center justify-center text-center
        p-4
        hover:shadow-md hover:bg-base-100/20 hover:rounded-md hover:cursor-pointer
        transition-all duration-200 ease-in-out">
            <img src="{manual_icon}" alt="" class="size-[50%] icon">
            <h2 class="text-primary font-bold text-2xl">Manual de Usuario</h2>
            <h2 class="text-base-content/70 text-sm">Revise el Manual de Usuario de la aplicación, aprenda sobre los módules y descargue una copia PDF.</h2>
        </a> 

        <button class="border border-base-content/50 min-h-40 flex flex-col items-center justify-center text-center
        p-4
        hover:shadow-md hover:bg-base-100/20 hover:rounded-md hover:cursor-pointer
        transition-all duration-200 ease-in-out">
            <img src="{alumnos_icon}" alt="" class="size-[50%]">
            <h2 class="text-primary font-bold text-2xl">Alumnos</h2>
            <h2 class="text-base-content/70 text-sm">Aprenda a crear, administrar, actualizar y gestionar alumnos, junto a su información relacionada.</h2>
        </button> 

        <button class="border border-base-content/50 min-h-40 flex flex-col items-center justify-center text-center
        p-4
        hover:shadow-md hover:bg-base-100/20 hover:rounded-md hover:cursor-pointer
        transition-all duration-200 ease-in-out">
            <img src="{representantes_icon}" alt="" class="size-[50%] icon">
            <h2 class="text-primary font-bold text-2xl">Representantes</h2>
            <h2 class="text-base-content/70 text-sm">Aprenda sobre la administración de representantes y la gestión de información de contacto.</h2>
        </button> 

        <button class="border border-base-content/50 min-h-40 flex flex-col items-center justify-center text-center
        p-4
        hover:shadow-md hover:bg-base-100/20 hover:rounded-md hover:cursor-pointer
        transition-all duration-200 ease-in-out">
            <img src="{empleados_icon}" alt="" class="size-[50%]">
            <h2 class="text-primary font-bold text-2xl">Empleados y Docentes</h2>
            <h2 class="text-base-content/70 text-sm">Aprenda sobre la administración de empleados, docentes y especializaciones.</h2> 
        </button> 

        <button class="border border-base-content/50 min-h-40 flex flex-col items-center justify-center text-center
        p-4
        hover:shadow-md hover:bg-base-100/20 hover:rounded-md hover:cursor-pointer
        transition-all duration-200 ease-in-out">
            <img src="{aulas_icon}" alt="" class="size-[50%]">
            <h2 class="text-primary font-bold text-2xl">Aulas y Grados</h2>
            <h2 class="text-base-content/70 text-sm">Aprenda sobre las aulas y grados escolares, la promoción de alumnos, la creación y administración de horarios, entre otras cosas.</h2> 
        </button> 
    </div>
</div>