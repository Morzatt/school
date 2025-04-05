<script lang="ts">
    import { basePath } from "$lib";
    import type { Grado, Numeros } from "$lib/database/types";

    let { grado }: { grado: Grado & any } = $props()
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

<div class="min-h-[10rem] {grado.nivel === "Inicial" ? "bg-primary/30" : "bg-accent/30"} shadow-base-content/60 p-1 pt-6 pb-2 rounded-xl
border border-base-content/10">
    <div class="h-8 px-2 pt-2
    bg-base-100
    text-base-content
    rounded-xl rounded-b-none
    text-sm 
    flex items-center justify-between">
        <div class="flex items-center justify-between gap-2 rounded-t-md">
            <div class="size-4 rounded-full {grado.turno == "Mañana" ? "bg-orange-500":"bg-purple-600"}"></div>
            <span><b>Turno:</b> {grado.turno}</span>
        </div>
    </div>

    <div class="shadow-lg p-2 rounded-xl rounded-t-none text-sm bg-base-100">
        <div class="w-full rounded-md border-0 border-base-content/30 h-32">
            <div class="text-xs px-2">
                <div>Docente de Aula: <span class="text-accent"> {grado.nombre_profesor} {grado.apellido_profesor} </span> </div>
            </div>

            <span class="font-bold text-xl p-1 px-2">
                {formatNumero(grado.numero)} 
                {grado.nivel == "Inicial" ? "Nivel" : grado.nivel === "Primaria" ? "Grado" : "Año"} 
                "{grado.seccion}"
            </span>

            <div class="w-full mt-3 flex items-center justify-between 
            [&_.label-text]:font-bold
            *:w-1/3 *:border-y *:border-base-content/40">
                <div class="form-control flex flex-col items-center justify-center border-l rounded-l-md">
                    <div class="label my-0 py-0 ">
                        <span class="label-text">Matricula</span>
                    </div>
                    <div class="text-lg font-bold border-base-content/40 rounded-full w-fit px-3 py-2">
                        {grado.matricula_grado}
                    </div>
                </div>

                <div class="form-control flex flex-col items-center justify-center border-x">
                    <div class="label my-0 py-0 ">
                        <span class="label-text">Niños</span>
                    </div>
                    <div class="text-lg text-primary font-bold border-base-content/40 rounded-full w-fit px-3 py-2">
                        {grado.matricula_varones}
                    </div>
                </div>

                <div class="form-control flex flex-col items-center justify-center border-r rounded-r-md">
                    <div class="label my-0 py-0 ">
                        <span class="label-text">Niñas</span>
                    </div>
                    <div class="text-lg text-secondary font-bold border-base-content/40 rounded-full w-fit px-3 py-2">
                        {grado.matricula_hembras}
                    </div>
                </div>
            </div>
        </div>

        <div class="h-fit w-fit mt-1 join gap-2 *:flex-1">
            <a href="{basePath}/aulas/{grado.id_grado}" class="btn btn-xs btn-primary join-item [&_span]:hover:text-base-100">
                <span>Administrar</span>
            </a>
        </div>
    </div>
</div>
