
<script lang="ts">
    let { changeContent, setFormValues }: { setFormValues: (content: any, values: any) => void, changeContent: (newContent: any) => void } = $props()

    import icon from "$lib/images/icons/add_24dp_000000_FILL0_wght400_GRAD0_opsz24.svg"
</script>


<div class="w-full mt-4 rounded-xl bg-base-100 p-4 h-max shadow-md animate-x
border border-base-content/30" style="--delay: 100ms">
    <div>
        <h1 class="text-2xl font-bold border-b-[3px] border-primary/70 w-fit animate-x" style="--delay: 700ms" >Datos Familiares</h1>
    </div>

    <div class="divider m-0 p-0"></div>
        
    <div class="w-full flex items-start justify-start gap-4 mt-2 relative *:border *:border-base-content/20 *:p-4 *:rounded-xl">
        <div class="w-1/3 animate--y
        flex items-start justify-start flex-col" style="--delay: 400ms">
            <div class="flex items-center justify-start gap-2 size-fit">
                <img src="{icon}" alt="">
                <div>
                    <h1 class="text-lg font-bold border-b-[3px] border-success/70 w-fit
                    text-base-content/80">Entrega</h1>
                    <p class="text-base-content/70 text-sm mt-0.5">Persona/familiar autorizado para entregar al niño en la institución.</p>
                </div>
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
                        <b class="label-text">Nombre</b>
                    </div>
                    <input type="text" name="nombre_familiar_entrega" class="input input-sm input-bordered bg-base-200">
                </div>                           <div class="form-control">
                    <div class="label">
                        <b class="label-text">Apellido</b>
                    </div>
                    <input type="text" name="apellido_familiar_entrega" class="input input-sm input-bordered bg-base-200">
                </div>           
                <div class="form-control">
                    <div class="label">
                        <b class="label-text">Sexo</b>
                    </div>
                    <select class="btn btn-sm border border-base-content/40" name="sexo_familiar_entrega">
                        <option disabled selected>Elegir</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Femenino">Femenino</option>
                    </select>
                </div>           
            </div>
        </div> 

        <div class="w-1/3 animate--y
        flex items-start justify-start flex-col" style="--delay: 400ms">
            <div class="flex items-center justify-start gap-2 size-fit">
                <img src="{icon}" alt="">
                <div>
                    <h1 class="text-lg font-bold border-b-[3px] border-error/70 w-fit
                    text-base-content/80">Retiro</h1>
                    <p class="text-base-content/70 text-sm mt-0.5">Persona/familiar autorizado para retirar al niño en hora de salida.</p>
                </div>
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
                        <b class="label-text">Nombre</b>
                    </div>
                    <input type="text" name="nombre_familiar_entrega" class="input input-sm input-bordered bg-base-200">
                </div>                           <div class="form-control">
                    <div class="label">
                        <b class="label-text">Apellido</b>
                    </div>
                    <input type="text" name="apellido_familiar_entrega" class="input input-sm input-bordered bg-base-200">
                </div>           
                <div class="form-control">
                    <div class="label">
                        <b class="label-text">Sexo</b>
                    </div>
                    <select class="btn btn-sm border border-base-content/40" name="sexo_familiar_entrega">
                        <option disabled selected>Elegir</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Femenino">Femenino</option>
                    </select>
                </div>           
            </div>
        </div> 

        <div class="w-1/3 animate--y
        flex items-start justify-start flex-col" style="--delay: 400ms">
            <div class="flex items-center justify-start gap-2 size-fit">
                <img src="{icon}" alt="">
                <h1 class="text-lg font-bold border-b-[3px] border-secondary/70 w-fit
                text-base-content/80">Familiar Adicional</h1>
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
                        <b class="label-text">Nombre</b>
                    </div>
                    <input type="text" name="nombre_familiar_entrega" class="input input-sm input-bordered bg-base-200">
                </div>                           <div class="form-control">
                    <div class="label">
                        <b class="label-text">Apellido</b>
                    </div>
                    <input type="text" name="apellido_familiar_entrega" class="input input-sm input-bordered bg-base-200">
                </div>           
                <div class="form-control">
                    <div class="label">
                        <b class="label-text">Sexo</b>
                    </div>
                    <select class="btn btn-sm border border-base-content/40" name="sexo_familiar_entrega">
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
        <button type="button" onclick={() => { changeContent("escolar") }} class="btn btn-sm btn-primary">Atrás</button>
        <button type="button" onclick={() => { changeContent("documentos") }} class="btn btn-sm btn-primary">Siguiente</button>
    </div>
</div>

<style lang="postcss">

</style>