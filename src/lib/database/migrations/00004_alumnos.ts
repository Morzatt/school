import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>):  Promise<void> {
  await db.schema
    .createTable('alumnos')
    .addColumn('cedula_escolar', 'text', (col) => col.notNull().primaryKey())
    .addColumn('nacionalidad', 'text', (col) => col.notNull())

    .addColumn('primer_nombre', 'text', (col) => col.notNull())
    .addColumn('segundo_nombre', 'text', (col) => col.notNull())
    .addColumn('primer_apellido', 'text', (col) => col.notNull())
    .addColumn('segundo_apellido', 'text', (col) => col.notNull())

    .addColumn('sexo', 'text', (col) => col.notNull().check(sql`sexo in ('Masculino', 'Femenino')`))
    .addColumn('fecha_nacimiento', 'date', (col) => col.notNull())
    .addColumn('direccion', 'text', (col) => col.notNull())
    .addColumn('edad', 'integer', (col) => col.notNull())

    .addColumn('estado', 'text', (col) => col.notNull().check(sql`estado IN  ('Activo', 'Retirado', 'Expulsado')`))
    .addColumn('created_at', "timestamp", (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull())

    .addColumn('madre', 'text', (col) => col.notNull())
    .addColumn('padre', 'text')

    .addColumn('lateralidad', 'text', (col) => col.notNull().check(sql`lateralidad IN ('Diestro', 'Zurdo')`))
    .addColumn('peso', 'text', (col) => col.notNull())
    .addColumn('estatura', 'text', (col) => col.notNull())

    .addColumn('calzado', 'text', (col) => col.notNull())
    .addColumn('camisa', 'text', (col) => col.notNull())
    .addColumn('pantalon', 'text', (col) => col.notNull())

    .addForeignKeyConstraint("fk_madre", ["madre"], "representantes", ["cedula"], (col) => col.onDelete("cascade").onUpdate("cascade"))
    .addForeignKeyConstraint("fk_padre", ["padre"], "representantes", ["cedula"], (col) => col.onDelete("cascade").onUpdate("cascade"))
    .execute()

  await db.schema
    .createTable("familiares_autorizados")
    .addColumn('cedula', 'text', (col) => col.notNull().primaryKey())
    .addColumn('nombre', 'text', (col) => col.notNull())
    .addColumn('apellido', 'text', (col) => col.notNull())
    .addColumn('sexo', 'text', (col) => col.notNull().check(sql`sexo in ('Masculino', 'Femenino')`))
    .execute()

  await db.schema
    .createTable("familiares_alumnos")
    .addColumn('id_familiar','text', (col) => col.notNull())
    .addColumn('id_alumno','text', (col) => col.notNull())
    .addForeignKeyConstraint("fk_alumno", ["id_alumno"], "alumnos", ["cedula_escolar"], (col) => col.onDelete("cascade").onUpdate("cascade"))
    .addForeignKeyConstraint("fk_familiar", ["id_familiar"], "familiares_autorizados", ["cedula"], (col) => col.onDelete("cascade").onUpdate("cascade"))
    .execute()

  await db.schema
    .createTable("representantes")
    .addColumn('cedula', 'text', (col) => col.notNull().primaryKey())
    .addColumn('estado_civil', 'text', (col) => col.notNull())
    .addColumn('nacionalidad', 'text', (col) => col.notNull())
    .addColumn('nombre', 'text', (col) => col.notNull())
    .addColumn('apellido', 'text', (col) => col.notNull())
    .addColumn('sexo', 'text', (col) => col.notNull().check(sql`sexo in ('Masculino', 'Femenino')`))
    .addColumn('fecha_nacimiento', 'text', (col) => col.notNull())
    .addColumn('edad', 'text', (col) => col.notNull())

    .addColumn('direccion_habitacion', 'text', (col) => col.notNull())
    .addColumn('correo_electronico', 'text', (col) => col.notNull())
    .addColumn('ocupacion', 'text', (col) => col.notNull())
    .addColumn('grado_instruccion', 'text', (col) => col.notNull())
    .execute()

  await db.schema
    .createTable('telefonos_representantes')
    .addColumn('representante', 'text')
    .addColumn('numero_telefono', 'text')
    .addPrimaryKeyConstraint('primary_grado_alumno', ['representante', "numero_telefono"])
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
    .addColumn('id_alumno', 'text')
    .addColumn('grado', 'text')
    .addColumn('fecha', 'text')
    // CULMINADO, EN PROCESO, 
    .addColumn('estado', 'text')
    .addForeignKeyConstraint("fk_alumno", ["id_alumno"], "alumnos", ["cedula_escolar"], (col) => col.onDelete("cascade").onUpdate("cascade"))
    .addPrimaryKeyConstraint('grados_cursados_pk', ['id_alumno', 'grado', 'fecha'])
    .execute()

  await db.schema 
    .createTable("documentos_alumnos")
    .addColumn('alumno', 'text')
    .addColumn('tipo_documento', 'text')
    .addColumn('path', 'text')
    .addForeignKeyConstraint("fk_alumno", ["alumno"], "alumnos", ["cedula_escolar"], (col) => col.onDelete("cascade").onUpdate("cascade"))
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('alumnos').execute()
  await db.schema.dropTable('representantes').execute()
  await db.schema.dropTable('telefonos_representantes').execute()
  await db.schema.dropTable('representantes_alumnos').execute()
  await db.schema.dropTable('grados_cursados').execute()
  await db.schema.dropTable('documentos_alumnos').execute()
}