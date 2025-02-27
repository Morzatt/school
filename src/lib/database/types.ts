import type { 
    ColumnType,
    Insertable,
    JSONColumnType,
    Selectable,
    Updateable,
} from 'kysely'

export interface Database {
    usuarios: UsuariosTable,
    preguntas: PreguntasSeguridadTable,
    sessions: SessionsTable,
    alumnos: AlumnosTable,
    representantes: RepresentantesTable
    telefonos_representantes: TelefonosRepresentantesTable
    representantes_alumnos: RepresentantesAlumnosTable
}

// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// Usuarios
export type UsuariosTable = {
    nombre: string
    apellido: string
    usuario: string
    contraseña: string
    role: ColumnType<string, never, string>
    read: ColumnType<boolean, never, boolean>,
    write: ColumnType<boolean, never, boolean>,
    estado: ColumnType<Estados, never>
    created_at: ColumnType<Date, never>,
}

type Estados = "Activo" | "Bloqueado"
export type Usuario = Selectable<UsuariosTable>
export type NewUsuario = Insertable<UsuariosTable>
export type UpdateUsuario = Updateable<UsuariosTable>

// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// Preguntas de Seguridad
export type PreguntasSeguridadTable = {
    usuario: ColumnType<string, string, never>,
    preg_1: ColumnType<string, string>,
    res_1: ColumnType<string, string>,
    preg_2: ColumnType<string, string>,
    res_2: ColumnType<string, string>,
}
export type PregSeg = Selectable<PreguntasSeguridadTable>
export type InsertPregSeg = Insertable<PreguntasSeguridadTable>
export type UpdatePregSeg = Updateable<PreguntasSeguridadTable>

// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// Sessions 
export type SessionsTable = {
    usuario: ColumnType<string, string, never>,
    id: ColumnType<string, never, never>,
    created_at: ColumnType<Date, never, never>,
    expires_at: ColumnType<Date, string>,
    data: JSONColumnType<Usuario> | undefined
}

export type Session = Selectable<SessionsTable>
export type SessionInsertable = Insertable<SessionsTable>
export type SessionUpdateable = Updateable<SessionsTable>


// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// Alumnos 
// Cuando carajito saca cedula se cambia la ceudla escolar por la propia del alumno
export type AlumnosTable = {
    cedula_escolar: string,
    primer_nombre: string,
    segundo_nombre: string,
    primer_apellido: string,
    segundo_apellido:string,
    sexo: "Masculino" | "Femenino",
    fecha_nacimiento: ColumnType<Date, string, never>
    edad: string
    created_at: ColumnType<Date, never>,
}

export type Alumno = Selectable<AlumnosTable>
export type AlumnoInsertable = Insertable<AlumnosTable>
export type AlumnoUpdateable = Updateable<AlumnosTable>

// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// Representantes
export type RepresentantesTable = {
    cedula: ColumnType<string, string, never>,
    nombre: string,
    apellido: string,
    sexo: ColumnType<"Masculino" | "Femenino", "Masculino" | "Femenino", never>,
    direccion: string,
    correo_electronico: string,
}

export type Representante = Selectable<RepresentantesTable>
export type RepresentanteInsertable = Insertable<RepresentantesTable>
export type RepresentanteUpdateable = Updateable<RepresentantesTable>



// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// Telefonos Representantes
export type TelefonosRepresentantesTable = {
    representante: string,
    numero_telefono: string,
}

export type TelefonosRepresentante = Selectable<TelefonosRepresentantesTable>
export type TelefonosRepresentanteInsertable = Insertable<TelefonosRepresentantesTable>
export type TelefonosRepresentanteUpdateable = Updateable<TelefonosRepresentantesTable>




// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// Representantes - Alumnos
export type RepresentantesAlumnosTable = {
    id_representante: string,
    id_alumno: string,
    relacion: string
}

export type RepresentantesAlumnos = Selectable<RepresentantesAlumnosTable>
export type RepresentantesAlumnosInsertable = Insertable<RepresentantesAlumnosTable>
export type RepresentantesAlumnosUpdateable = Updateable<RepresentantesAlumnosTable>

