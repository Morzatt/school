<script lang="ts">
    import { basePath } from "$lib";
    import type { Grado, Numeros } from "$lib/database/types";

    let { grado }: { grado: Grado & any } = $props();
    
    function formatNumero(nm: Numeros) {
        switch (nm) {
            case "1":
                return "1er"
            case "2":
                return "2do"
            case "3":
                return "3er"
            default:
                return `${nm}to`
        }
    }
</script>

<div class="relative flex flex-col justify-between min-h-[14rem] overflow-hidden transition-all duration-300 
    {grado.nivel === 'Inicial' ? 'bg-primary/10' : 'bg-accent/10'} 
    hover:shadow-xl shadow-md hover:scale-[1.02] p-5 rounded-xl border border-base-content/15 group animate-y" style="--delay: 200ms;">
    
    <div> <!-- Content wrapper -->
        <!-- Header: Nivel Badge and Turno Indicator -->
        <div class="mb-4 flex items-center justify-between">
            <div class="badge badge-lg {grado.nivel === 'Inicial' ? 'badge-primary' : 'badge-accent'} badge-outline font-semibold">
                {grado.nivel}
            </div>
            <div class="flex items-center gap-2 text-sm font-medium opacity-80">
                Turno {grado.turno}
                <div class="size-3 rounded-full {grado.turno == 'Mañana' ? 'bg-orange-500/90' : 'bg-purple-600/90'} 
                    ring-2 {grado.turno == 'Mañana' ? 'ring-orange-500/40' : 'ring-purple-600/40'}"></div>
                    </div>
                </div>

        <!-- Title -->
        <h3 class="font-bold text-2xl mb-2 text-base-content">
            {formatNumero(grado.numero)} 
            {grado.nivel == "Inicial" ? "Nivel" : grado.nivel === "Primaria" ? "Grado" : "Año"} 
            <span class="{grado.nivel === 'Inicial' ? 'text-primary' : 'text-accent'} font-semibold">"{grado.seccion}"</span>
        </h3>
        
        <!-- Teacher info -->
        <div class="mb-5 text-sm p-2 bg-base-100/50 rounded-lg flex items-center gap-2 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 opacity-70 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
            </svg>
            <span class="truncate">Docente: <span class="font-semibold {grado.nivel === 'Inicial' ? 'text-primary' : 'text-accent'}">{grado.nombre_profesor} {grado.apellido_profesor}</span></span>
                </div>

        <!-- Stats -->
        <div class="flex justify-around items-center text-center mb-5 gap-3 p-2 bg-base-100/50 rounded-lg shadow-sm">
            <div class="stat-item px-2">
                <div class="text-xs font-medium opacity-75 mb-1 uppercase tracking-wider">Matricula</div>
                <div class="text-xl font-bold text-base-content">{grado.matricula_grado}</div>
                    </div>
            <div class="border-x border-base-content/20 h-10 self-center"></div>
            <div class="stat-item px-2">
                <div class="text-xs font-medium opacity-75 mb-1 uppercase tracking-wider">Niños</div>
                <div class="text-xl font-bold text-blue-600">{grado.matricula_varones}</div>
                    </div>
             <div class="border-x border-base-content/20 h-10 self-center"></div>
            <div class="stat-item px-2">
                <div class="text-xs font-medium opacity-75 mb-1 uppercase tracking-wider">Niñas</div>
                <div class="text-xl font-bold text-pink-600">{grado.matricula_hembras}</div>
            </div>
            </div>
        </div>

    <!-- Action button -->
    <div class="mt-auto flex justify-end">
        <a href="{basePath}/aulas/{grado.id_grado}" 
           class="btn btn-sm gap-2 {grado.nivel === 'Inicial' ? 'btn-primary' : 'btn-accent'} 
                  shadow-md hover:shadow-lg transition-all duration-200 group-hover:scale-105">
            Administrar Aula
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
        </a>
    </div>
</div>

<style>
    /* Optional: Add specific styles if needed */
    .stat-item {
        min-width: 60px; /* Ensure items have some minimum width */
    }
    /* Add custom blue/pink if not defined in theme */
    .text-blue-600 { color: #2563eb; } 
    .text-pink-600 { color: #db2777; }
</style>
