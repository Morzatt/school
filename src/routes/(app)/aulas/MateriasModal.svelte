
<script lang="ts">
    import { enhance } from "$app/forms";
    import Alert from "$lib/components/Messages/Alert.svelte";
    import delete_icon from "$lib/images/icons/borrar_icon.svg"
    import edit_icon from "$lib/images/icons/edit_icon.svg"
    import type { Materia } from "$lib/database/types";
    import { isLastDayOfMonth } from "date-fns";
    let { form, materias }: { form:any, materias: Materia[] | undefined } = $props()

    let nivel: 'Inicial' | 'Primaria' | 'Elegir' = $state('Elegir')
    function edit(id: string) {
        let input = document.getElementById(`input_${id}`) as HTMLInputElement
        let title = document.getElementById(`title_${id}`) as HTMLHeadingElement
        let button = document.getElementById(`button_${id}`) as HTMLButtonElement

        if (button.type === "button") {
            title.classList.add('hidden')
            input.classList.remove('hidden')
            setTimeout(() => button.type = "submit", 400)
            return
        }

        title.classList.remove('hidden')
        
        setTimeout(() => {
            button.type = "button"
            input.classList.add('hidden');
        }, 100)
    }
</script>

<dialog id="manage_materias_modal" class="modal modal- modal-bottom sm:modal-middle">
    <div class="modal-box relative
                sm:w-full sm:max-w-3xl overflow-hidden">

        <Alert form={form} styles="absolute top-4 left-3 max-w-xs" />

        <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            id="manage_materias_modal">✕</button>
        </form>

        <h2 class="font-bold text-xl">Administrar Materias</h2>
        <p class="text-sm text-base-content/80">Cree, edite, elimine y administre materias.</p>

        <div class="modal-container flex flex-col lg:flex-row gap-4 mt-3">
            <div class="w-[60%] flex flex-col gap-2 h-[24rem] overflow-y-auto overflow-x-hidden pr-4">
                {#if materias && materias.length > 0}
                    {#each materias as materia, i}                    
                        <div class="w-full p-3 border-x-[5px] border-b border-b-base-content/20 rounded-l-xl shadow-sm
                        flex justify-between items-center animate--y gap-3" style="border-left-color: {materia.color}; border-right-color: {materia.color}; --delay:{i*100}ms">

                            <form action='?/editMateria' method="post" use:enhance class="flex flex-1 items-center justify-between gap-5">
                                <input type="hidden" name="id_materia" value={materia.id_materia}>

                                <h3 class="font-bold text-lg animate--x"
                                id="title_{materia.id_materia}">{materia.nombre_materia}</h3>

                                <input type='text'
                                    name="nombre_materia" 
                                    id="input_{materia.id_materia}"
                                    class="hidden input input-sm input-bordered max-w-[13rem] animate-x"
                                    placeholder="Nuevo nombre de la materia...">

                                <button class="btn btn-square btn-sm font-bold
                                flex items-center justify-center tooltip tooltip-top" data-tip="Editar Materia"
                                type="button"
                                id='button_{materia.id_materia}'
                                onclick={() => { edit(materia.id_materia) }}>
                                    <img src="{edit_icon}" alt="" class="icon">
                                </button>
                            </form>

                            <div class="flex w-fit items-center justify-between gap-3">
                                <form action="?/deleteMateria" method="post" use:enhance>
                                <input type="hidden" name="id_materia" value={materia.id_materia}>
                                    <button class="btn btn-square btn-sm btn-error *:filter *:invert font-bold
                                    flex items-center justify-center tooltip tooltip-top" data-tip="Eliminar Materia">
                                        <img src="{delete_icon}" alt="" class="icon">
                                    </button>
                                </form>
                            </div>
                        </div> 
                    {/each} 
                {/if}
            </div>

            <div class="divider divider-horizontal m-0 p-0">O</div>

            <form method="post" action="?/createMateria" use:enhance class="w-[40%]">
                <h2 class="font-bold text-xl">Crear Materia</h2>
                <p class="text-sm text-base-content/80">Cree, edite, elimine y administre materias.</p>

                <div class="form-control">
                    <div class="label">
                        <b class="label-text">Nombre de la Materia</b>
                    </div>
                    <input type="text" name="nombre_materia" class="input input-sm input-bordered max-w-[13rem]"
                    placeholder="Nombre de la materia...">
                </div>

                <div class="form-control">
                    <div class="label">
                        <b class="label-text">Elegir Color</b>
                    </div>
                    <input type="color" name="color_materia">
                </div>

                <button class="btn btn-sm btn-success px-10 mt-4">
                    <span>Crear</span>
                </button>
            </form>
        </div>
    </div>
</dialog>

<style lang="postcss">

    .create-section {
        @apply w-full h-max
            my-4 p-2
            border border-base-content/30 rounded-md
            grid 
            grid-cols-1 text-center;
    }

    .create-section h3 {
        @apply text-wrap text-center font-semibold text-lg mb-1 pb-1 border-b border-base-content/30; 
    }
    
    .create-form {
        @apply w-full flex flex-wrap gap-4;
    }


    .modal-box {
        @apply border border-base-content/80
        sm:w-10/12  overflow-hidden;
    }          
    .modal-container {
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