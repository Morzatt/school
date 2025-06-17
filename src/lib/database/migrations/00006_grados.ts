import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>):  Promise<void> {
  await db.schema
    .createTable('grados')
    // 3GBM => 3er Grado "B", Turno de la Mañana
    // 6GAT => 6to Grado "A", Turno de la Tarde
    // 2NBM => 2do Nivel "A", Turno de la Mañana 
    .addColumn('id_grado', 'text', (col) => col.primaryKey()) 
    // 3
    .addColumn('numero', 'varchar(1)', (col) => col.notNull().check(sql`numero IN ('1', '2', '3', '4', '5', '6')`)) 
    // Inicial | Primaria | Bachillerato
    .addColumn('nivel', 'text', (col) => col.notNull().check(sql`nivel IN ('Primaria', 'Inicial', 'Bachillerato')`)) 
    // A | B | C | D
    .addColumn('seccion', 'text', (col) => col.notNull().check(sql`seccion IN ('A', 'B', 'C', 'D')`)) 
    // 'Mañana' | 'Tarde'
    // CHECK - El un profesor con turno de 'Tarde' no puede dar clases en una sección de turno 'Mañana'
    .addColumn('turno', 'text', (col) => col.notNull().check(sql`turno IN ('Mañana', 'Tarde')`)) 
    // 8933618 -> Cedula del profesor
    // CHECK - Al introducir una cedula, el cargo del empleado debe de ser 'Docente'
    .addColumn('profesor', 'text') 
    .addForeignKeyConstraint("fk_profesor", ["profesor"], "empleados", ["cedula"], (col) => col.onDelete("set null").onUpdate("cascade"))
    .execute()

    // https://es.pinterest.com/pin/164803667607207691/
    await db.schema
    .createTable('grados_alumnos')
    // 3GBM 
    .addColumn('id_grado', 'text', (col) => col.notNull())
    // 11930451822
    .addColumn('id_alumno', 'text', (col) => col.notNull())

    .addPrimaryKeyConstraint('primary_grado_alumno', ['id_alumno', 'id_grado'])
    .addForeignKeyConstraint("fk_grado", ["id_grado"], "grados", ["id_grado"], (col) => col.onDelete("cascade").onUpdate("cascade"))
    .addForeignKeyConstraint("fk_alumno", ["id_alumno"], "alumnos", ["cedula_escolar"], (col) => col.onDelete("cascade").onUpdate("cascade"))
    .execute()

    await db.schema
    .createTable('materias')
    .addColumn('id_materia', 'uuid', (col) => col.notNull().primaryKey().defaultTo(sql`gen_random_uuid()`))
    // Matemáticas
    .addColumn('nombre_materia', 'text', (col) => col.notNull())
    .addColumn('color', 'text', (col) => col.notNull())
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('grados').execute()
  await db.schema.dropTable('grados_alumnos').execute()
}