<script lang="ts">
    let { hasCedula, changeContent, setFormValues }: { setFormValues: (content: any, values: any) => void, hasCedula: string, changeContent: (newContent: any) => void } = $props()

    import icon from "$lib/images/icons/add_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"

    let condicion = $state(false)
    let cedula : string = $state("")
    let nacionalidad : string = $state("")
    let primer_nombre : string = $state("")
    let segundo_nombre : string = $state("")
    let primer_apellido : string = $state("")
    let segundo_apellido : string = $state("")
    let fecha_nacimiento : string = $state("")
    let sexo : string = $state("")

    function up() {
        setFormValues('personal', [
            {
                key: "cedula",
                value: cedula
            },
            {
                key: "nacionalidad",
                value: nacionalidad 
            },
            {
                key: "primer_nombre",
                value: primer_nombre 
            },
            {
                key: "segundo_nombre",
                value: segundo_nombre
            },
            {
                key: "primer_apellido",
                value: primer_apellido
            },
            {
                key: "segundo_apellido",
                value: segundo_apellido
            },
            {
                key: "fecha_nacimiento",
                value: fecha_nacimiento
            },
            {
                key: "sexo",
                value: sexo
            },
        ])
    }

    function down() {
        setFormValues('personal', [])
    }
</script>


<div class="w-full mt-4 rounded-xl bg-base-100 p-4 h-max shadow-md animate-x
border border-base-content/30" style="--delay: 100ms">
    <div>
        <h1 class="text-2xl font-bold border-b-[3px] border-primary/70 w-fit animate-x" style="--delay: 700ms" >Datos Escolares</h1>
    </div>

    <div class="divider m-0 p-0"></div>

    <div class="w-full flex items-start justify-between gap-4 mt-2 relative *:border *:border-base-content/20 *:p-4 *:rounded-xl">
        <div class="w-1/3 animate--y
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
                    <input type="text" name="lateralidad" class="input input-sm input-bordered bg-base-200">
                </div>           

                <div class="form-control">
                    <div class="label">
                        <b class="label-text">Peso</b>
                    </div>
                    <input type="text" name="peso" class="input input-sm input-bordered bg-base-200">
                </div>           

                <div class="form-control">
                    <div class="label">
                        <b class="label-text">Estatura</b>
                    </div>
                    <input type="text" name="estatura" class="input input-sm input-bordered bg-base-200">
                </div>  
            </div>
        </div> 

        <div class="w-1/3 animate--y
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
                    <input type="text" name="condicion" class="input input-sm input-bordered bg-base-200">
                </div>           
            </div>
        </div> 

        <div class="w-1/3 animate--y
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
                    <input type="number" name="calzado" class="input input-sm input-bordered bg-base-200">
                </div>           

                <div class="form-control">
                    <div class="label">
                        <b class="label-text">Camisa</b>
                    </div>
                    <input type="text" name="camisa" class="input input-sm input-bordered bg-base-200">
                </div>           

                <div class="form-control">
                    <div class="label">
                        <b class="label-text">Pantalon</b>
                    </div>
                    <input type="number" name="pantalon" class="input input-sm input-bordered bg-base-200">
                </div>   
            </div>
        </div> 
    </div>

    <div class="divider pb-0 mb-2"></div>

    <div class="w-full flex items-start justify-between">
        <button type="button" onclick={() => { down(); changeContent("personal") }} class="btn btn-sm btn-primary">Atrás</button>
        <button type="button" onclick={() => { changeContent("familiar") }} class="btn btn-sm btn-primary">Siguiente</button>
    </div>
</div>

<style lang="postcss">

</style>