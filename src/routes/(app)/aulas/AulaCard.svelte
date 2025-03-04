<script lang="ts">
    import type { Grado, Numeros } from "$lib/database/types";

    let { grado }: { grado: Grado } = $props()
    function formatNumero(nm: Numeros) {
        switch (nm) {
            case "1":
                return "1er"
            case "2" :
                return "2do"
            case "3":
                return "3er"
            default:
                return `${nm}to`
        }
    }
</script>

<div class="min-h-[10rem] bg-base-200 rounded-lg p-1.5">
    <div class="h-8 bg-transparent flex items-center justify-between px-2">
        <div>
            <span class="text-sm font-semibold">
                {formatNumero(grado.numero)} 
                {grado.nivel == "Inicial" ? "Nivel" : grado.nivel === "Primaria" ? "Grado" : "Año"} 
                "{grado.seccion}"
            </span>
        </div>
        <button class="btn btn-xs btn-square btn-ghost flex items-center justify-center">✕</button>
    </div>

    <div class="bg-base-200 p-2 rounded-md text-sm border border-base-content/20">
        <div>
            <span><b>Profesor:</b> {grado.profesor}</span>
        </div>
        <div class="divider py-0 my-0"></div>
        <div>
            <h2><b>Turno:</b> {grado.turno}</h2>
        </div>
        <div class="divider py-0 my-0"></div>
        <div>
            <h2><b>Matricula:</b> {30}</h2>
        </div>
    </div>

    <div class="h-fit mt-2 flex items-center justify-end">
        <button class="btn btn-xs px-9 btn-accent">
            <span>Ver</span>
        </button>
    </div>
</div>