<script lang="ts">
    import { basePath } from "$lib";
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

<div class="min-h-[10rem] bg-base-content/[0.03] rounded-lg p-1.5">
    <div class="h-8 bg-transparent text-sm flex items-center justify-between px-1">
        <div class="flex items-center justify-between gap-2">
            <div class="size-4 rounded-full {grado.turno == "Mañana" ? "bg-primary":"bg-secondary"}"></div>
            <span><b class="text-neutral">Turno:</b> {grado.turno}</span>
        </div>
        <button class="btn btn-xs btn-square bg-transparent border-none hover:btn-error hover:text-white flex items-center justify-center">✕</button>
    </div>

    <div class="bg-base-200 p-2 rounded-md text-sm border border-base-content/20">
        <div class="p-2 w-full rounded-md border-0 border-base-content/30 h-32">
            <span class="font-bold text-base">
                {formatNumero(grado.numero)} 
                {grado.nivel == "Inicial" ? "Nivel" : grado.nivel === "Primaria" ? "Grado" : "Año"} 
                "{grado.seccion}"
            </span>
        </div>
        <div class="divider py-0 my-0"></div>
        <div class="h-fit w-full mt-2 join gap-2 *:flex-1 *:btn-outline *:border-base-content/50">
            <button class="btn btn-xs px-9 join-item btn-secondary">
                <span>Administrar</span>
            </button>
            <a href="{basePath}/aulas/{grado.id_grado}" class="btn btn-xs btn-primary px-9 join-item">
                <span>Ver</span>
            </a>
        </div>
    </div>
</div>