<script lang="ts">
    import type { ActionData, PageData } from "./$types";
    import read_icon from "$lib/images/icons/read_icon.svg"
    import write_icon from "$lib/images/icons/write_icon.svg"
    import { enhance } from "$app/forms";
    import Alert from "$lib/components/Messages/Alert.svelte";
    import { capitalizeFirstLetter } from "$lib/utils/capitlizeFirstLetter";

    let { data, form }: { data: PageData, form: ActionData } = $props();
    let { usuarios } = $derived(data)

    function asignColor(status: "Activo" | "Bloqueado"): string {
        switch (status) {
            case "Activo": 
                return "text-green-800 bg-green-100"
            case "Bloqueado":
                return "text-red-800 bg-red-100"
            default: 
                return "text-yellow-700 bg-yellow-100"
        }
    }
    function asignColorInverted(status: "Activo" | "Bloqueado") {
        switch (status) {
            case "Activo": 
                return "text-red-800 bg-red-100"
            case "Bloqueado":
                return "text-green-800 bg-green-100"
            default: 
                return "text-yellow-700 bg-yellow-100"
        }
    }

    function asignRange(role: string) {
        switch (role) {
            case "admin":
                return 1
            case "administrador": 
                return 1
            case "superadmin":
                return 2
            default: 
                return 0    
        }
    }

    function submitForm(formId: string) {
        let formElement = document.getElementById(formId) as HTMLFormElement
        formElement.submit()
    }

    function checkRoles(usuario: string) {
        let submitButton = document.getElementById(`${usuario}_role_submit`) as HTMLButtonElement
        let input = document.getElementById(`${usuario}_role_input`) as HTMLInputElement
        let form = document.getElementById(`${usuario}_role_form`) as HTMLFormElement 
        
        if(asignRange(input.value.toLowerCase()) >= usuarioRange) {
            form.action = ""
            form.method = ""
            submitButton.classList.add("btn-disabled")
        }
    }

    let usuarioRange = asignRange(data.usuario.role)
</script>

<div class="relative">
    <Alert form={ form } styles="absolute right-3 top-3 max-w-sm"/>
    <h1 class="text-xl">Administrar Usuarios y Permisos</h1>

    <div class="w-5/6 mt-6 h-max flex flex-col p-2 gap-2">
        {#if usuarios}
            {#each usuarios as usuario}
                {#if usuario.usuario !== data.usuario.usuario} <!-- if user is not the same -->
                    {#if usuario.role !== "superadmin"} <!-- if user is not super admin-->
                        {#if usuarioRange > usuario.range}
                            <div class="collapse collapse-plus bg-base-200 border border-base-content/20">
                                <input type="radio" name="users-accordion"/>

                                <div class="collapse-title grid grid-cols-4 gap-6">
                                    <div>
                                        <p>{usuario.nombre} {usuario.apellido}</p>
                                        <p class="text-sm text-gray-600">{usuario.usuario}</p>
                                    </div>
                                    <div class="text-sm flex flex-col items-start justify-center">
                                        <p>{capitalizeFirstLetter(usuario.role)}</p>
                                        <p class="{asignColor(usuario.estado)} font-bold w-fit px-4 rounded-md">{usuario.estado}</p>
                                    </div>
                                    <div>
                                        <p class="text-sm">Fecha de creacion: {new Date(usuario.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>

                                <div class="collapse-content flex items-center justify-start gap-4">
                                    <!-- Permisos -->
                                    <div class="border-x border-x-base-content/30 px-4">
                                        <h3 class="text-sm">Permisos</h3>

                                        <div class="flex gap-8">
                                            <div class="form-control w-fit">
                                                <label class="cursor-pointer label">
                                                    <div class="mr-3">
                                                        <p class="label-text">Leer</p>
                                                        <img src="{read_icon}" alt="">
                                                    </div>
                                                    <form action="?/read" method="POST" use:enhance id="{usuario.usuario}_read_form">
                                                        <input type="hidden" value={usuario.usuario} name="usuario">
                                                        <input 
                                                            type="checkbox" 
                                                            name="read"
                                                            checked="{usuario.read}"
                                                            onclick="{() => {submitForm(`${usuario.usuario}_read_form`)}}"
                                                            class="checkbox checkbox-success" />
                                                    </form>
                                                </label>
                                            </div>

                                            <div class="form-control w-fit">
                                                <label class="cursor-pointer label">
                                                    <div class="mr-3">
                                                        <p class="label-text">Editar</p>
                                                        <img src="{write_icon}" alt="">
                                                    </div>

                                                    <form action="?/write" method="POST" use:enhance id="{usuario.usuario}_write_form">
                                                        <input type="hidden" value={usuario.usuario} name="usuario">
                                                        <input 
                                                            type="checkbox"
                                                            name="write"
                                                            checked="{usuario.write}"
                                                            onclick="{() => {submitForm(`${usuario.usuario}_write_form`)}}"
                                                            class="checkbox checkbox-success"/>
                                                    </form>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Rol -->
                                    <div class="border-none border-x-base-content/30 px-2 h-full">
                                        <h3 class="text-sm">Rol de Usuario</h3>

                                        <form action="?/role" method="POST" use:enhance class="flex mt-2 items-center gap-1" id="{usuario.usuario}_role_form">
                                            <input type="hidden" name="usuario" value="{usuario.usuario}">
                                            <input type="text" name="role"
                                            class="w-full h-full p-2 
                                            bg-transparent border border-base-content/30 
                                            focus:outline-0 input-sm rounded-md"
                                            oninput="{() => checkRoles(`${usuario.usuario}`)}"
                                            id="{usuario.usuario}_role_input"
                                            placeholder="{capitalizeFirstLetter(usuario.role)}">

                                            <button id="{usuario.usuario}_role_submit" type="submit" class="btn btn-sm btn-primary h-full">Cambiar</button>
                                        </form >
                                    </div>

                                    <!-- Bloq -->
                                    <div class="border-x border-x-base-content/30 px-4 h-full">
                                        <h3 class="text-sm">Bloquear/Desbloquear</h3>

                                        <form action="?/status" method="POST" use:enhance>
                                            <input type="hidden" name="usuario" value="{usuario.usuario}">
                                            <input type="hidden" name="estado" value="{usuario.estado === "Activo" ? "Bloqueado" : "Activo"}">
                                            <button type="submit" class="btn btn-sm {asignColorInverted(usuario.estado)}">
                                                {usuario.estado === "Bloqueado" ? "Desbloquear":"Bloquear"}
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        {/if}
                    {/if}
                {/if}
            {/each}       
        {/if}
    </div>

</div>

<style lang="postcss">

</style>
