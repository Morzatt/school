import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>):  Promise<void> {
  await db.schema
    .createTable('alumnos')
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

  await db.schema
    .createTable("representantes")
    .addColumn('cedula', 'text', (col) => col.notNull().primaryKey())
    .addColumn('nombre', 'text', (col) => col.notNull())
    .addColumn('apellido', 'text', (col) => col.notNull())
    .addColumn('sexo', 'text', (col) => col.notNull().check(sql`sexo in ('Masculino', 'Femenino')`))
    .addColumn('direccion', 'text', (col) => col.notNull())
    .addColumn('correo_electronico', 'text', (col) => col.notNull())
    .execute()

  await db.schema
    .createTable('telefonos_representantes')
    .addColumn('representante', 'text')
    .addColumn('numero_telefono', 'text')
    .addForeignKeyConstraint("fk_alumno", ["representante"], "representantes", ["cedula"], (col) => col.onDelete("cascade").onUpdate("cascade"))
    .execute()

  await db.schema
    .createTable("representantes_alumnos")
    .addColumn('id_representante','text', (col) => col.notNull())
    .addColumn('id_alumno','text', (col) => col.notNull())
    // Padre, Madre, Tio, Abuela etc...
    .addColumn('relacion', 'text')
    .addForeignKeyConstraint("fk_representante", ["id_representante"], "representantes", ["cedula"], (col) => col.onDelete("cascade").onUpdate("cascade"))
    .addForeignKeyConstraint("fk_alumno", ["id_alumno"], "alumnos", ["cedula_escolar"], (col) => col.onDelete("cascade").onUpdate("cascade"))
    .execute()

  await db.schema 
    .createTable("grados_cursados")
    .addColumn('', 'text')
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('alumnos').execute()
  await db.schema.dropTable('representantes').execute()
  await db.schema.dropTable('representantes_alumnos').execute()
  await db.schema.dropTable('grados_cursados').execute()
}