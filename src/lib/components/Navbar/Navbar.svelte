<script lang="ts">
    import {basePath} from "$lib"
    import type { Usuario } from "$lib/database/types";

    // Images Import
    import home_icon from "$lib/images/icons/home_icon.svg"
    import menu_icon from "$lib/images/icons/menu_icon.svg"
    import user_icon from "$lib/images/icons/username_icon.svg"
    import logout_icon from "$lib/images/icons/logout_icon.svg"
    import admin_icon from "$lib/images/icons/admin_icon.svg"
    import administrar_usuario_icon from "$lib/images/icons/administrar_usuario_icon.svg"


    import { adminRoutes, routes } from "./navbarItems";
    import { capitalizeFirstLetter } from "$lib/utils/capitlizeFirstLetter";

    let { data }: { data: Omit<Usuario, "contraseña"> } = $props()

    let swtch = $state(false)
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
                <img src="{menu_icon}" alt="" class="filter group-active:invert">
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
        <li class="mt-4">
            <img src="{home_icon}" alt="" class="icon">
            <a href="/">Inicio</a>
        </li>
        
        <div class="join join-vertical w-full mt-4">
            {#each routes as group}
                <div tabindex="0" role="button" class="collapse collapse-arrow join-item border-base-content/40 border bg-transparent ">
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
                    <div tabindex="0" role="button" class="collapse collapse-arrow join-item border-base-content/40 border bg-transparent ">
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
        {/if}
    </ul>
{/snippet}

{#snippet itemsNormal()}
    <ul class="items hidden lg:flex flex-col pb-7 {swtch ? "" : "scale-0"} overflow-y-auto" style="scrollbar-width: thin;">
        <li class="mt-4 mb-4">
            <img src="{home_icon}" alt="" class="icon">
            <a href="/">Inicio</a>
        </li>
        

        {#each routes as group}
            <h2 class="font-bold">{group.name}</h2>

            <div class="join join-vertical w-full px-1 pt-2 pb-4">
                {#each group.routes as route}
                    <li class="join-item border border-base-content/40">
                        <img src="{route.icon}" alt="" class="icon">
                        <a href="{basePath}/{route.href}">{route.name}</a>
                    </li> 
                {/each}
            </div>
        {/each}

        {#if data.role.toLowerCase().includes('admin')}
            <div class="w-full mt-4">
                {#each adminRoutes as group}
                    <h2 class=" mb-2 font-bold">{group.name}</h2>

                    <div class="w-content w-full px-1 join join-vertical">
                        {#each group.routes as route}
                            <li class="join-item border border-base-content/40">
                                <img src="{route.icon}" alt="" class="icon">
                                <a href="{basePath}/{route.href}">{route.name}</a>
                            </li> 
                        {/each}
                    </div>
                {/each}
            </div>
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