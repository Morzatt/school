<script lang="ts">
    import { capitalizeFirstLetter } from "$lib/utils/capitlizeFirstLetter";
    import type { PageData } from "./$types";
    import stat_icon from "$lib/images/icons/add_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
    import { onMount } from "svelte";
    import { Chart } from "chart.js/auto";


    let { data }: { data: PageData }= $props()
    let { usuario } = $derived(data)

        // Datos de ejemplo (puedes reemplazarlos con datos reales)
    const data2 = {
      labels: ['1° Primaria - A', '2° Primaria - B', '3° Primaria - A', '4° Secundaria - C', '5° Secundaria - A'],
      datasets: [{
        data: [25, 30, 22, 28, 20],
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
        ],
        borderWidth: 1
      }]
    };

    // Configuración del gráfico
    const config = {
      type: 'doughnut',
      data: data2,
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Distribución de Alumnos por Grado/Sección',
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
        <div class="flex justify-center bg-base-100 p-4 rounded-xl shadow-md animate-y" style="--delay: 220ms">
            <div class="flex flex-col items-center text-center gap-4 max-w-xl drop-shadow-sm">
                <span class="text-sm text-base-content/80">Bienvenido: <span class="text-accent">{capitalizeFirstLetter(usuario.role)}</span> <span class="text-primary">{usuario.nombre} {usuario.apellido}</span></span>
                <h1 class="text-3xl font-bold">Eficiencia Educativa en un Solo Panel<span class="loading loading-ring loading-xl"></span></h1>
                <span class="">
                    Centraliza el control de alumnos, profesores, aulas y horarios en una sola plataforma intuitiva.
                </span>
                <div class="flex gap-4">
                    <a class="btn btn-primary" href="/representantes">
                        Representantes
                    </a>

                    <a class="btn btn-neutral" href="/alumnos">
                        Alumnos
                    </a>
                </div>
            </div>
        </div>

        <div class="w-full h-20 mt-3 hidden lg:flex items-center justify-start gap-4 animate-y" style="--delay: 400ms">
            <div class="bg-base-100 w-1/4 h-full rounded-xl p-2 flex items-center justify-between gap-2">
                <div class="h-full rounded-full bg-base-300 w-20 border border-base-content/20">
                    <img src="{stat_icon}" alt="" class="size-full icon">
                </div>
                <div class="w-3/4 h-full py-2">
                    <p class="text-base-content/80 text-sm">Tasa de Retención</p>
                    <b>64.93%</b>
                </div>
            </div>               
            <div class="bg-base-100 w-1/4 h-full rounded-xl p-2 flex items-center justify-between gap-2">
                <div class="h-full rounded-full bg-base-300 w-20 border border-base-content/20">
                    <img src="{stat_icon}" alt="" class="size-full icon">
                </div>
                <div class="w-3/4 h-full">
                    <p class="text-base-content/80 text-sm">Tasa de Aprobración</p>
                    <b>34.20%</b>
                </div>
            </div>               
            <div class="bg-base-100 w-1/4 h-full rounded-xl p-2 flex items-center justify-between gap-2">
                <div class="h-full rounded-full bg-base-300 w-20 border border-base-content/20">
                    <img src="{stat_icon}" alt="" class="size-full icon">
                </div>
                <div class="w-3/4 h-full">
                    <p class="text-base-content/80 text-sm">Tasa de Aprobración</p>
                    <b>34.20%</b>
                </div>
            </div>          
        </div>

        <div class="w-full min-h-20 mt-3 flex items-start justify-start gap-4 animate-x" style="--delay: 500ms;">

            <div class="chart-container flex items-center justify-center bg-base-100 w-1/4 p-3 rounded-xl">
                <canvas id="donutChart"></canvas>
            </div>

            <div class="chart-container flex items-center justify-center bg-base-100 w-3/4 p-3 rounded-xl">
                <canvas id="lineChart"></canvas>
            </div>

        </div>
    </div>

    <div class="w-full h-full flex lg:w-1/4 flex-col gap-4 rounded-box bg-base-200 lg:max-w-sm p-6 shadow-md animate-x" style="--delay: 350ms">
        <!-- Header -->
        <div class="flex flex-col gap-4 items-center">
            <h1 class="font-bold text-xl">¿Necesita Ayuda?</h1>

            <span class="text-center text-sm">
                Aprende sobre los procedimientos, tutoriales, guías, entre otros.
                <a class="link link-accent">Vea la sección de ayuda</a> para aprender más.
            </span>
        </div>

        <!-- Body (Features) -->
        <div class="flex flex-col">
            <div class="divider mt-0"></div>

            <!-- Feature-->
            <div class="flex gap-8 items-center">
                <box-icon type='solid' name='universal-access'></box-icon>

                <div class="flex flex-col">
                    <h2 class="font-bold">Tutoriales</h2>
                    <span class="text-sm">Aprenda cómo usar el sistema mediante video tutoriales.</span>
                </div>
            </div>

            <div class="divider"></div>

            <!-- Feature-->
            <div class="flex gap-8 items-center">
                <box-icon type='solid' name='universal-access' t></box-icon>

                <div class="flex flex-col">
                    <h2 class="font-bold">Guias</h2>
                    <span class="text-sm">Ubique guías para cada caso de uso.</span>
                </div>
            </div>

            <div class="divider"></div>

            <!-- Feature-->
            <div class="flex gap-8 items-center">
                <i class="fa-solid fa-eye-slash fa-fw text-xl text-secondary"></i>

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