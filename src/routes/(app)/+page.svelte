<script lang="ts">
    import type { PageData } from "./$types";

    let { data }: { data: PageData }= $props()
    let { usuario } = $derived(data)

    import illustration from "$lib/images/usuario_login_ilustration.png"
</script>

<div class="size-full flex items-center justify-center *:h-full p-2">
    <div class="bb w-3/4">

    </div>

    <div class="w-1/4">
        <div class=" bg-base-200 rounded-lg h-2/3 p-3">
            <div class="text-2xl flex flex-col items-center justify-center">
                <span>¡Bienvenido! </span>
                <b class="w-fit flex items-center justify-center flex-col mt-1">
                    <span>{usuario.nombre} {usuario.apellido}</span>
                    <span class="text-base-content/40 text-base">{usuario.usuario}</span> 
                </b>

                <div class="w-full">
                    <img src="{illustration}" alt="" class=" scale-125">
                </div>
            </div>
        </div>
    </div>
</div>