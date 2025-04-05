<script lang="ts">
    let { changeContent, setFormValues }: { setFormValues: (content: any, values: any) => void, changeContent: (newContent: any) => void } = $props()

    import icon from "$lib/images/icons/add_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
</script>


<div class="w-full mt-4 rounded-xl bg-base-100 p-4 h-max shadow-md animate-x
border border-base-content/30" style="--delay: 100ms">
    <div>
        <h1 class="text-2xl font-bold border-b-[3px] border-primary/70 w-fit animate-x" style="--delay: 700ms" >Documentos</h1>
    </div>

    <div class="divider m-0 p-0"></div>

    <div class="w-full flex items-start justify-start gap-4 mt-2 relative *:border *:border-base-content/20 *:p-4 *:rounded-xl">
        <div class="w-1/3 animate--y
        flex items-start justify-start flex-col" style="--delay: 400ms">
            <div class="flex items-center justify-start gap-2 size-fit">
                <img src="{icon}" alt="">
                <h1 class="text-lg font-bold border-b-[3px] border-secondary/70 w-fit
                text-base-content/80" >Identificación</h1>
            </div> 

            <div class="pl-6 mt-2">
                <div class="form-control">
                    <div class="label">
                        <b class="label-text">Cédula de Identidad</b>
                    </div>
                    <input type="text" name="cedula" class="input input-sm input-bordered bg-base-200">
                </div>           

                <div class="form-control">
                    <div class="label">
                        <b class="label-text">Nacionalidad</b>
                    </div>
                    <select class="btn btn-sm border border-base-content/40">
                        <option disabled selected>Elegir</option>
                        <option value="Venezolano">Venezolano</option>
                        <option value="Extranjero">Extranjero</option>
                    </select>
                </div>           
            </div>
        </div> 

        <div class="w-1/3 animate--y
        flex items-start justify-start flex-col" style="--delay: 500ms">
            <div class="flex items-center justify-start gap-2 size-fit">
                <img src="{icon}" alt="">
                <h1 class="text-lg font-bold border-b-[3px] border-secondary/70 w-fit
                text-base-content/80">Nombre y Apellido</h1>
            </div> 

            <div class="pl-6 mt-2">
                <div class="form-control">
                    <div class="label">
                        <b class="label-text">Primer Nombre</b>
                    </div>
                    <input type="text" name="primer_nombre" class="input input-sm input-bordered bg-base-200">
                </div>           

                <div class="form-control">
                    <div class="label">
                        <b class="label-text">Segundo Nombre</b>
                    </div>
                    <input type="text" name="segundo_nombre" class="input input-sm input-bordered bg-base-200">
                </div>           

                <div class="form-control">
                    <div class="label">
                        <b class="label-text">Primer Apellido</b>
                    </div>
                    <input type="text" name="primer_apellido" class="input input-sm input-bordered bg-base-200">
                </div>           

                <div class="form-control">
                    <div class="label">
                        <b class="label-text">Segundo Apellido</b>
                    </div>
                    <input type="text" name="segundo_apellido" class="input input-sm input-bordered bg-base-200">
                </div>           
            </div>
        </div> 

        <div class="w-1/3 animate--y
        flex items-start justify-start flex-col" style="--delay: 600ms">
            <div class="flex items-center justify-start gap-2 size-fit">
                <img src="{icon}" alt="">
                <h1 class="text-lg font-bold border-b-[3px] border-secondary/70 w-fit
                text-base-content/80">Datos Personales</h1>
            </div> 

            <div class="pl-6 mt-2">
                <div class="form-control">
                    <div class="label">
                        <b class="label-text">Fecha de Nacimiento</b>
                    </div>
                    <input type="date" name="fecha_nacimiento" class="input input-sm input-bordered bg-base-200">
                </div>           

                <div class="form-control">
                    <div class="label">
                        <b class="label-text">Sexo</b>
                    </div>
                    <select class="btn btn-sm border border-base-content/40">
                        <option disabled selected>Elegir</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Femenino">Femenino</option>
                    </select>
                </div>           
            </div>
        </div> 
    </div>

    <div class="divider pb-0 mb-2"></div>

    <div class="w-full flex items-start justify-between">
        <button type="button" onclick={() => { changeContent("familiar") }} class="btn btn-sm btn-primary">Atrás</button>
        <button type="submit" class="btn btn-sm btn-success">Enviar</button>
    </div>
</div>

<style lang="postcss">

</style>