<script lang="ts">
    import { capitalizeFirstLetter } from "$lib/utils/capitlizeFirstLetter";
    import type { PageData } from "./$types";
    import stat_icon from "$lib/images/icons/add_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"


    let { data }: { data: PageData }= $props()
    let { usuario } = $derived(data)


</script>

<div class="size-full flex flex-col lg:flex-row items-start justify-start gap-2">
    <div class="w-full lg:w-3/4 h-full">
        <div class="flex justify-center bg-base-100 p-4 rounded-xl shadow-md animate-y" style="--delay: 220ms">
            <div class="flex flex-col items-center text-center gap-4 max-w-xl drop-shadow-sm">
                <span class="text-sm text-base-content/80">Bienvenido: <span class="text-accent">{capitalizeFirstLetter(usuario.role)}</span> <span class="text-primary">{usuario.nombre} {usuario.apellido}</span></span>
                <h1 class="text-3xl font-bold">The Intuitive Web Solutions<span class="loading loading-ring loading-xl"></span></h1>
                <span class="">
                    The future of the web is here. App Name is the solution for everyone who wants to
                    participate in the future of the web!
                </span>
                <div class="flex gap-4">
                    <a class="btn btn-primary">
                        Get started
                        <i class="fa-solid fa-arrow-right text-sm"></i>
                    </a>
                    <a class="btn btn-neutral">
                        See our blog
                        <i class="fa-solid fa-blog"></i>
                    </a>
                </div>
            </div>
        </div>

        <div class="w-full h-20 mt-3 hidden lg:flex items-center justify-start gap-4 animate-y" style="--delay: 400ms">
            {#each [1,2,3,4] as i}
                <div class="bg-base-100 w-1/4 h-full rounded-xl p-2 flex items-center justify-between gap-2">
                    <div class="h-full rounded-full bg-base-300 w-20 border border-base-content/20">
                        <img src="{stat_icon}" alt="" class="size-full icon">
                    </div>
                    <div class="w-3/4 h-full py-2">
                        <p class="text-base-content/60 text-sm">Titulo</p>
                        <b>Detalles</b>
                    </div>
                </div>               
            {/each}
        </div>
    </div>

    <div class="w-full h-full flex lg:w-1/4 flex-col gap-4 rounded-box bg-base-200 lg:max-w-sm p-6 shadow-md animate-x" style="--delay: 350ms">
        <!-- Header -->
        <div class="flex flex-col gap-4 items-center">
            <h1 class="font-bold text-xl">¿Necesita Ayuda?</h1>

            <span class="text-center text-sm">
                Aprende sobre los procedimientos, tutoriales, guías, entre otros.
                <a class="link link-accent">Vea la sección de ayuda</a> para aprender más.
            </span>
        </div>

        <!-- Body (Features) -->
        <div class="flex flex-col">
            <div class="divider mt-0"></div>

            <!-- Feature-->
            <div class="flex gap-8 items-center">
                <box-icon type='solid' name='universal-access'></box-icon>

                <div class="flex flex-col">
                    <h2 class="font-bold">Tutoriales</h2>
                    <span class="text-sm">Aprenda cómo usar el sistema mediante video tutoriales.</span>
                </div>
            </div>

            <div class="divider"></div>

            <!-- Feature-->
            <div class="flex gap-8 items-center">
                <box-icon type='solid' name='universal-access' t></box-icon>

                <div class="flex flex-col">
                    <h2 class="font-bold">Guias</h2>
                    <span class="text-sm">Ubique guías para cada caso de uso.</span>
                </div>
            </div>

            <div class="divider"></div>

            <!-- Feature-->
            <div class="flex gap-8 items-center">
                <i class="fa-solid fa-eye-slash fa-fw text-xl text-secondary"></i>

                <div class="flex flex-col">
                    <h2 class="font-bold">Manual de Usuario</h2>
                    <span class="text-sm">Visualice y descargue una copia en PDF del manual de usuario.</span>
                </div>
            </div>

            <div class="divider"></div>
        </div>
    </div>
</div>