<script lang="ts">
    type Week = {
        dia: DiasSemana,
        horario: any
    }


    let { lunes, martes, miercoles, jueves, viernes, grado, materias, form } = $props()

    let week: Week[] = $derived([
        {
            dia: "Lunes",
            horario: lunes
        },
        {
            dia: "Martes",
            horario: martes 
        },
        {
            dia: "Miercoles",
            horario: miercoles 
        },
        {
            dia: "Jueves",
            horario: jueves 
        },
        {
            dia: "Viernes",
            horario: viernes
        },
    ])

    import editar_icon from "$lib/images/icons/edit_icon.svg"    
    import add_icon from "$lib/images/icons/add_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
    import type { DiasSemana } from "$lib/database/types";
    import CreateBloqueModal from "./CreateBloqueModal.svelte";

    function formatTime(time: string): string {
        let n = parseInt(time.slice(0, time.lastIndexOf(":")).replace(':', ""))
        return n <= 1200 ? `${time.slice(0, time.lastIndexOf(":"))} AM` :
         `${parseInt(time.slice(0, 2))-12 < 10 ? "0" : ""}${parseInt(time.slice(0, 2))-12}:${time.slice(3,5)} PM`
    }
</script>

<div class="w-full h-max bg-base-200 p-2 rounded-lg
            flex flex-col lg:flex-row items-center lg:items-start justify-start
            join">
    {#each week as dia} 
        <div class="dia-col">
            <div class="dia-head">
                <b>{dia.dia}</b>
                <CreateBloqueModal dia={dia.dia} form={form} grado={grado} materias={materias}/>
                <button class="group rounded-md bg-base-100 absolute top-1 right-1"
                        onclick={ () => { document.getElementById(`create_bloque_${dia.dia}_modal`)!.showModal() } }>
                    <img src="{add_icon}" alt="" class="icon group-hover:invert size-5">
                </button>
            </div>
            {#each dia.horario as i}
                <div class="dia-cell">
                    <div class="dia-cell-header">
                        <div>
                            <button class="group">
                                <img src="{editar_icon}" alt="" class="icon group-hover:invert">
                            </button>
                        </div>

                        <div>{formatTime(i.hora_inicio)} - {formatTime(i.hora_fin)}</div>
                    </div>
                    <div class="dia-content">
                        <div class="materia-card">
                            {i.nombre_materia}
                        </div>
                        <div class="profesor">
                            {i.nombre_profesor} {i.apellido_profesor}
                        </div>
                    </div>
                </div>  
            {/each}
        </div>
    {/each}
</div>

<style lang="postcss">
    .dia-col {
        @apply lg:join-item w-full lg:w-auto
        border border-base-content/60
        bg-base-100
        h-full flex-1 rounded-md 
        my-4 lg:my-0
        grid auto-cols-fr auto-rows-max
        flex-wrap
        grid-cols-2 lg:grid-cols-1;
    }

    .dia-col .dia-head {
        @apply text-center font-bold rounded-none
        bg-primary/50
        border-r lg:border-r-0 border-b border-base-content/80
        w-auto lg:h-fit 
        flex-1
        relative
        col-span-2 lg:col-span-full
        flex items-center justify-center px-3 py-2;
        button {
            @apply hover:bg-base-content active:bg-base-200 active:scale-95 transition-all duration-200 ease-in-out;
        }
    }

    .dia-col .dia-cell {
        @apply text-center
        border-r lg:border-r-0 border-b border-base-content/40
        flex-1 relative
        flex flex-col items-center justify-center p-1;
    }

    .dia-cell .dia-cell-header {
        @apply flex items-center justify-between text-xs w-full px-1;
        button {
            @apply hover:bg-primary active:bg-primary-content p-1 rounded-md transition-all duration-200 ease-in-out active:scale-95;
            img {
                @apply size-5;
            }
        }
    }

    .dia-cell .dia-content {
        @apply p-1 w-full;

        .materia-card {
            @apply px-2 py-1 border-l-[4px] border-l-primary border border-primary-content/40
            rounded-l-md font-bold text-base-content/90
            bg-primary/10;
        }

        .profesor {
            @apply w-full mt-1 text-xs font-bold;
        }
    }
</style>