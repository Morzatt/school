import { fail } from "@sveltejs/kit"
import z, { ZodError, ZodSchema } from "zod"
import { capitalizeFirstLetter } from "./capitlizeFirstLetter"
import type pino from "pino"

// INPUT VALIDATION FUNCTION
export function validateObject(obj: object, schema: ZodSchema) {
    const result = schema.safeParse(obj)
    return result
}

export function formatFieldName(word: string) {
    let substrs = word.split("_")
    let result = ""
    for (let strs of substrs) {
       result = result.concat(capitalizeFirstLetter(strs).concat(" ")) 
    }
    return result
}

export function newValidationFailObject(error: ZodError<any>, log?: pino.Logger<never, boolean>) {
    let aditional: { campo: string, validation: string[] | undefined }[] = []
    let errors = error.flatten().fieldErrors
    for (let key in errors) {
        aditional.push({ campo: formatFieldName(key), validation: errors[key] })
    }
    log?.error({ msg: "Malformacion de datos, no pudieron ser validados.", datos: aditional }); 
    return fail(400, { success: false, type: "Warning", message: "Error de Validación", aditional: aditional });
}

// REGISTER
const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[\W])(?!.*\s).{8,32}$/
export const registerUserSchema = z.object({
    nombre: z.string().min(1, "Campo vacío.").min(4, "Mínimo de 4 caracteres").max(20, "Máximo de 20 caracteres").trim(),
    apellido: z.string().min(1, "Campo vacío.").min(4, "Mínimo de 4 carácteres").max(20, "Máximo de 20 caracteres").trim(),
    // email: z.string().min(1, "Campo vacío.").email("Email no válido").trim(),
    usuario: z.string().min(1, "Campo vacío.").min(4, "Mínimo de 4 carácteres").max(20, "Máximo de 20 caracteres").trim(),
    contraseña: z.string().min(1, "Campo vacío.").regex(passwordRegex, 
        `Su contraseña no cumple con los parametros de seguridad minimos: debe de contener al menos 
        8 caracteres, una letra mayuscula, una letra minuscula y un caracter especial.`)
})

export const pregsegSchema = z.object({
    usuario: z.string().min(1, "campo vacío.").min(4, "mínimo de 4 caracteres").max(20, "máximo de 20 caracteres").trim(),
    preg_1: z.string().min(1, "Campo vacío.").min(2, "Mínimo de 2 caracteres").max(200, "Máximo de 0 caracteres").trim(),
    res_1: z.string().min(1, "Campo vacío.").min(2, "Mínimo de 2 caracteres").max(200, "Máximo de 0 caracteres").trim().toLowerCase(),
    preg_2: z.string().min(1, "Campo vacío.").min(2, "Mínimo de 2 caracteres").max(200, "Máximo de 0 caracteres").trim(),
    res_2: z.string().min(1, "Campo vacío.").min(2, "Mínimo de 2 caracteres").max(200, "Máximo de 0 caracteres").trim().toLowerCase(),
})

// LOGIN
export const loginSchema = z.object({
    usuario: z.string().min(1, "Campo vacío.").trim(),
    contraseña: z.string().min(1, "Campo vacío.").trim(),
    captcha: z.string()
})

// Recovery Check
export const recoverySchema = z.object({
    usuario: z.string().min(1, "campo vacío.").max(30, "máximo de 30 caracteres").trim(),
    res_1: z.string().min(1, "Campo vacío.").trim(),
    res_2: z.string().min(1, "Campo vacío.").trim(),
    contraseña: z.string().min(1, "Campo vacío.").regex(passwordRegex, 
        `Su contraseña no cumple con los parametros de seguridad minimos: debe de contener al menos 
        8 caracteres, una letra mayuscula, una letra minuscula y un caracter especial.`)
})

export const InsertEmpleadoSchema = z.object({
    cedula: z.string().min(1, 'El campo no puede estar vacio'),
    primer_nombre: z.string().min(1, 'El campo no puede estar vacio'),
    segundo_nombre: z.string().min(1, 'El campo no puede estar vacio'),
    primer_apellido: z.string().min(1, 'El campo no puede estar vacio'),
    segundo_apellido:z.string().min(1, 'El campo no puede estar vacio'),
    sexo: z.string().min(1, 'El campo no puede estar vacio'),
    fecha_nacimiento: z.string().min(1, 'El campo no puede estar vacio'),
    edad:z.string().min(1, 'El campo no puede estar vacio'),
    direccion: z.string().min(1, 'El campo no puede estar vacio'),
    grado_instruccion: z.string().min(1, 'El campo no puede estar vacio'),
    especializacion: z.string().min(1, 'El campo no puede estar vacio'),
    cargo: z.string().min(1, 'El campo no puede estar vacio'),
    area: z.string().min(1, 'El campo no puede estar vacio'),
    fecha_ingreso:z.string().min(1, 'El campo no puede estar vacio'),
    tiempo_servicio: z.string().min(1, 'El campo no puede estar vacio'),
    turno:z.string().min(1, 'El campo no puede estar vacio'),
})

export const insertAulaSchema = z.object({
    numero: z.string().min(1, "El campo no puede estar vacio"),
    nivel: z.string().min(1, "El campo no puede estar vacio"),
    seccion: z.string().min(1, "El campo no puede estar vacio"),
    turno: z.string().min(1, "El campo no puede estar vacio"),
    profesor: z.string().min(1, "El campo no puede estar vacio"),
})


function setAge(date: Date) {
    date.setFullYear(date.getFullYear() - 18)
    date.setMonth(0)
    date.setDate(1)
    return date
}
let underAgeDate = setAge(new Date())

export const AlumnoSchema = z.object({
    cedula: z.string(),
    nacionalidad: z.string().min(1, 'El campo no puede estar vacío'),
    primer_nombre: z.string().min(1, 'El campo no puede estar vacío'),
    segundo_nombre: z.string(),
    primer_apellido: z.string().min(1, 'El campo no puede estar vacío'),
    segundo_apellido: z.string(),
    fecha_nacimiento: z.string().min(1, 'El campo no puede estar vacío'),
    sexo: z.string().min(1, 'El campo no puede estar vacío'),
    lateralidad: z.string().min(1, 'El campo no puede estar vacío'),
    peso: z.string(),
    estatura: z.string(),
    condicion: z.string().optional(),
    detalles_condicion: z.string().optional(),
    calzado: z.string(),
    camisa: z.string(),
    pantalon: z.string(),
    hasCedula: z.string(),

    representante: z.string().min(1, 'El campo no puede estar vacío'),
    relacion: z.string().min(1, 'El campo no puede estar vacío')
});

export const RepresentanteSchema = z.object({
    cedula: z.string().min(1, 'El campo no puede estar vacío'),
    estado_civil: z.string().min(1, 'El campo no puede estar vacío'),
    nacionalidad: z.string().min(1, 'El campo no puede estar vacío'),
    nombre: z.string().min(1, 'El campo no puede estar vacío'),
    apellido: z.string().min(1, 'El campo no puede estar vacío'),
    sexo: z.string().min(1, 'El campo no puede estar vacío'),
    fecha_nacimiento: z.string().min(1, 'El campo no puede estar vacío'),
    direccion: z.string().min(1, 'El campo no puede estar vacío'),
    correo_electronico: z.string().email('El correo electrónico no es válido'),
    ocupacion: z.string().min(1, 'El campo no puede estar vacío'),
    grado_instruccion: z.string().min(1, 'El campo no puede estar vacío'),
});