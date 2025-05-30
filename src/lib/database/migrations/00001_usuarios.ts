import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>):  Promise<void> {
  await db.schema
    .createTable('usuarios')
    .addColumn('nombre', 'text', (col) => col.notNull())
    .addColumn('apellido', 'text', (col) => col.notNull())
    .addColumn('usuario', 'text', (col) => col.primaryKey().unique())
    .addColumn('contraseña', 'text', (col) => col.notNull())
    .addColumn('role', 'text', (col) => col.notNull().defaultTo("Usuario"))
    .addColumn('read', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('write', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('estado', 'text', (col) => col.notNull().defaultTo("Por Asignar").check(sql`estado IN ('Activo', 'Bloqueado', 'Por Asignar')`))
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn('theme', 'text', (col) => col.notNull().defaultTo("winter"))
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('usuarios').execute()
}