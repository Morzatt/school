<script lang="ts">
    import { capitalizeFirstLetter } from "$lib/utils/capitlizeFirstLetter";
    import type { PageData } from "./$types";
    import stat_icon from "$lib/images/icons/add_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
    import book_icon from "$lib/images/icons/book_icon.svg"
    import guias_icon from "$lib/images/icons/guias_icon.svg"
    import tutoriales_icon from "$lib/images/icons/tutorial_iconn.svg"
    import retencion_icon from "$lib/images/icons/retencion.svg"
    import success_icon from "$lib/images/icons/success_icon.svg"
    import courses_icon from   "$lib/images/icons/success_icon.svg";

    import { onMount } from "svelte";
    import { Chart } from "chart.js/auto";


    let { data }: { data: PageData }= $props()
    let { usuario, relacionSexo, totalPersonas, distribucionIngresos } = $derived(data)

    // Configuración del gráfico PIE
    const config = {
      type: "pie",
      data: {
        labels: ['Femenino', 'Masculino'],
        datasets: [{
          data: [relacionSexo!.hembras, relacionSexo!.varones],
          backgroundColor: [
            '#FF6384', '#36A2EB'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            font: { size: 16 }
          },
          legend: {
            position: 'right',
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: ${value} alumnos (${percentage}%)`;
              }
            }
          }
        }
      }
    };

    // CONFIGURACION DEL GRAFICO BAR
    // const barChartData = {
    //   labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    //   datasets: [{
    //     label: 'Ingreso Promedio',
    //     data: [16, 15, 17, 18, 16, 17],
    //     backgroundColor: '#8b5cf6',
    //     borderRadius: 8,
    //   }]
    // };

    // const barChartData = $derived(distribucionIngresos);

    const barChartConfig = {
      type: 'bar',
      data: distribucionIngresos,
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            font: { size: 16 }
          },
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: Math.max(...distribucionIngresos.datasets[0].data)+10,
            title: { display: true }
          }
        }
      }
    };

    onMount(() => {
        // Renderizar el gráfico
        const ctx = document.getElementById('donutChart').getContext('2d');
        new Chart(ctx, config);

        const ctx3 = document.getElementById('barChart').getContext('2d');
        new Chart(ctx3, barChartConfig);
    })
</script>

<div class="size-full flex flex-col lg:flex-row items-start justify-start gap-2">
    <div class="w-full lg:w-3/4 h-full animate-y">
      <!-- DASHBOARD HEADER -->
      <div class="w-full flex flex-col gap-4 px-6 pt-6 pb-2">
        <div class="flex flex-col md:flex-row md:items-center md:justify-start gap-6">
          <!-- <div class="flex flex-col items-center justify-center gap-2">
            <img src="/logoColegio.png" alt="" class="h-28">
            <b class="text-base-content/70 text-base">U.E.N "Armando Reverón"</b>
          </div> -->
          <div>
            <h1 class="text-3xl font-bold text-base-content mb-1">Bienvenido, {capitalizeFirstLetter(usuario.nombre)}!</h1>
            <p class="text-base-content/70 text-base">Este es el resumen de tu plataforma este mes.</p>
          </div>
        </div>
      </div>

      <!-- MAIN GRID -->
      <div class="w-full px-4 pb-8 mt-3">
        <div class="grid  grid-cols-1 xl:grid-cols-2 gap-6">
          <!-- LEFT COLUMN: Stats and Orders -->
          <div class="col-span-2 flex flex-col gap-6">
            <!-- STATS GRID -->
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              <!-- Card 1: Total Revenue (example colored card) -->
              <div class="rounded-2xl p-6 bg-gradient-to-br from-primary to-base-content/50 text-white shadow-lg flex flex-col gap-2 relative overflow-hidden">
                <span class="text-base font-medium">Total de Alumnos</span>
                <span class="text-3xl font-bold">{totalPersonas.alumnos}</span>
                <span class="text-xs opacity-80">Este mes</span>
                <img src="{retencion_icon}" alt="" class="absolute right-4 bottom-4 w-10 h-10 opacity-20 icon" />
              </div>
              <!-- Card 2: Total Orders -->
              <div class="rounded-2xl p-6 bg-base-100 shadow-lg flex flex-col gap-2 relative overflow-hidden border border-base-200">
                <span class="text-base font-medium text-base-content/80">Total de Representantes</span>
                <span class="text-3xl font-bold text-success">{totalPersonas.representantes}</span>
                <span class="text-xs text-base-content/60">Este mes</span>
                <img src="{success_icon}" alt="" class="absolute right-4 bottom-4 w-10 h-10 opacity-10 icon" />
              </div>
              <!-- Card 3: Total Visitors -->
              <div class="rounded-2xl p-6 bg-base-100 shadow-lg flex flex-col gap-2 relative overflow-hidden border border-base-200">
                <span class="text-base font-medium text-base-content/80">Total de Empleados</span>
                <span class="text-3xl font-bold text-info">{totalPersonas.empleados}</span>
                <span class="text-xs text-base-content/60">Este mes</span>
                <img src="{stat_icon}" alt="" class="absolute right-4 bottom-4 w-10 h-10 opacity-10 icon" />
              </div>
              <!-- Card 4: Net Profit (example colored card) -->
              <div class="rounded-2xl p-6 bg-gradient-to-br from-secondary to-accent text-white shadow-lg flex flex-col gap-2 relative overflow-hidden">
                <span class="text-base font-medium">Total de Cursos</span>
                <span class="text-3xl font-bold">{totalPersonas.cursos}</span>
                <span class="text-xs opacity-80">Este mes</span>
                <img src="{courses_icon}" alt="" class="absolute right-4 bottom-4 w-10 h-10 opacity-20 icon" />
              </div>
            </div>

            <!-- CHARTS GRID -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

              <div class="bg-base-100 rounded-2xl col-span-1 p-6 shadow-lg border border-base-200 flex flex-col">
                <span class="font-semibold text-base-content mb-2 text-lg">Sexos de Alumnos</span>
                <canvas id="donutChart" class="w-full h-40"></canvas>
              </div>

              <div class="bg-base-100 rounded-2xl col-span-2 p-6 shadow-lg border border-base-200 flex flex-col">
                <span class="font-semibold text-base-content mb-2 text-lg">Ingresos Promedio por Mes</span>
                <canvas id="barChart" class="w-full h-40"></canvas>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="w-full min-h-full flex lg:w-1/4 flex-col gap-4 rounded-box bg-base-200 lg:max-w-sm p-6 shadow-md animate-x" style="--delay: 350ms">
        <!-- Header -->
        <div class="flex flex-col gap-4 items-center">
            <h1 class="font-bold text-xl">¿Necesita Ayuda?</h1>

            <span class="text-center text-sm">
                Aprende sobre los procedimientos, tutoriales, guías, entre otros.
                <a href="/settings/ayuda" class="link link-accent">Vea la sección de ayuda</a> para aprender más.
            </span>
        </div>

        <!-- Body (Features) -->
        <div class="flex flex-col">
            <div class="divider mt-0"></div>

            <!-- Feature-->
            <div class="flex gap-8 items-center">
                <img src="{tutoriales_icon}" alt="" class="icon">

                <div class="flex flex-col">
                    <h2 class="font-bold">Tutoriales</h2>
                    <span class="text-sm">Aprenda cómo usar el sistema mediante video tutoriales.</span>
                </div>
            </div>

            <div class="divider"></div>

            <!-- Feature-->
            <div class="flex gap-8 items-center">
                <img src="{guias_icon}" alt="" class="icon">

                <div class="flex flex-col">
                    <h2 class="font-bold">Guias</h2>
                    <span class="text-sm">Ubique guías para cada caso de uso.</span>
                </div>
            </div>

            <div class="divider"></div>

            <!-- Feature-->
            <div class="flex gap-8 items-center">
                <img src="{book_icon}" alt="" class="icon">

                <div class="flex flex-col">
                    <h2 class="font-bold">Manual de Usuario</h2>
                    <span class="text-sm">Visualice y descargue una copia en PDF del manual de usuario.</span>
                </div>
            </div>

            <div class="divider"></div>
        </div>
    </div>
</div>

<style lang="postcss">

</style>