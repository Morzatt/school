import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>):  Promise<void> {
  await db.schema
    .createTable('profesores')
    .addColumn('cedula_escolar', 'text', (col) => col.notNull().primaryKey())
    .addColumn('primer_nombre', 'text', (col) => col.notNull())
    .addColumn('segundo_nombre', 'text', (col) => col.notNull())
    .addColumn('primer_apellido', 'text', (col) => col.notNull())
    .addColumn('segundo_apellido', 'text', (col) => col.notNull())
    .addColumn('sexo', 'text', (col) => col.notNull().check(sql`sexo in ('Masculino', 'Femenino')`))
    .addColumn('fecha_nacimiento', 'date', (col) => col.notNull())
    .addColumn('direccion', 'text', (col) => col.notNull())
    .addColumn('edad', 'text', (col) => col.notNull())
    .addColumn('created_at', "timestamp", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())
    .execute()

}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('alumnos').execute()
  await db.schema.dropTable('representantes').execute()
  await db.schema.dropTable('representantes_alumnos').execute()
  await db.schema.dropTable('grados_cursados').execute()
}