import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>):  Promise<void> {
  await db.schema
    .createTable('grados')
    // 3BM => 3ro "B", Turno de la Mañana
    // 6AT => 5to "A", Turno de la Tarde
    .addColumn('id_grado', 'text', (col) => col.primaryKey()) 
    // 'Mañana' | 'Tarde'
    // CHECK - El un profesor con turno de 'Tarde' no puede dar clases en una sección de turno 'Mañana'
    .addColumn('turno', 'text') 
    // A | B | C | D
    .addColumn('seccion', 'text') 
    // 8933618 -> Cedula del profesor
    .addColumn('profesor', 'text') 
    .addForeignKeyConstraint("fk_profesor", ["profesor"], "profesores", ["cedula"], (col) => col.onDelete("cascade").onUpdate("cascade"))
    .execute()

    await db.schema
    .createTable('grados_alumnos')
    // 3BM 
    .addColumn('id_grado', 'text')
    // 11930451822
    .addColumn('id_alumno', 'text')
    .addForeignKeyConstraint("fk_grado", ["id_grado"], "grados", ["id_grado"], (col) => col.onDelete("cascade").onUpdate("cascade"))
    .addForeignKeyConstraint("fk_alumno", ["id_alumno"], "alumnos", ["cedula_escolar"], (col) => col.onDelete("cascade").onUpdate("cascade"))
    .execute()

    await db.schema
    .createTable('materias')
    // MATE-LENG-GEOG-HISV-HISU-BIOL
    .addColumn('id_materia', 'text', (col) => col.primaryKey())
    // Matemáticas
    .addColumn('nombre_materia', 'text')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('grados').execute()
  await db.schema.dropTable('grados_alumnos').execute()
}