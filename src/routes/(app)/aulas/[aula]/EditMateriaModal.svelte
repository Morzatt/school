<script lang="ts">
    import { enhance } from "$app/forms";
    import Alert from "$lib/components/Messages/Alert.svelte";
    import class_icon from "$lib/images/icons/class_icon.svg"
    import teacher_icon from "$lib/images/icons/teacher_icon.svg"

    import type { HorarioGradoAlt, Materia } from "$lib/database/types";
    let { form, dia, hora, materias }: { form:any, dia: string, hora: HorarioDia, materias: Materia[] } = $props()

    type HorarioDia = HorarioGradoAlt & { 
        nombre_profesor: string,
        apellido_profesor: string,
        nombre_materia: string,
        id_materia: string,
        color: string
    }

</script>

<dialog id="{hora.id_horario}" class="modal modal-bottom modal- sm:modal-middle">
    <div class="modal-box relative
                sm:w-full sm:max-w-sm overflow-hidden">

        <Alert form={form} styles="absolute top-4 left-3 max-w-sm" />

        <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            id="{hora.id_horario}_close">✕</button>
        </form>

        <h2 class="font-bold text-xl">Editar Horario</h2>

        <div class="w-full text-start text-sm flex items-center justify-between">
            <div>
                <h4 class="font-semibold">{dia}</h4>
                <h3>{hora.nombre_materia}</h3>
            </div>

            <form action="?/deleteHorario" method="post" use:enhance={() => { document.getElementById(`${hora.id_horario}_close`)?.click() }}>
                <input type="hidden" name="id_horario" value={hora.id_horario}>
                <input type="hidden" name="dia_semana" value={dia}>

                <button class="btn btn-sm btn-error text-base-100">
                    <span>Eliminar Hora</span>
                </button>
            </form>
        </div>

        <div class="modal-container">
            <form method="post" action="?/editHorario" use:enhance={() => { document.getElementById(`${hora.id_horario}_close`)?.click() }} class="mt-4 w-full">
                <input type="hidden" name="id_horario" value={hora.id_horario}>
                <input type="hidden" name="dia_semana" value={dia}>

                <div class="flex my-2 gap-5 items-center justify-start">
                    <img src="{class_icon}" alt="" class="icon size-12">
                    <div>
                        <b>Cambiar Materia</b>

                        <div class="form-control">
                            <div class="label">
                                <div class="label-text flex items-start justify-start tooltip tooltip-top" data-tip="Dejar en blanco para conservar la materia actual">
                                    <span>Seleccionar Nueva Materia <b>*</b></span>
                                </div>
                            </div>
                            <select name="nueva_materia" class="btn border border-base-content/40 btn-sm">
                                <option selected disabled>Elegir</option>
                                {#if materias && materias.length > 0}
                                    {#each materias as materia}
                                        <option value="{materia.id_materia}">{materia.nombre_materia}</option> 
                                    {/each} 
                                {/if}
                            </select>
                        </div>
                    </div>                   
                </div>

                <div class="flex my-2 mt-4 gap-5 items-center justify-start">
                    <img src="{teacher_icon}" alt="" class="icon size-12">

                    <div>
                        <b>Cambiar Profesor</b>
                        <div class="form-control">
                            <div class="label">
                                <div class="label-text flex items-start justify-start tooltip tooltip-top" data-tip="Dejar en blanco para conservar el profesor actual">
                                    <span>Seleccionar Nuevo Profesor <b>*</b></span>
                                </div>
                            </div>

                            <input type="text" name="nuevo_profesor" class="input input-sm input-bordered" placeholder="Cedula del profesor...">
                        </div>
                    </div>
                </div>

                <div class="flex items-center justify-center mt-6 w-full">
                    <button class="btn px-8 btn-success text-base-100">
                        <span>Aceptar</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</dialog>

<style lang="postcss">
    .modal-box {
        @apply border border-base-content/80
        sm:w-10/12  overflow-hidden;
    }          
    .modal-container {
        @apply flex mt-1 max-h-[30rem] overflow-y-auto overflow-x-hidden;
        scrollbar-width: thin;
    }
</style>