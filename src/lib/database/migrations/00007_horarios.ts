import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>):  Promise<void> {
  await db.schema
    .createTable('bloques_horarios')
    // Lu-900A-1100A => Lunes, de 9 a 11, Mañana
    // Vi-200P-33000A => Viernes, de 2 a 3:30, Tarde 
    .addColumn('id_bloque', 'text', (col) => col.notNull().primaryKey())
    // 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'
    .addColumn('dia_semana', 'text', (col) => col.notNull().check(sql`dia_semana IN ('Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes')`))
    // 09:00am
    .addColumn('hora_inicio', 'time', (col) => col.notNull()) 
    // 11:30am
    .addColumn('hora_fin', 'time', (col) => col.notNull()) 
    .execute()

  await db.schema
    .createTable('horarios_grados')
    // 3BM
    .addColumn('id_grado', 'text', (col) => col.notNull()) 
    // Lu-900A-1100A
    .addColumn('id_bloque', 'text', (col) => col.notNull()) 
    // 30451822
    .addColumn('cedula_profesor', 'text', (col) => col.notNull().defaultTo('Sin Profesor')) 
    // MATE
    .addColumn('id_materia', 'uuid', (col) => col.notNull()) 

    .addForeignKeyConstraint("fk_grado", ["id_grado"], "grados", ["id_grado"], (col) => col.onDelete("cascade").onUpdate("cascade"))
    .addForeignKeyConstraint("fk_bloque", ["id_bloque"], "bloques_horarios", ["id_bloque"], (col) => col.onDelete("cascade").onUpdate("cascade"))
    .addForeignKeyConstraint("fk_profesor", ["cedula_profesor"], "empleados", ["cedula"], (col) => col.onDelete("set default").onUpdate("cascade"))
    .addForeignKeyConstraint("fk_materia", ["id_materia"], "materias", ["id_materia"], (col) => col.onDelete("cascade").onUpdate("cascade"))
    .addPrimaryKeyConstraint('pkey_horarios_grados', ['cedula_profesor', 'id_bloque', 'id_grado', 'id_materia'])
    .execute()


  await db.schema
    .createTable('horarios_grados_alt')
    // 3BM:Lu-900A-1100A
    .addColumn('id_horario', 'text', (col) => col.notNull().primaryKey()) 
    // 3BM
    .addColumn('id_grado', 'text', (col) => col.notNull()) 
    // 30451822
    .addColumn('cedula_profesor', 'text', (col) => col.notNull().defaultTo('Sin Profesor')) 
    // MATE
    .addColumn('id_materia', 'uuid', (col) => col.notNull()) 
    // 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'
    .addColumn('dia_semana', 'text', (col) => col.notNull().check(sql`dia_semana IN ('Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes')`))
    // 09:00am
    .addColumn('hora_inicio', 'time', (col) => col.notNull()) 
    // 11:30am
    .addColumn('hora_fin', 'time', (col) => col.notNull()) 

    .addForeignKeyConstraint("fk_profesor", ["cedula_profesor"], "empleados", ["cedula"], (col) => col.onDelete("set default").onUpdate("cascade"))
    .addForeignKeyConstraint("fk_materia", ["id_materia"], "materias", ["id_materia"], (col) => col.onDelete("cascade").onUpdate("cascade"))
    .addForeignKeyConstraint("fk_materia", ["id_grado"], "grados", ["id_grado"], (col) => col.onDelete("cascade").onUpdate("cascade"))
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('bloques_horarios').execute()
  await db.schema.dropTable('horarios_grados').execute()
  await db.schema.dropTable('horarios_grados_alt').execute()
}