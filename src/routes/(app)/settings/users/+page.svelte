<script lang="ts">
    import type { ActionData, PageData } from "./$types";
    import read_icon from "$lib/images/icons/read_icon.svg"
    import write_icon from "$lib/images/icons/write_icon.svg"
    import eliminar_icon from "$lib/images/icons/borrar_icon.svg"
    import { enhance } from "$app/forms";
    import Alert from "$lib/components/Messages/Alert.svelte";
    import { capitalizeFirstLetter } from "$lib/utils/capitlizeFirstLetter";

    let { data, form }: { data: PageData, form: ActionData } = $props();
    let { usuarios } = $derived(data)

    function asignColor(status: "Activo" | "Bloqueado" | 'Por Asignar'): string {
        switch (status) {
            case "Activo": 
                return "text-green-800 bg-green-100"
            case "Bloqueado":
                return "text-red-800 bg-red-100"
            default: 
                return "text-yellow-700 bg-yellow-100"
        }
    }
    function asignColorInverted(status: "Activo" | "Bloqueado" | 'Por Asignar') {
        switch (status) {
            case "Activo": 
                return "text-red-800 bg-red-100"
            case "Bloqueado":
                return "text-green-800 bg-green-100"
            case 'Por Asignar':
                return "text-green-800 bg-green-100"
        }
    }

    function asignRange(role: string) {
        switch (true) {
            case containsWholeSubstring(role, 'admin'):
                return 1
            case containsWholeSubstring(role, "superadmin"):
                return 2
            default: 
                return 0    
        }
    }

    function containsWholeSubstring(mainString: string, subString: string) {
        const escapedSubString = subString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escapedSubString}\\b`);
        return regex.test(mainString);
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
    let deleteConfirmation = $state(false)
    let userToDelete = $state("")
</script>

<div class="relative size-full">
    <div class="relative size-full {deleteConfirmation ? "blur-sm" : ""}">
        <Alert form={ form } styles="absolute right-3 top-3 max-w-sm"/>
        <h1 class="text-xl">Administrar Usuarios y Permisos</h1>

        <div class="w-full lg:w-5/6 mt-6 h-max flex flex-col p-2 gap-2">
            {#if usuarios}
                {#each usuarios as usuario, i}
                    {#if usuario.usuario !== data.usuario.usuario} <!-- if user is not the same -->
                        {#if !containsWholeSubstring(usuario.role, "superadmin")} <!-- if user is not super admin-->
                            {#if usuarioRange > usuario.range}

                                <dialog id="delete_confirmation_{usuario.usuario}" class="modal modal-bottom sm:modal-middle">
                                    <div class="modal-box relative
                                                sm:w-10/12 sm:max-w-md overflow-hidden">
                                        <form method="dialog">
                                            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                                            id="delete_confirmation_close_{usuario.usuario}">✕</button>
                                        </form>

                                        <h3 class="text-xl font-bold">Eliminar Usuario</h3>
                                        <p class="text-sm">Todos los datos de este usuario serán permanente eliminados de la aplicación ¿Seguro que desea continuar?</p>

                                        <form action="?/delete" method="POST" use:enhance={()=> { document.getElementById(`delete_confirmation_close_${usuario.usuario}`)?.click() }}>
                                            <input type="hidden" name="usuario" value="{usuario.usuario}">
                                            <button class="btn btn-error btn-sm mt-6">Eliminar</button>
                                        </form>
                                    </div>
                                </dialog>

                                <div class="collapse collapse-plus bg-base-100 border border-base-content/20 w-full overflow-x-auto animate-y"
                                style="--delay: {i*100}ms">
                                    <input type="radio" name="users-accordion"/>

                                    <div class="collapse-title grid grid-cols-4 gap-6 w-full">
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
                                                            <img src="{read_icon}" alt="" class="icon">
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
                                                            <img src="{write_icon}" alt="" class="icon">
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
                                        <div class="border-none border-x-base-content/90 px-2 h-full min-w-[17rem]">
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

                                                <input type="hidden" name="estado" value="{usuario.estado === "Activo" ? 'Bloqueado' :  "Activo"}">

                                                <button type="submit" class="btn btn-sm {asignColorInverted(usuario.estado)}">
                                                    {usuario.estado === "Activo" ? 'Bloquear' :  "Activar"}
                                                </button>
                                            </form>
                                        </div>

                                        <!-- Eliminar -->
                                        <div class="border-x border-x-base-content/30 px-4 h-full">
                                            <h3 class="text-sm">Eliminar</h3>

                                            <button type="submit" class="bg-transparent group
                                             hover:bg-red-500 rounded-md transition-all
                                              ease-in-out"
                                              onclick="{() => {
                                                document.getElementById(`delete_confirmation_${usuario.usuario}`)!.showModal() 
                                              }}">
                                                <img src="{eliminar_icon}" alt="" class="group-hover:invert filter size-6 icon">
                                            </button>
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
</div>


<style lang="postcss">
* {
    scrollbar-width: thin;
}
</style>
