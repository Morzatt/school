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
    familiares_autorizados: FamiliaresAutorizadosTable,
    familiares_alumnos: FamiliaresAlumnosTable,
    representantes: RepresentantesTable,
    representantes_alumnos: RepresentantesAlumnosTable,
    grados_cursados: GradosCursadosTable,
    documentos_alumnos: DocumentosAlumnosTable,

    empleados: EmpleadosTable,

    grados: GradosTable,
    grados_alumnos: GradosAlumnosTable,
    materias: MateriasTable,

    bloques_horarios: BloquesHorariosTable,
    horarios_grados_alt: HorariosGradosAltTable,
    puntos_restauracion: PuntosRestauracionTable,
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
export type Themes = 'forest' | 'dark' | 'winter' | 'autumn' | 'light' | 'cupcake' | 'bumblebee' | 'emerald' | 'corporate' | 'synthwave' | 'retro' | 'valentine' | 'halloween' | 'autumn' | 'acid'

export type UsuariosTable = {
    nombre: string
    apellido: string
    usuario: string
    contraseña: string
    role: ColumnType<string, never, string>
    read: ColumnType<boolean, never, boolean>,
    write: ColumnType<boolean, never, boolean>,
    estado: ColumnType<Estados, Estados | undefined, Estados>
    created_at: ColumnType<Date, never>,
    theme: Themes,
}

type Estados = "Activo" | "Bloqueado" | 'Por Asignar'
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
export type AlumnosTable = {
    cedula_escolar: string,
    primer_nombre: string,
    segundo_nombre: string,
    primer_apellido: string,
    segundo_apellido: string,

    nacionalidad: "Venezolano" | "Extranjero",
    sexo: "Masculino" | "Femenino",
    fecha_nacimiento: ColumnType<Date, string, never>
    edad: number
    estado: ColumnType<'Activo' | 'Retirado', never, "Activo" | "Retirado">
    created_at: ColumnType<Date, never>,
    // direccion:string,

    lateralidad: "Diestro" | "Zurdo",
    peso: string,
    estatura: string,
    calzado: string,
    camisa: string,
    pantalon: string,
}

export type Alumno = Selectable<AlumnosTable>
export type AlumnoInsertable = Insertable<AlumnosTable>
export type AlumnoUpdateable = Updateable<AlumnosTable>

export type FamiliaresAutorizadosTable = {
    cedula: string,
    nombre: string,
    apellido: string,
    sexo: string,
}

export type FamiliarAutorizado = Selectable<FamiliaresAutorizadosTable>
export type FamiliarAutorizadoInsertable = Insertable<FamiliaresAutorizadosTable>
export type FamiliarAutorizadoUpdateable = Updateable<FamiliaresAutorizadosTable>

export type FamiliaresAlumnosTable = {
    id_alumno: string,
    id_familiar: string,
}

export type FamiliaresAlumno = Selectable<FamiliaresAlumnosTable>
export type FamiliaresAlumnoInsertable = Insertable<FamiliaresAlumnosTable>
export type FamiliaresAlumnoUpdateable = Updateable<FamiliaresAlumnosTable>

export type GradosCursadosTable = {
    id_alumno: string,
    grado: string,
    fecha: ColumnType<Date, string, never>,
    estado: string,
}

export type GradoCursado = Selectable<GradosCursadosTable>
export type GradoCursadoInsertable = Insertable<GradosCursadosTable>
export type GradoCursadoUpdateable = Updateable<GradosCursadosTable>


export type TiposDocumentos = 'partida_nacimiento' | 'foto_carnet' | 'cedula_estudiante' | 'cedula_representante' | 'certificado_vacunacion'
export type DocumentosAlumnosTable = {
    id_alumno: ColumnType<string, string, never>,
    tipo_documento: ColumnType<TiposDocumentos, TiposDocumentos, never>,
    path: string,
    ultima_edicion: ColumnType<Date, never, Date>,
}

export type DocumentoAlumno = Selectable<DocumentosAlumnosTable>
export type DocumentoAlumnoInsertable = Insertable<DocumentosAlumnosTable>
export type DocumentoAlumnoUpdateable = Updateable<DocumentosAlumnosTable>



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
    estado_civil: string,
    nacionalidad: string,
    nombre: string,
    apellido: string,
    sexo: ColumnType<"Masculino" | "Femenino", "Masculino" | "Femenino", never>,
    fecha_nacimiento: ColumnType<Date, string, never>
    edad: string,
    direccion: string,
    correo_electronico: string,
    ocupacion: string,
    grado_instruccion: string
    telefono_1: string,
    telefono_2: string | undefined,
    foto_path: string | undefined,
}

export type Representante = Selectable<RepresentantesTable>
export type RepresentanteInsertable = Insertable<RepresentantesTable>
export type RepresentanteUpdateable = Updateable<RepresentantesTable>

export type RepresentantesAlumnosTable = {
    id_representante: string,
    id_alumno: string,
    relacion: string
}

export type RepresentantesAlumnos = Selectable<RepresentantesAlumnosTable>
export type RepresentantesAlumnosInsertable = Insertable<RepresentantesAlumnosTable>
export type RepresentantesAlumnosUpdateable = Updateable<RepresentantesAlumnosTable>

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
//Empleados 
export type EmpleadosTable = {
    cedula: string,
    primer_nombre: string,
    segundo_nombre: string,
    primer_apellido: string,
    segundo_apellido: string,
    sexo: "Masculino" | "Femenino",
    fecha_nacimiento: ColumnType<Date, string, never>
    edad: string

    direccion: string,
    estado: ColumnType<'Activo' | 'Retirado', never>

    grado_instruccion: string,
    especializacion: string,
    cargo: string,

    area: string,
    fecha_ingreso: ColumnType<Date, string, never>
    tiempo_servicio: string,
    turno: Turnos

    foto_path: string | undefined
}

export type Empleado = Selectable<EmpleadosTable>
export type EmpleadoInsertable = Insertable<EmpleadosTable>
export type EmpleadoUpdateable = Updateable<EmpleadosTable>


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
// Grados
type FirstLetter<T extends string> = T extends `${infer A}${infer _}` ? `${A}` : never;
export type Numeros = '1' | '2' | '3' | '4' | '5' | '6'
export type Niveles = 'Primaria' | 'Inicial' | 'Bachillerato'
export type Secciones = 'A' | 'B' | 'C' | 'D'
export type Turnos = "Mañana" | "Tarde"
export type GradoID = `${Numeros}${FirstLetter<Niveles>}${Secciones}${FirstLetter<Turnos>}`

export type GradosTable = {
    id_grado: ColumnType<GradoID, GradoID, never>,
    numero: ColumnType<Numeros, Numeros, never>,
    nivel: ColumnType<Niveles, Niveles, never>,
    seccion: ColumnType<Secciones, Secciones, never>,
    turno: Turnos,
    profesor: ColumnType<string | null>,
}

export type Grado = Selectable<GradosTable>
export type GradoInsertable = Insertable<GradosTable>
export type GradoUpdateable = Updateable<GradosTable>

export type GradosAlumnosTable = {
    id_grado: GradoID,
    id_alumno: string
}

export type GradoAlumno = Selectable<GradosAlumnosTable>
export type GradoAlumnoInsertable = Insertable<GradosAlumnosTable>
export type GradoAlumnoUpdateable = Updateable<GradosAlumnosTable>

export type MateriasTable = {
    id_materia: ColumnType<string, never, never>,
    nombre_materia: string,
    color: string,
}

export type Materia = Selectable<MateriasTable>
export type MateriaInsertable = Insertable<MateriasTable>
export type MateriaUpdateable = Updateable<MateriasTable>

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
// BloquesHorarios
export type DiasSemana = "Lunes" | 'Martes' | 'Miercoles' | 'Jueves' | 'Viernes'
type FirstTwoLetters<T extends string> = T extends `${infer A}${infer B}${infer _}` ? `${A}${B}` : never;

export type BloqueID = `${number}${'A' | 't'}-${number}${'A' | 'T'}`
export type TimeString = `${number}${number}:${number}${number} ${'AM' | 'PM'}`

export type BloquesHorariosTable = {
    id_bloque: ColumnType<BloqueID, BloqueID, never>,
    hora_inicio: TimeString,
    hora_fin: TimeString,
    turno: Turnos
}

export type BloqueHorario = Selectable<BloquesHorariosTable>
export type BloqueHorarioInsertable = Insertable<BloquesHorariosTable>
export type BloqueHorarioUpdateable = Updateable<BloquesHorariosTable>

export type HorariosGradosTable = {
    id_bloque: BloqueID,
    id_grado: GradoID,
    cedula_profesor: string,
    id_materia: string,
}

export type HorarioGrado = Selectable<HorariosGradosTable>
export type HorarioGradoInsertable = Insertable<HorariosGradosTable>
export type HorarioGradoUpdateable = Updateable<HorariosGradosTable>

export type HorarioID = `${GradoID}:${BloqueID}`
export type HorariosGradosAltTable = {
    id_horario: ColumnType<HorarioID, HorarioID, never>,
    id_grado: ColumnType<GradoID, GradoID, never>,
    cedula_profesor: string,
    id_materia: string,
    dia_semana: DiasSemana,
    hora_inicio: TimeString,
    hora_fin: TimeString,
}

export type HorarioGradoAlt = Selectable<HorariosGradosAltTable>
export type HorarioGradoAltInsertable = Insertable<HorariosGradosAltTable>
export type HorarioGradoAltUpdateable = Updateable<HorariosGradosAltTable>

export type PuntosRestauracionTable = {
    backup_id: ColumnType<string, string, never>,
    nombre: string,
    path: string,
    fecha: ColumnType<Date, string, never>
}

export type PuntoRestauracion = Selectable<PuntosRestauracionTable>
export type PuntoRestauracionInsertable = Insertable<PuntosRestauracionTable>
export type PuntoRestauracionUpdateable = Updateable<PuntosRestauracionTable>