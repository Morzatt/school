<script lang="ts">
    import {basePath} from "$lib"
    import type { Usuario } from "$lib/database/types";

    // Images Import
    import home_icon from "$lib/images/icons/home_icon.svg"
    import personalizar_icon from "$lib/images/icons/personalizar_icon.svg"
    import menu_icon from "$lib/images/icons/menu_icon.svg"
    import user_icon from "$lib/images/icons/username_icon.svg"
    import logout_icon from "$lib/images/icons/logout_icon.svg"
    import admin_icon from "$lib/images/icons/admin_icon.svg"
    import administrar_usuario_icon from "$lib/images/icons/administrar_usuario_icon.svg"


    import { adminRoutes, routes } from "./navbarItems";
    import { capitalizeFirstLetter } from "$lib/utils/capitlizeFirstLetter";

    let { data }: { data: Omit<Usuario, "contraseña"> } = $props()

    let swtch = $state(false)

    let look = {
        icon: personalizar_icon,
        href: "settings/look",
        name: "Personalización"
    }
</script>

{#snippet drawer()}
    <div class="lg:hidden drawer drawer-end h-fit w-full">
        <input id="side-drawer" type="checkbox" class="drawer-toggle" />

        <div class="drawer-content w-full px-5 flex items-center justify-between">
            <!-- Page content here -->
            <label class="swap swap-rotate">
                <!-- this hidden checkbox controls the state -->
                <input type="checkbox" class="theme-controller" value="dark" />

                <!-- sun icon -->
                <svg
                    class="swap-off size-7 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24">
                    <path
                    d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                </svg>

                <!-- moon icon -->
                <svg
                    class="swap-on size-7 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24">
                    <path
                    d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                </svg>
            </label> 

            <label for="side-drawer" class="transition-all duration-200 ease-in-out 
                    p-1 rounded-lg group">
                <img src="{menu_icon}" alt="" class="filter group-active:invert icon">
            </label>
        </div>

        <div class="drawer-side z-50">
            <label for="side-drawer" aria-label="close sidebar" class="drawer-overlay overflow-hidden"></label>

            <div class="bg-base-100 min-h-full p-2">

                <div class="text-sm flex items-center justify-start px-6 gap-2 mt-4 bg-base-300 py-1 rounded-md">
                    <span class="*:flex *:items-center *:justify-start *:gap-2">
                        <p> {data.nombre} {data.apellido} </p>
                        <b>
                            { capitalizeFirstLetter(data.role)}
                            <img src="{data.role.includes("admin")  ? admin_icon : user_icon}" alt="" class="size-fit">
                        </b>
                    </span>
                </div>

                <ul class="items flex flex-col ">
                    <li class="mt-5">
                        <img src="{home_icon}" alt="" class="icon">
                        <a href="/" onclick="{() => {document.getElementById("side-drawer")?.click()}}">Inicio</a>
                    </li>
                    

                    {#each routes as group}
                        <h3 class="text-sm font-medium">{group.name}</h3>
                        <div class="join join-vertical">
                            {#each group.routes as route}
                                <li class="join-item border border-base-content/30">
                                    <img src="{route.icon}" alt="" class="icon">
                                    <a href="{basePath}/{route.href}" onclick="{() => {document.getElementById("side-drawer")?.click()}}">{route.name}</a>
                                </li> 
                            {/each}
                        </div>
                    {/each}


                    {#if data.role.toLowerCase() === "administrador" || data.role.toLowerCase() === "admin" || data.role.toLocaleLowerCase() == "superadmin"}
                        {#each adminRoutes as group}
                            <h3 class="text-sm font-medium">{group.name}</h3>

                            <div class="join join-vertical">
                                {#each group.routes as route}
                                    <li class="join-item border border-base-content/30">
                                        <img src="{route.icon}" alt="" class="icon">
                                        <a href="{basePath}/{route.href}" onclick="{() => {document.getElementById("side-drawer")?.click()}}">{route.name}</a>
                                    </li> 
                                {/each}
                                <li class="join-item border border-base-content/30">
                                    <img src="{administrar_usuario_icon}" alt="">
                                    <a href="{basePath}/settings/account" onclick="{() => {document.getElementById("side-drawer")?.click()}}">Mi Usuario</a>
                                </li>
                            </div>
                        {/each}
                    {:else}
                        <li class="mt-5">
                            <img src="{look.icon}" alt="" class="icon">
                            <a href="/{look.href}" onclick="{() => {document.getElementById("side-drawer")?.click()}}">{look.name}</a>
                        </li>
                    {/if}

                    <li class="border-t border-base-300 mt-1.5 text-red-500">
                        <img src="{logout_icon}" alt="" class="red-filter">
                        <a href="{basePath}/logout" class="m-1.5" onclick="{() => {document.getElementById("side-drawer")?.click()}}">Cerrar Sesión</a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
{/snippet}

{#snippet items()}
    <ul class="items hidden lg:flex flex-col">
        
        <li class="mt-4 bg-base-300/80 border border-base-content/40">
            <img src="{home_icon}" alt="" class="icon">
            <a href="/">Inicio</a>
        </li>
        
        <div class="join join-vertical w-full mt-4">
            {#each routes as group}
                <div tabindex="0" role="button" class="collapse bg-base-300/80 shadow-md collapse-arrow join-item border-base-content/40 border">
                    <input type="radio" name="my-accordion-3" checked="{false}"/>
                    <div class="collapse-title text-sm font-medium">{group.name}</div>

                    <div class="collapse-content w-full px-1">
                        {#each group.routes as route}
                            <li>
                                <img src="{route.icon}" alt="" class="icon">
                                <a href="{basePath}/{route.href}">{route.name}</a>
                            </li> 
                        {/each}
                    </div>
                </div>  
            {/each}
        </div>

        {#if data.role.toLowerCase() === "administrador" || data.role.toLowerCase() === "admin" || data.role.toLocaleLowerCase() == "superadmin"}
            <div class="join join-vertical w-full mt-4">
                {#each adminRoutes as group}
                    <div tabindex="0" role="button" class="collapse collapse-arrow join-item border-base-content/40 border bg-base-300/80">
                        <input type="radio" name="my-accordion-3" checked="{false}"/>
                        <div class="collapse-title text-sm font-medium">{group.name}</div>

                        <div class="collapse-content w-full px-1">
                            {#each group.routes as route}
                                <li>
                                    <img src="{route.icon}" alt="" class="icon">
                                    <a href="{basePath}/{route.href}">{route.name}</a>
                                </li> 
                            {/each}
                        </div>
                    </div>  
                {/each}
            </div>
        {:else}
            <li class="mt-5">
                <img src="{look.icon}" alt="" class="icon">
                <a href="/{look.href}">{look.name}</a>
            </li>
        {/if}
    </ul>
{/snippet}

<!-- lg:w-18 -->
<nav class="h-16 w-full
            lg:h-screen lg:w-[16rem]
            transition-all duration-200 ease-out
            flex items-center justify-center
            shadow-sm border-b lg:border-r border-base-content/30 bg-transparent
            p-2">

    <!-- <div class="hidden lg:flex
                size-fit lg:h-screen 
                max-lg:items-center max-lg:justify-center
                {swtch ? "border-r pr-3" : ""} border-base-content/40">
        <button class="btn btn-sm mt-4"
        onclick={() => {swtch = !swtch}}>
            <img src="{menu_icon}" alt="" class="icon">
        </button>
    </div> -->

    <div class="max-lg:w-full lg:h-screen
                transition-all ease-in-out duration-200
                flex max-lg:items-center max-lg:justify-end">
        {@render drawer()}
        {@render items()}
    </div>
</nav>

<style lang="postcss">
    .items li {
        @apply w-full flex items-center justify-start py-2 px-2 rounded-md text-sm gap-1;
    }
    .items h3 {
        @apply mt-4 my-1;
    }
    .items li:hover {
        @apply bg-base-content/10;
    }
    .items li:active {
        @apply bg-base-200;
    }
    .items li img {
        @apply size-6 p-0.5;
    }
    .items li a {
        @apply size-full;
    }
</style>





<!-- <aside class="flex">
    <div class="flex flex-col items-center w-16 h-screen py-8 bg-white dark:bg-gray-900 dark:border-gray-700">
        <nav class="flex flex-col items-center flex-1 space-y-8 ">
            <a href="#">
                <img class="w-auto h-6" src="https://merakiui.com/images/logo.svg" alt="">
            </a>

            <a href="#" class="p-1.5 inline-block text-gray-500 focus:outline-nones transition-colors duration-200 rounded-lg dark:text-gray-400 dark:hover:bg-gray-800 hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
            </a>

            <a href="#" class="p-1.5 inline-block text-blue-500 transition-colors duration-200 bg-blue-100 rounded-lg dark:text-blue-400 dark:bg-gray-800">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
            </a>

            <a href="#" class="p-1.5 inline-block text-gray-500 focus:outline-nones transition-colors duration-200 rounded-lg dark:text-gray-400 dark:hover:bg-gray-800 hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
                </svg>
            </a>

            <a href="#" class="p-1.5 inline-block text-gray-500 focus:outline-nones transition-colors duration-200 rounded-lg dark:text-gray-400 dark:hover:bg-gray-800 hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
            </a>

            <a href="#" class="p-1.5 inline-block text-gray-500 focus:outline-nones transition-colors duration-200 rounded-lg dark:text-gray-400 dark:hover:bg-gray-800 hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </a>
        </nav>

        <div class="flex flex-col items-center mt-4 space-y-4">
            <a href="#">
                <img class="object-cover w-8 h-8 rounded-lg" src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&h=634&q=80" alt="avatar" />
            </a>

            <a href="#" class="text-gray-500 transition-colors duration-200 rotate-180 dark:text-gray-400 rtl:rotate-0 hover:text-blue-500 dark:hover:text-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
            </a>
        </div>
    </div>
    
    <div class="h-screen px-5 py-8 overflow-y-auto bg-white border-l border-r sm:w-64 w-60 dark:bg-gray-900 dark:border-gray-700">
        <div class="relative">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg class="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none">
                    <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
            </span>

            <input type="text" class="w-full py-1.5 pl-10 pr-4 text-gray-700 bg-white border rounded-md dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring" placeholder="Search" />
        </div>

        <nav class="mt-4 -mx-3 space-y-6 ">
            <div class="space-y-3 ">
                <label class="px-3 text-xs text-gray-500 uppercase dark:text-gray-400">analytics</label>

                <a class="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700" href="#">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
                    </svg>

                    <span class="mx-2 text-sm font-medium">Dashboard</span>
                </a>

                <a class="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700" href="#">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
                    </svg>

                    <span class="mx-2 text-sm font-medium">Preformance</span>
                </a>
            </div>

            <div class="space-y-3 ">
                <label class="px-3 text-xs text-gray-500 uppercase dark:text-gray-400">content</label>

                <a class="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700" href="#">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>

                    <span class="mx-2 text-sm font-medium">Guides</span>
                </a>

                <a class="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700" href="#">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                    </svg>

                    <span class="mx-2 text-sm font-medium">Hotspots</span>
                </a>

                <a class="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700" href="#">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                    </svg>

                    <span class="mx-2 text-sm font-medium">Checklists</span>
                </a>
            </div>

            <div class="space-y-3 ">
                <label class="px-3 text-xs text-gray-500 uppercase dark:text-gray-400">Customization</label>

                <a class="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700" href="#">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" />
                    </svg>

                    <span class="mx-2 text-sm font-medium">Themes</span>
                </a>

                <a class="flex items-center px-3 py-2 text-gray-600 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700" href="#">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>

                    <span class="mx-2 text-sm font-medium">Setting</span>
                </a>
            </div>
        </nav>
    </div>
</aside> -->