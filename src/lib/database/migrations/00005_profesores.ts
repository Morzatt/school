import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>):  Promise<void> {
  await db.schema
    .createTable('profesores')
    .addColumn('cedula', 'text', (col) => col.notNull().primaryKey())
    .addColumn('primer_nombre', 'text', (col) => col.notNull())
    .addColumn('segundo_nombre', 'text', (col) => col.notNull())
    .addColumn('primer_apellido', 'text', (col) => col.notNull())
    .addColumn('segundo_apellido', 'text', (col) => col.notNull())
    .addColumn('sexo', 'text', (col) => col.notNull().check(sql`sexo in ('Masculino', 'Femenino')`))
    .addColumn('fecha_nacimiento', 'date', (col) => col.notNull())
    .addColumn('edad', 'text', (col) => col.notNull())
    .addColumn('direccion', 'text', (col) => col.notNull())

    // Bachiller, TSU, Ingeniero, Licenciado, etc...
    .addColumn('grado_instruccion', 'text')
    // Matemáticas, Castellano, Geografía, etc..
    .addColumn('especializacion', 'text')
    // 14/02/2022
    .addColumn('fecha_ingreso', 'text')
    // 3 años
    .addColumn('tiempo_servicio', 'text')
    // 'Mañana' | 'Tarde'
    // CHECK - El un profesor con turno de 'Tarde' no puede dar clases en una sección de turno 'Mañana'
    .addColumn('turno', 'text')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('profesores').execute()
}