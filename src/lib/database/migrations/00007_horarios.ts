import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>):  Promise<void> {
  await db.schema
    .createTable('bloques_horarios')
    // Lu-900A-1100A => Lunes, de 9 a 11, Mañana
    // Vi-200P-33000A => Viernes, de 2 a 3:30, Tarde 
    .addColumn('id_bloque', 'text', (col) => col.primaryKey())
    // 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'
    .addColumn('dia_semana', 'text', (col) => col.notNull().check(sql`dia_semana IN ('Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes')`))
    // 09:00am
    .addColumn('hora_inicio', 'text') 
    // 11:30am
    .addColumn('hora_fin', 'text') 
    .execute()

  await db.schema
    .createTable('horarios_grados')
    // 3BM
    .addColumn('id_grado', 'text') 
    // Lu-900A-1100A
    .addColumn('id_bloque', 'text') 
    // 30451822
    .addColumn('cedula_profesor', 'text') 
    // MATE
    .addColumn('materia_id', 'text') 

    .addForeignKeyConstraint("fk_grado", ["id_grado"], "grados", ["id_grado"], (col) => col.onDelete("cascade").onUpdate("cascade"))
    .addForeignKeyConstraint("fk_bloque", ["id_bloque"], "bloques_horarios", ["id_bloque"], (col) => col.onDelete("cascade").onUpdate("cascade"))
    .addForeignKeyConstraint("fk_profesor", ["cedula_profesor"], "profesores", ["cedula"], (col) => col.onDelete("cascade").onUpdate("cascade"))
    .addForeignKeyConstraint("fk_materia", ["materia_id"], "materias", ["id_materia"], (col) => col.onDelete("cascade").onUpdate("cascade"))
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('horarios').execute()
  await db.schema.dropTable('bloques_horarios').execute()
  await db.schema.dropTable('horarios_grados').execute()
}