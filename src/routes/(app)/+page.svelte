<script lang="ts">
    import { capitalizeFirstLetter } from "$lib/utils/capitlizeFirstLetter";
    import type { PageData } from "./$types";
    import stat_icon from "$lib/images/icons/add_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
    import book_icon from "$lib/images/icons/book_icon.svg"
    import guias_icon from "$lib/images/icons/guias_icon.svg"
    import tutoriales_icon from "$lib/images/icons/tutorial_iconn.svg"
    import retencion_icon from "$lib/images/icons/retencion.svg"
    import success_icon from "$lib/images/icons/success_icon.svg"

    import { onMount } from "svelte";
    import { Chart } from "chart.js/auto";


    let { data }: { data: PageData }= $props()
    let { usuario, relacionSexo, totalPersonas } = $derived(data)

        // Datos de ejemplo (puedes reemplazarlos con datos reales)
    const data2 = {
      labels: ['Femenino', 'Masculino'],
      datasets: [{
        data: [relacionSexo!.hembras, relacionSexo!.varones],
        backgroundColor: [
          '#FF6384', '#36A2EB'
        ],
        borderWidth: 1
      }]
    };

    // Configuración del gráfico
    const config = {
      type: "pie",
      data: data2,
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Sexos de Alumnos',
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

      // Datos de ejemplo (últimos 6 meses)
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
    const datos = {
      representantes: [15, 22, 30, 18, 25, 20],
      alumnos: [45, 60, 75, 50, 65, 70],
      empleados: [5, 8, 10, 6, 7, 9]
    };

    // Configuración del gráfico
    const config2 = {
      type: 'line',
      data: {
        labels: meses,
        datasets: [
          {
            label: 'Representantes',
            data: datos.representantes,
            borderColor: '#FF6384',
            backgroundColor: 'rgba(255, 99, 132, 0.1)',
            tension: 0.3,
            fill: true
          },
          {
            label: 'Alumnos',
            data: datos.alumnos,
            borderColor: '#36A2EB',
            backgroundColor: 'rgba(54, 162, 235, 0.1)',
            tension: 0.3,
            fill: true
          },
          {
            label: 'Empleados',
            data: datos.empleados,
            borderColor: '#FFCE56',
            backgroundColor: 'rgba(255, 206, 86, 0.1)',
            tension: 0.3,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Ingresos Mensuales (Últimos 6 Meses)',
            font: { size: 18 }
          },
          tooltip: {
            mode: 'index',
            intersect: false
          },
          legend: {
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Número de Registros'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Meses'
            }
          }
        }
      }
    };

    // Renderizar


    onMount(() => {
        // Renderizar el gráfico
        const ctx = document.getElementById('donutChart').getContext('2d');
        new Chart(ctx, config);

        const ctx2 = document.getElementById('lineChart').getContext('2d');
        new Chart(ctx2, config2);
    })
</script>

<div class="size-full flex flex-col lg:flex-row items-start justify-start gap-2">
    <div class="w-full lg:w-3/4 h-full">
        <div class="w-full min-h-24 mt-3 hidden lg:flex items-center justify-start gap-4 animate-y" style="--delay: 400ms">
            <div class="bg-base-100 w-1/3 h-full rounded-md p-2 flex items-center justify-between gap-2">
                <div class="h-full rounded-md bg-base-300 w-20 border border-base-content/20">
                    <img src="{retencion_icon}" alt="" class="size-full icon p-2">
                </div>
                <div class="w-3/4 h-full py-1">
                    <p class="text-base-content/80 ">Total de Alumnos</p>
                    <b class="text-4xl">{totalPersonas.alumnos}</b>
                </div>
            </div>               
            <div class="bg-base-100 w-1/3 h-full rounded-md p-2 flex items-center justify-between gap-2">
                <div class="h-full rounded-md bg-base-300 w-20 border border-base-content/20">
                    <img src="{success_icon}" alt="" class="size-full icon p-1">
                </div>
                <div class="w-3/4 h-full">
                    <p class="text-base-content/80 ">Total de Representantes</p>
                    <b class="text-4xl">{totalPersonas.representantes}</b>
                </div>
            </div>                    
            <div class="bg-base-100 w-1/3 h-full rounded-md p-2 flex items-center justify-between gap-2">
                <div class="h-full rounded-md bg-base-300 w-20 border border-base-content/20">
                    <img src="{stat_icon}" alt="" class="size-full icon">
                </div>
                <div class="w-3/4 h-full py-2">
                    <p class="text-base-content/80 ">Total de Empleados</p>
                    <b class="text-4xl">{totalPersonas.empleados}</b>
                </div>
            </div> 
        </div>

        <div class="w-full min-h-20 mt-3 flex items-start justify-start gap-4 animate-x" style="--delay: 500ms;">
            <div class="chart-container flex items-center justify-center bg-base-100 w-3/4 p-3 rounded-xl">
                <canvas id="lineChart"></canvas>
            </div>

            <div class="chart-container flex items-center justify-center bg-base-100 w-[35%] p-3 rounded-xl">
                <canvas id="donutChart"></canvas>
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

<style>
</style>