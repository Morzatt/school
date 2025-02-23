import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>):  Promise<void> {
  await db.schema
    .createTable('alumnos')
    .addColumn('cedula_escolar', 'text', (col) => col.notNull().primaryKey())
    .addColumn('cedula_alumno', 'text', (col) => col.defaultTo(null))

    .addColumn('primer_nombre', 'text', (col) => col.notNull())
    .addColumn('segundo_nombre', 'text', (col) => col.notNull())
    .addColumn('primer_apellido', 'text', (col) => col.notNull())
    .addColumn('segundo_apellido', 'text', (col) => col.notNull())

    .addColumn('sexo', 'text', (col) => col.notNull().check(sql`sexo in ('Masculino', 'Femenino')`))
    .addColumn('fecha_nacimiento', 'date', (col) => col.notNull())
    .addColumn('created_at', "timestamp", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('alumnos').execute()
}