<script lang="ts">
    import type { PageData } from './$types';
    import usuarioImage from "$lib/images/icons/username_icon.svg"
    import camera_icon from "$lib/images/icons/camara_icon.svg"
    import eliminar_icon from "$lib/images/icons/borrar_icon.svg"
    import { enhance } from '$app/forms';

    let { data }: { data: PageData } = $props();
    let { usuario } = $derived(data)
</script>

<dialog id="delete_confirmation" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box relative
                sm:w-10/12 sm:max-w-md overflow-hidden">
        <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            id="delete_confirmation_close">✕</button>
        </form>

        <h3 class="text-lg mt-2 font-bold">Eliminar Usuario</h3>
        <p class="text-sm">Todos los datos de este usuario serán permanente eliminados de la aplicación ¿Seguro que desea continuar?</p>

        <div class="modal-container">
            <form action="?/delete" method="POST" use:enhance class="w-full">
                <input type="hidden" name="usuario" value="{usuario.usuario}">

                <button type="submit" class="btn btn-error btn-sm mt-6">
                    Eliminar
                </button>
            </form>
        </div>
    </div>
</dialog>

<div class="relative size-full">
    <div class="w-full h-auto 
                 flex flex-col lg:flex-row 
                 items-start justify-between gap-8 lg:gap-2">
        <div class="w-full lg:w-1/4 h-full
         flex flex-col items-center justify-start 
         bg-base-100 shadow-md rounded-md p-4 animate--x">
            <div class="w-full h-fit rounded-md">
                <div class="w-full flex items-center justify-center flex-col">
                    <div class="size-fit relative">
                        <img src="{usuarioImage}" alt="" class="size-36">
                        <button type="button" class="absolute bottom-1 right-1 size-7 flex items-center justify-center p-0.5
                        hover:bg-base-content/20 active:bg-base-content/10 rounded-md transition-all duration-200">
                            <img src="{camera_icon}" alt="" class="size-full">
                        </button>
                    </div>
                    <h2 class="text-lg">{usuario.nombre} {usuario.apellido}</h2>
                    <h3 class="text-base-content/50 text-sm">{usuario.role}</h3>
                </div>
            </div>

            <div class="p-3 mt-8 w-full border-t border-base-content/30 font-bold flex items-center justify-between">
                <h1>Estadistica #1: </h1>
                <p class="text-accent">0</p>
            </div>           
            <div class="p-3 w-full border-t border-base-content/30 font-bold flex items-center justify-between">
                <h1>Estadistica #2: </h1>
                <p class="text-info">0</p>
            </div>           
            <div class="p-3 w-full border-y border-base-content/30 font-bold flex items-center justify-between">
                <h1>Estadistica #3: </h1>
                <p class="text-warning">0</p>
            </div>           

            <div class="w-full px-2 my-4 lg:mt-8 flex items-center justify-start">
                <button type="submit" class="btn btn-error btn-sm text-base-100
                    flex items-center justify-between px-4 py-1 hover:text-white text-sm
                    ease-in-out"
                    onclick="{() => {
                        document.getElementById('delete_confirmation').showModal()
                    }}">
                    <img src="{eliminar_icon}" alt="" class="invert filter size-6">
                    <span>Eliminar Mi Usuario</span>
                </button>
            </div>
        </div>

        <div class="w-full lg:w-3/4 h-full p-6 animate--x" style="--delay: 150ms;">
            <h3 class="text-2xl font-bold">Configurar Perfil</h3>

            <form action="?/editUser" method="POST" use:enhance class="w-full mt-4 bg-base-100 p-6 rounded-md shadow-md">
                <h4>Configurar Nombre y Apellido</h4>
                <div class="flex items-center justify-between w-full gap-4">
                    <input type="hidden" name="usuario" value="{usuario.usuario}">
                    <label class="form-control w-full">
                        <div class="label">
                            <span class="label-text">Nombre</span>
                        </div>
                        <input value="{usuario.nombre}" name="nombre" type="text" placeholder="{usuario.nombre}" class="input input-bordered w-full" />
                    </label>       

                    <label class="form-control w-full">
                        <div class="label">
                            <span class="label-text">Apellido</span>
                        </div>
                        <input value="{usuario.apellido}" name="apellido" type="text" placeholder="{usuario.apellido}" class="input input-bordered w-full" />
                    </label>       
                </div>

                <div class="flex justify-end w-full">
                    <button class="btn btn-primary btn-wide mt-6 btn-sm" type="submit">Aceptar</button>
                </div>
            </form>

            <form action="?/editPregSeg" method="POST" use:enhance class="w-full bg-base-100 p-6 shadow-md rounded-md mt-8">
                <h4>Configurar Preguntas de Seguridad</h4>
                <div class="flex items-center justify-between w-full gap-4 ">
                    <input type="hidden" name="usuario" value="{usuario.usuario}">

                    <div class="w-2/4">
                        <label class="form-control w-full ">
                            <div class="label">
                                <span class="label-text">Pregunta de Seguridad 1</span>
                            </div>
                            <select class="select select-bordered" name="preg_1">
                                <option disabled selected>Escoger Pregunta</option>
                                <option>Nombre de su Primera Mascota</option>
                                <option>Ciudad en que nació</option>
                                <option>Nombre de su Madre</option>
                                <option>Apellido de su mejor amigo de la Infancia</option>
                                <option>Titulo de su Pelicula Favorita</option>
                            </select>
                        </label>
                        <label class="form-control w-full">
                            <div class="label">
                                <span class="label-text">Respuesta</span>
                            </div>
                            <input name="res_1" type="text" class="input input-bordered w-full " />
                        </label>     
                    </div>

                    <div class="w-2/4">
                        <label class="form-control w-full ">
                            <div class="label">
                                <span class="label-text">Pregunta de Seguridad 1</span>
                            </div>
                            <select class="select select-bordered" name="preg_2">
                                <option disabled selected>Escoger Pregunta</option>
                                <option>Nombre de su Escuela Primaria</option>
                                <option>En que Hospital Nacio</option>
                                <option>Deporte Favorito</option>
                                <option>Cantante o Banda Favorita</option>
                                <option>Restaurante Favorito</option>
                            </select>
                        </label>
                        <label class="form-control w-full">
                            <div class="label">
                                <span class="label-text">Respuesta</span>
                            </div>
                            <input name="res_2" type="text" class="input input-bordered w-full " />
                        </label>     
                    </div>
                </div>

                <div class="flex justify-end w-full">
                    <button class="btn btn-primary btn-wide mt-6 btn-sm" type="submit">Aceptar</button>
                </div>
            </form>
        </div>
    </div>
</div>


<style lang="postcss">
    input {
        @apply focus:outline-0 rounded-none input-md;
    }

    h4 {
        @apply font-semibold text-slate-700;
    }
</style>