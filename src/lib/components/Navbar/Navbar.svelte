<script lang="ts">
    import {basePath} from "$lib"
    import type { Usuario } from "$lib/database/types";

    // Images Import
    import home_icon from "$lib/images/icons/home_icon.svg"
    import { adminRoutes, routes } from "./navbarItems";

    let { data }: { data: Omit<Usuario, "contraseña"> } = $props()
</script>

<nav class="*:h-screen shadow-sm border-r border-base-content/20 bg-transparent p-2 w-[18rem]  flex items-center justify-center">
    <div class="size-full">
        <ul class="items flex flex-col">
            <li class="mt-4">
                <img src="{home_icon}" alt="" class="icon">
                <a href="/">Inicio</a>
            </li>

            <!-- {#each routes as group}
                <h3>{group.name}</h3>

                {#each group.routes as route}
                    <li>
                        <img src="{route.icon}" alt="" class="icon">
                        <a href="{basePath}/{route.href}">{route.name}</a>
                    </li>                   
                {/each}
            {/each} -->
            
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
                <!-- {#each adminRoutes as group}
                    <h3>{group.name}</h3>
                    {#each group.routes as route}
                        <li>
                            <img src="{route.icon}" alt="" class="icon">
                            <a href="{basePath}/{route.href}">{route.name}</a>
                        </li>                   
                    {/each}
                {/each} -->
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
        @apply bg-base-300;
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