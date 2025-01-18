<script lang="ts">
    import "../../../app.css"
    import { slide } from "svelte/transition"
    import { sineInOut } from "svelte/easing";
    import { enhance } from "$app/forms";
    import pwdIcon from "$lib/images/icons/details_icon.svg"
    import { basePath, showPwd } from "$lib";
    import Alert from "$lib/components/Messages/Alert.svelte";
    import type { ActionData, PageData } from "./$types";
    import { goto, invalidateAll } from "$app/navigation";
    import Captcha from "$lib/components/Captcha/Captcha.svelte";

    import bg_1 from "$lib/images/bg-1.gif"

    let pageData: { data: PageData, form: ActionData } = $props()

    let { form } = $derived(pageData)
    let { text, data } = $derived(pageData.data)

    function invalidateLoad() {
        let response = invalidateAll()
        return response
    }

    type FormContent = "login" | "register" | "recovery"
    let formContent: FormContent = $state("login")
    function changeContent() {
        formContent === "login" ? formContent = "register" : formContent = "login"
    }

    function addClass(element: HTMLElement, classes: string[]) {
        for (let i in classes) {
            element.classList.add(i)
        }
    }

    function removeClass(element: HTMLElement, classes: string[]) {
        for (let i in classes) {
            element.classList.remove(i)
        }
    }

    async function checkUsername() {
        let indicator = document.getElementById("user_indicator") as HTMLSpanElement
        let username_input = document.getElementById("register_username") as HTMLInputElement
        if (username_input.value == "") {
            removeClass(indicator, ["text-red-500"])
            addClass(indicator, ["text-gray-400"])
            indicator.classList.remove("text-green-700")
            indicator.textContent = "Inserte Usuario"
            return
        }
        try {
            let result = await fetch(`${basePath}/auth?username=${username_input.value}`)
            if (result.status === 200) {
                indicator.classList.remove("text-red-500")
                indicator.classList.add("text-green-700")
                indicator.textContent = "Usuario Disponible"
            } else {
                indicator.classList.remove("text-green-700")
                indicator.classList.add("text-red-500")
                indicator.textContent = "Usuario Ocupado"
            }   
        } catch (error) {
            console.log(error)        
        }
    }

    async function checkPregSeg() {
        let indicator = document.getElementById("recovery_user_indicator") as HTMLSpanElement
        let username_input = document.getElementById("recovery_username") as HTMLInputElement

        let preg_1_indicator = document.getElementById("preg_1_indicator") as HTMLSpanElement
        let preg_2_indicator = document.getElementById("preg_2_indicator") as HTMLSpanElement

        if (username_input.value == "") {
            removeClass(indicator, ["text-red-500"])
            addClass(indicator, ["text-gray-400"])
            indicator.classList.remove("text-green-700")
            indicator.textContent = "Inserte Usuario"
            preg_1_indicator.textContent = "Pregunta de Seguridad"
            preg_2_indicator.textContent = "Pregunta de Seguridad"
            return
        }

        try {
            let result = await fetch(`${basePath}/auth?username=${username_input.value}`)
            if (result.status !== 200) {
                indicator.classList.remove("text-red-500")
                indicator.classList.add("text-green-700")
                indicator.textContent = "Usuario Obtenido"

                let response = await fetch(`${basePath}/auth?username=${username_input.value}`, {
                    method: "POST",
                })
                if (response.ok) {
                    let data = await response.json()
                    console.log("data: ", data)
                    preg_1_indicator.textContent= data.preg_1
                    preg_2_indicator.textContent= data.preg_2
                }
            } else {
                indicator.classList.remove("text-green-700")
                indicator.classList.add("text-red-500")
                indicator.textContent = "El usuario no Existe"
                preg_1_indicator.textContent = "Pregunta de Seguridad"
                preg_2_indicator.textContent = "Pregunta de Seguridad"
            }   
        } catch (error) {
            console.log(error)        
        }
    }

    $effect(() => {
        if (form?.success && form?.form === "login") { setTimeout(() => { goto("/") }, 1000) }
    })
    let captchaResult = $state(false);
</script>

{#snippet pregseg()}
    <form action="?/recovery" method="POST" use:enhance
    class="w-full flex flex-col gap-2 items-center mt-2 p-2" transition:slide={{axis: "y", duration: 150, easing: sineInOut}}>
        <h1 class="text-3xl font-bold">Recuperar Contraseña</h1>
        <p class="text-xs text-center mb-1">Cambie su contraseña en caso de haberla perdido/olvidado</p>

        <div class="w-full flex items-center justify-around gap-2">
            <label class="form-control w-3/4">
                <div class="label">
                    <span class="text-xs text-gray-400" id="recovery_user_indicator">Nombre de Usuario</span>
                </div>

                <label class="input input-md rounded-none input-bordered flex items-center gap-2 w-full">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        class="h-4 w-4 opacity-70">
                        <path
                        d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                    </svg>
                    <input type="text" class="w-full grow shrink" placeholder="Usuario" name="usuario" id="recovery_username"
                    oninput="{checkPregSeg}"/>
                </label>
            </label>
        </div>

        <div class="w-full gap-2">
            <label class="form-control w-full">
                <div class="label">
                    <span class="text-xs text-gray-400" id="preg_1_indicator">Pregunta de Seguridad</span>
                </div>

                <label class="input input-md rounded-none input-bordered flex items-center gap-2 w-full">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        class="h-4 w-4 opacity-70">
                        <path
                        d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                    </svg>
                    <input type="text" class="w-full grow shrink" placeholder="Pregunta #1" name="res_1" id="register_username"/>
                </label>
            </label>
            <label class="form-control w-full">
                <div class="label">
                    <span class="text-xs text-gray-400" id="preg_2_indicator">Pregunta de Seguridad</span>
                </div>

                <label class="input input-md rounded-none input-bordered flex items-center gap-2 w-full">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        class="h-4 w-4 opacity-70">
                        <path
                        d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                    </svg>
                    <input type="text" class="w-full grow shrink" placeholder="Pregunta #2" name="res_2" id="register_username"/>
                </label>
            </label>
        </div>

        <label class="input input-md rounded-none input-bordered flex items-center gap-2 w-full mt-1">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                class="h-4 w-4 opacity-70">
                <path
                d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
            </svg>
            <input type="text" class="w-full grow shrink" placeholder="Nueva Contraseña" id="recoveryPwd" name="contraseña" />
            
            <button class="tooltip" data-tip="Mostrar Contraseña" type="button" onclick="{() => {showPwd("recoveryPwd")}}">
                <img src="{pwdIcon}" alt="">
            </button>
        </label>

        <button class="btn btn-wide mt-4 bg-[#d6d0a5] text-orange-950" type="submit">Confirmar</button>
   </form> 
{/snippet}

{#snippet registerForm()}
    <form action="?/register" method="POST" use:enhance
    class="w-full flex flex-col gap-2 items-center mt-4 p-2" transition:slide={{axis: "y", duration: 150, easing: sineInOut}}>
        <h1 class="text-3xl font-bold">Registrarse</h1>
        <p class="text-xs text-center mb-3">Cree un usuario con sus datos personales para comenzar a hacer uso del sistema.</p>

        <div class="w-full flex items-center justify-around gap-2 mt-5">
            <label class="input input-md rounded-none input-bordered flex items-center gap-2 w-2/4">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    class="h-4 w-4 opacity-70">
                    <path
                    d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                </svg>
                <input type="text" class="w-full grow shrink" placeholder="Nombre" name="nombre" />
            </label>

            <label class="input input-md rounded-none input-bordered flex items-center gap-2 w-2/4">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    class="h-4 w-4 opacity-70">
                    <path
                    d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                </svg>
                <input type="text" class="w-full grow shrink" placeholder="Apellido" name="apellido"/>
            </label>
        </div>

        <label class="form-control w-full">
            <div class="label">
                <span class="text-xs text-gray-400" id="user_indicator">Inserte Usuario</span>
            </div>

            <label class="input input-md rounded-none input-bordered flex items-center gap-2 w-full">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    class="h-4 w-4 opacity-70">
                    <path
                    d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                </svg>
                <input type="text" class="w-full grow shrink" placeholder="Usuario" name="usuario" id="register_username"
                oninput="{checkUsername}"/>
            </label>
        </label>

        <label class="input input-md rounded-none input-bordered flex items-center gap-2 w-full mt-1">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                class="h-4 w-4 opacity-70">
                <path
                d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
            </svg>
            <input type="password" class="w-full grow shrink" placeholder="Contraseña" id="registerPwd" name="contraseña" />
            
            <button class="tooltip" data-tip="Mostrar Contraseña" type="button" onclick="{() => {showPwd("registerPwd")}}">
                <img src="{pwdIcon}" alt="">
            </button>
        </label>

        <button class="btn btn-wide mt-4 bg-red-300 text-orange-950" type="submit">Registrarse</button>
    </form>
{/snippet}

{#snippet loginForm()}
    <form action="?/login" method="POST" use:enhance
    class="size-full flex flex-col items-center justify-center p-4" transition:slide={{axis: "y", duration: 150, easing: sineInOut}}>
        <h1 class="text-3xl font-bold mt-6">Ingresar</h1>
        <p class="text-xs text-center mb-3 mt-1">Ingrese sus datos de usuario para acceder.</p>

        <div class="w-full flex flex-col gap-3 mt-4">
            <label class="input rounded-none input-bordered flex items-center gap-2">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    class="h-4 w-4 opacity-70">
                    <path
                    d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                </svg>
                <input type="text" class="grow" placeholder="Usuario" name="usuario" />
            </label>

            <label class="input input-bordered flex items-center rounded-none gap-2">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    class="h-4 w-4 opacity-70">
                    <path
                    fill-rule="evenodd"
                    d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                    clip-rule="evenodd" />
                </svg>
                <input type="password" class="grow" placeholder="Contraseña" id="loginPwd" name="contraseña"/>

                <button class="tooltip" data-tip="Mostrar Contraseña" type="button" onclick="{() => {showPwd("loginPwd")}}">
                    <img src="{pwdIcon}" alt="">
                </button>
            </label>

            <Captcha text={ text } data={ data } invalidate={invalidateLoad} bind:result={captchaResult}/>
            <input type="hidden" name="captcha" value={captchaResult}>
        </div>
        <button class="btn btn-wide mt-4 bg-blue-200 " type="submit">Acceder</button>

        <div class="flex items-center justify-around text-xs mt-2 gap-2 p-1">
            <p>¿Ha olvidado su Contraseña?</p>
            <button type="button" class="text-blue-400" onclick="{() => {formContent = "recovery"}}">Recuperar Contraseña</button>
        </div>
    </form>
{/snippet}

<main transition:slide={{ duration: 200, easing: sineInOut, axis: "y" }}>
    <Alert form={ form } styles="absolute left-10 top-6 max-w-[25rem]"/>

	<div class="h-screen w-full lg:w-[85%] xl:w-3/4 border-0 border-red-500 flex items-center justify-center">
        <div class="p-5 size-full">
            <div class="main-container size-full
                p-2 bg-white rounded-xl shadow-xl
                min-[730px]:flex min-[730px]:items-center min-[730px]:justify-between">

                <div class="xl:w-3/5 xl:h-full rounded-xl rounded-tr-none rounded-br-none">
                    <img src="{bg_1}" alt="" class="size-full rounded-xl bg-base-300">
                </div>

                <div class="xl:w-2/5 xl:h-full rounded-xl rounded-tl-none rounded-bl-none p-2 overflow-hidden">
                    <div class="w-full flex items-center justify-end">
                        <button class="p-1 bg-base-200/50 rounded-md font-bold px-2 text-sm hover:bg-base-200/70 active:bg-base-300"
                         onclick="{() => {changeContent()}}">{formContent === "login" ? "Registrarse" : "Acceder"}</button>
                    </div>

                    <div class="p-1 min-h-[30rem] mt-2 w-full overflow-hidden ">
                        {#if formContent === "register"}
                            {@render registerForm()} 
                        {:else if formContent === "recovery"}
                            {@render pregseg()} 
                        {:else}
                            {@render loginForm()} 
                        {/if}
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

<style lang="postcss">
	main {
		@apply max-h-screen w-full flex items-center justify-center overflow-y-hidden bg-[whitesmoke];
		filter: progid: DXImageTransform.Microsoft.gradient( startColorstr="#FFFFFF", endColorstr="#EEEEFA", GradientType=1 );
	}
    label input {
        @apply w-full grow shrink;
    }
</style>