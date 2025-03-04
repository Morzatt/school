<script lang="ts">
    import { enhance } from "$app/forms";
    import Alert from "$lib/components/Messages/Alert.svelte";
    let { form }: { form:any } = $props()
</script>

<dialog id="create_empleado_modal" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box relative
                sm:w-full sm:max-w-xl overflow-hidden">

        <Alert form={form} styles="absolute top-4 left-3 max-w-xs" />

        <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            id="create_empleado_close">✕</button>
        </form>

        <h2 class="font-bold text-xl">Crear Empleado</h2>
        <p class="text-sm">Ingrese los datos de registro requeridos para ingresar al sistema un nuevo empleado.</p>

        <div class="modal-container">
            <form action="?/createEmpleado" class="w-full h-auto" use:enhance method="post">
                <div class="create-section">
                    <h3>Información Personal</h3>

                    <div class="create-form">
                        <label class="form-control">
                            <div class="label">
                                <span class="label-text">Cédula</span>
                            </div>
                            <input type="number" name="cedula" class="input input-sm input-bordered rounded-md max-w-[12rem]" placeholder="Cédula de Identidad">
                        </label>

                        <label class="form-control">
                            <div class="label">
                                <span class="label-text">Sexo</span>
                            </div>
                            <select name="sexo">
                                <option disabled selected>Elegir</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Femenino">Femenino</option>
                            </select>
                        </label>

                        <label class="form-control">
                            <div class="label">
                                <span class="label-text">Fecha de Nacimiento</span>
                            </div>
                            <input type="date" name="fecha_nacimiento" class="input input-sm input-bordered rounded-md max-w-[12rem]" placeholder="Cédula de Identidad">
                        </label>
                    </div>
                </div> 

                <div class="create-section">
                    <h3>Nombres y Apellidos</h3>

                    <div class="create-form">
                        <label class="form-control">
                            <div class="label">
                                <span class="label-text">Primer Nombre</span>
                            </div>
                            <input type="text" name="primer_nombre" class="input input-sm input-bordered rounded-md md:max-w-[10rem]" placeholder="Primer Nombre">
                        </label>

                        <label class="form-control">
                            <div class="label">
                                <span class="label-text">Segundo Nombre</span>
                            </div>
                            <input type="text" name="segundo_nombre" class="input input-sm input-bordered rounded-md md:max-w-[10rem]" placeholder="Segundo Nombre">
                        </label>

                        <label class="form-control">
                            <div class="label">
                                <span class="label-text">Primer Apellido</span>
                            </div>
                            <input type="text" name="primer_apellido" class="input input-sm input-bordered rounded-md md:max-w-[10rem]" placeholder="Primer Apellido">
                        </label>

                        <label class="form-control">
                            <div class="label">
                                <span class="label-text">Segundo Apellido</span>
                            </div>
                            <input type="text" name="segundo_apellido" class="input input-sm input-bordered rounded-md md:max-w-[10rem]" placeholder="Segundo Apellido">
                        </label>
                    </div>
                </div>

                <div class="create-section">
                    <h3>Direccion</h3>

                    <div class="create-form">
                        <label class="form-control w-full">
                            <div class="label">
                                <span class="label-text">Dirección de Habitación</span>
                            </div>
                            <input type="text" name="direccion" class="input input-sm input-bordered rounded-md md:max-w-[22rem]" placeholder="Direccion de Trabajo">
                        </label>
                    </div>
                </div>

                <div class="create-section">
                    <h3>Datos Laborales</h3>

                    <div class="create-form">
                        <label class="form-control">
                            <div class="label">
                                <span class="label-text">Área de Trabajo</span>
                            </div>
                            <select name="area">
                                <option disabled selected>Elegir</option>
                                <option value="Docente">Docente</option>
                                <option value="Administrativo">Administrativo</option>
                                <option value="Obrero">Obrero</option>
                            </select>
                        </label>

                        <label class="form-control">
                            <div class="label">
                                <span class="label-text">Turno</span>
                            </div>
                            <select name="turno">
                                <option disabled selected>Elegir</option>
                                <option value="Mañana">Mañana</option>
                                <option value="Tarde">Tarde</option>
                            </select>
                        </label>

                        <label class="form-control">
                            <div class="label">
                                <span class="label-text">Fecha de Ingreso</span>
                            </div>
                            <input type="date" name="fecha_ingreso" class="input input-sm input-bordered rounded-md max-w-[12rem]" placeholder="Cédula de Identidad">
                        </label>
                    </div>
                </div>

                <div class="create-section">
                    <h3>Grado de Instrucción y Cargo</h3>

                    <div class="create-form">
                        <label class="form-control">
                            <div class="label">
                                <span class="label-text">Grado de Instruccion</span>
                            </div>
                            <select name="grado_instruccion">
                                <option selected disabled>Elegir</option>
                                <option value="Bachiller">Bachiller</option>
                                <option value="TSU">TSU</option>
                                <option value="Licenciado">Licenciado</option>
                                <option value="Ingeniero">Ingeniero</option>
                            </select> 
                        </label>

                        <label class="form-control">
                            <div class="label">
                                <span class="label-text">Especialización</span>
                            </div>
                            <input type="text" name="especializacion" class="input input-sm input-bordered rounded-md md:max-w-[16rem]" placeholder="Especializacion">
                        </label>

                        <label class="form-control">
                            <div class="label">
                                <span class="label-text">Cargo</span>
                            </div>
                            <input type="text" name="cargo" class="input input-sm input-bordered rounded-md md:max-w-[16rem]" placeholder="Cargo">
                        </label>
                    </div>
                </div>

                <div class="w-full flex items-center justify-center pb-12">
                    <button class="btn btn-success btn-wide">Crear Donante</button>
                </div>
            </form>
        </div>
    </div>
</dialog>

<style lang="postcss">
    .create-section {
        @apply w-full h-max
            my-4 p-2 py-4
            border border-base-content/30 rounded-md
            grid 
            grid-cols-1 md:grid-cols-[20%_80%] text-center;
    }

    .create-section h3 {
        @apply text-wrap text-center mb-3 sm:mb-0; 
    }
    
    .create-form {
        @apply w-full flex flex-wrap gap-4 md:border-l border-base-content/30 md:pl-4;
    }


    .modal-box {
        @apply border border-base-content/80
        sm:w-10/12 sm:max-w-3xl overflow-hidden;
    }          
    .modal-container {
        @apply flex mt-3 max-h-[30rem] overflow-y-auto overflow-x-hidden;
        scrollbar-width: thin;
    }

    .input {
        @apply focus:outline-0 ;
    }
    .input, .select {
        @apply relative border;
    }

    .input {
        @apply bg-base-100 input-sm;
    }

    select {
        @apply btn btn-sm hover:border-base-content/30 hover:border focus:outline-0;
    }
</style>
                        
<!-- <style lang="postcss">
    .input {
        @apply focus:bg-transparent focus:outline-0;
    }

    .form-control {
        @apply px-2 pb-2;
    }

    .form-control .label .label-text {
        @apply font-bold;
    }

    .form-control p {
        @apply text-sm pb-1;
    }
    .modal-container {
        @apply flex max-h-[30rem] overflow-y-auto overflow-x-hidden;
        scrollbar-width: thin;
    }
</style> -->