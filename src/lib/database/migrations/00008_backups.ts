
import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>):  Promise<void> {
  await db.schema
    .createTable('puntos_restauracion')
    .addColumn('nombre', 'text', (col) => col.notNull())
    .addColumn('fecha', 'date', (col) => col.notNull())
    .addColumn('backup_id', 'text', (col) => col.notNull().primaryKey())
    .addColumn('path', 'text', (col) => col.notNull())
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('bloques_horarios').execute()
  await db.schema.dropTable('horarios_grados_alt').execute()
}