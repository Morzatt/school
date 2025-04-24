<script lang="ts">
    let { hasCedula, changeContent, setFormValues }: { setFormValues: (content: any, values: any) => void, hasCedula: string, changeContent: (newContent: any) => void } = $props()

    import icon from "$lib/images/icons/add_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"

    let lateralidad: string = $state("")
    let peso: string = $state("")
    let estatura: string = $state("")

    let condicion = $state(false)
    let detalles_condicion = $state("")

    let calzado: string = $state("")
    let camisa: string = $state("")
    let pantalon: string = $state("")

    function up() {
        setFormValues('escolar', [
            {
                key: "lateralidad",
                value: lateralidad
            },
            {
                key: "peso",
                value: peso 
            },
            {
                key: "estatura",
                value: estatura
            },
            {
                key: "condicion",
                value: condicion
            },
            {
                key: "detalles_condicion",
                value: detalles_condicion
            },
            {
                key: "calzado",
                value: calzado
            },
            {
                key: "camisa",
                value: camisa
            },
            {
                key: "pantalon",
                value: pantalon
            },
        ])
    }

    function down() {
        setFormValues('escolar', [])
    }
</script>


<div class="w-full mt-4 rounded-xl bg-base-100 p-4 h-max shadow-md animate-x
border border-base-content/30" style="--delay: 100ms">
    <div>
        <h1 class="text-2xl font-bold border-b-[3px] border-primary/70 w-fit animate-x" style="--delay: 700ms" >Datos Escolares</h1>
    </div>

    <div class="divider m-0 p-0"></div>

    <div class="w-full flex flex-col lg:flex-row items-start justify-between gap-4 mt-2 relative *:border *:border-base-content/20 *:p-4 *:rounded-xl">
        <div class="w-full lg:w-1/3 animate--y
        flex items-start justify-start flex-col" style="--delay: 400ms">
            <div class="flex items-center justify-start gap-2 size-fit">
                <img src="{icon}" alt="">
                <h1 class="text-lg font-bold border-b-[3px] border-secondary/70 w-fit
                text-base-content/80">Personales</h1>
            </div> 

            <div class="pl-6 mt-2">
                <div class="form-control">
                    <div class="label">
                        <b class="label-text">Lateralidad</b>
                    </div>
                    <select name="lateralidad" class="btn btn-bordered btn-sm border border-base-content/20 bg-base-200" bind:value={lateralidad}>
                        <option selected disabled>Elegir</option>
                        <option value="Diestro">Diestro</option>
                        <option value="Zurdo">Zurdo</option>
                    </select>
                </div>           

                <div class="form-control focus:outline-0">
                    <div class="label">
                        <b class="label-text">Peso</b>
                    </div>

                    <label class="flex items-center justify-start 
                    input input-sm input-bordered focus:outline-0 bg-base-200
                    rounded-md max-w-[7rem]">
                        <input type="number" name="peso" bind:value={peso}
                        placeholder="..."
                        class="max-w-[3rem] focus:outline-0" required>
                        <p class="select-none">Kilos</p>
                    </label>
                </div>

                <div class="form-control focus:outline-0">
                    <div class="label">
                        <b class="label-text">Estatura</b>
                    </div>

                    <label class="flex items-center justify-start 
                    input input-sm input-bordered focus:outline-0 bg-base-200
                    rounded-md max-w-[7rem]">
                        <input type="number" name="estatura"  bind:value={estatura}
                        placeholder="..."
                        class="max-w-[3rem] focus:outline-0" required>
                        <p class="select-none">Centimetros</p>
                    </label>
                </div>
            </div>
        </div> 

        <div class="w-full lg:w-1/3 animate--y
        flex items-start justify-start flex-col" style="--delay: 600ms">
            <div class="flex items-center justify-start gap-2 size-fit">
                <img src="{icon}" alt="">
                <div>
                    <h1 class="text-lg font-bold border-b-[3px] border-secondary/70 w-fit
                    text-base-content/80">Salud</h1>
                    <p class="text-base-content/70 text-sm mt-0.5">Indique patologias o condiciones especiales que deban ser consideradas.</p>
                </div>
            </div> 

            <div class="pl-6 mt-2">
                <div class="form-control">
                    <div class="label">
                        <b class="label-text">¿Presenta el Alumno alguna condición? <b>*</b> </b>
                    </div>
                    <div class="flex items-center justify-start gap-4 text-sm font-bold">
                        <div class="flex flex-col items-center justify-center">
                            <div>Si</div>
                            <input type="radio" value="true" name="radio-7" class="radio radio-success"
                            onclick="{() => { condicion = true; }}"/>
                        </div>

                        <div class="flex flex-col items-center justify-center">
                            <div>No</div>
                            <input type="radio" value="false" name="radio-7" class="radio radio-error"
                            onclick="{() => { condicion = false; }}"/>
                        </div>
                    </div>
                </div>           

                <div class="form-control tooltip" data-tip="Dejar en blanco en caso de no aplicar.">
                    <div class="label">
                        <b class="label-text">Indicar condicion <b>*</b></b>
                    </div>
                    <input type="text" name="detalles_condicion" class="input input-sm input-bordered bg-base-200" bind:value={detalles_condicion}>
                </div>           
            </div>
        </div> 

        <div class="w-full lg:w-1/3 animate--y
        flex items-start justify-start flex-col" style="--delay: 600ms">
            <div class="flex items-center justify-start gap-2 size-fit">
                <img src="{icon}" alt="">
                <div>
                    <h1 class="text-lg font-bold border-b-[3px] border-secondary/70 w-fit
                    text-base-content/80">Tallas</h1>
                    <p class="text-base-content/70 text-sm mt-0.5">Las tallas deberan ser actualizadas anualmente.</p>
                </div>
            </div> 

            <div class="pl-6 mt-2 [&_.form-control]:max-w-[7rem]">
                <div class="form-control">
                    <div class="label">
                        <b class="label-text">Calzado</b>
                    </div>
                    <input type="number" name="calzado" class="input input-sm input-bordered bg-base-200" bind:value={calzado}>
                </div>           

                <div class="form-control">
                    <div class="label">
                        <b class="label-text">Camisa</b>
                    </div>
                    <input type="text" name="camisa" class="input input-sm input-bordered bg-base-200" bind:value={camisa}>
                </div>           

                <div class="form-control">
                    <div class="label">
                        <b class="label-text">Pantalon</b>
                    </div>
                    <input type="number" name="pantalon" class="input input-sm input-bordered bg-base-200" bind:value={pantalon}>
                </div>   
            </div>
        </div> 
    </div>

    <div class="divider pb-0 mb-2"></div>

    <div class="w-full flex items-start justify-between">
        <button type="button" onclick={() => { down(); changeContent("personal") }} class="btn btn-sm btn-primary">Atrás</button>
        <button type="button" onclick={() => { up(); changeContent("familiar") }} class="btn btn-sm btn-primary">Siguiente</button>
    </div>
</div>

<style lang="postcss">

</style>