import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import fs, { unlinkSync, writeFileSync } from 'fs'
import { access, constants } from 'fs/promises';
import { spawnSync } from "child_process"
import path from 'path';
import async, { handleError } from '$lib/utils/asyncHandler';
import { db } from '$lib/database';
import { fail } from '@sveltejs/kit';
import type { PuntoRestauracion } from '$lib/database/types';
import type pino from 'pino';

import * as tar from "tar"
import { cp, mkdir, rm, readdir, unlink } from 'fs/promises';


export const load = (async ({ locals }) => {
  let { log } = locals;
  let puntos = await async(db.selectFrom('puntos_restauracion').selectAll().orderBy('fecha desc').execute(), log)
  await checkPuntos(puntos, log)

  return { puntos };
}) satisfies PageServerLoad;

async function checkPuntos(puntos: PuntoRestauracion[] | undefined, log: pino.Logger<never, boolean>) {
  if (puntos) {
    for (let i of puntos) {
      try {
        let backupPath = path.join(process.cwd(), `/static/backups/checkpoints/backup_${i.backup_id}.tar`)
        await access(backupPath, constants.F_OK)
      } catch (error) {
        handleError(log, error, { msg: `El archivo ${i.nombre} no existe, borrado en proceso`, ...i })
        await async(db.deleteFrom('puntos_restauracion').where('backup_id', '=', i.backup_id).execute(), log)
      }
    }
  }
}

function createBackupId(date: Date) {
  return date.toISOString().replaceAll(' ', '').replaceAll(':', '').replaceAll('-', '').replaceAll('.', '')
}

export const actions = {
  generate: async ({ locals }) => {
    let { response, log } = locals
    let timestamp = formatDate(new Date())

    let backupFolderPath = path.join(process.cwd(), `/static/backups/temporal/backup_${timestamp}`)
    let alumnosFolderPath = path.join(process.cwd(), `/static/alumnos`)
    let empleadosFolderPath = path.join(process.cwd(), `/static/empleados`)
    let representantesFolderPath = path.join(process.cwd(), `/static/representantes`)
    let backupPath = path.join(backupFolderPath, `/backup_${timestamp}.dump`)

    let tarPath = path.join(process.cwd(), `/static/backups/temporal/backup_${timestamp}.tar`)

    try {
      // CREAR CARPETA TEMPORAL DE RESPALDO
      await async(mkdir(backupFolderPath), log)

      // CREAR RESPALDO SQL
      createBackup(backupPath)

      // CARPETA DE DOCUMENTOS DENTRO DE LA CARPETA DE RESPALDO
      await async(mkdir(path.join(backupFolderPath, '/alumnos')), log)
      await async(mkdir(path.join(backupFolderPath, '/empleados')), log)
      await async(mkdir(path.join(backupFolderPath, '/representantes')), log)

      // COPIAR CARPETA DE RESPALDOS
      await cp(alumnosFolderPath, path.join(backupFolderPath, '/alumnos'), { recursive: true });
      await cp(empleadosFolderPath, path.join(backupFolderPath, '/empleados'), { recursive: true });
      await cp(representantesFolderPath, path.join(backupFolderPath, '/representantes'), { recursive: true });

      // COMPRIMIR CARPETA DE RESPALDO
      tar.c({
        // gzip: false,
        file: tarPath,
        sync: true,
        portable: true,
        cwd: path.join(process.cwd(), '/static/backups/temporal')
      }, [`backup_${timestamp}`])

      setTimeout(() => {
        unlinkSync(tarPath)
        rm(backupFolderPath, { recursive: true, force: true })
      }, 15000)

      return response.success('Copia de Seguridad creada correctamente.', { timestamp: timestamp })
    } catch (error) {
      handleError(log, error, {})
    }
  },

  uploadBackup: async ({ locals, request }) => {
    let { response, log } = locals
    let data = await request.formData()

    let backupUpload = data.get('backupUpload') as File
    if (!backupUpload.name.endsWith(".tar")) {
      return fail(400, response.error("El archivo seleccionado no es una archivo de respaldo compatible"));
    }

    let cwd = process.cwd()
    let temporalTarPath = path.join(cwd, `/static/backups/temporal/${backupUpload.name}`)
    let backupID = backupUpload.name.slice(backupUpload.name.lastIndexOf('_') + 1, backupUpload.name.lastIndexOf('.'))

    try {
      writeFileSync(temporalTarPath, Buffer.from(await backupUpload.arrayBuffer()));

      tar.x({
        sync: true,
        file: temporalTarPath,
        cwd: path.join(process.cwd(), '/static/backups/temporal')
      })

      await async(unlink(temporalTarPath), log)

      let backupFolderPath = path.join(cwd, `/static/backups/temporal/backup_${backupID}`)
      let backupFilePath = path.join(backupFolderPath, `/backup_${backupID}.dump`)

      // RUTAS DE CARPETAS DE IMAGENES EN LA CARPETA DE RESPALDO
      let alumnosBackupFolderPath = path.join(backupFolderPath, `/alumnos`)
      let empleadosBackupFolderPath = path.join(backupFolderPath, `/empleados`)
      let representantesBackupFolderPath = path.join(backupFolderPath, `/representantes`)


      // RUTAS DE CARPETAS DE IMAGENES DEL PROYECTO 
      let alumnosPath = path.join(cwd, '/static/alumnos')
      let empleadosPath = path.join(cwd, '/static/empleados')
      let representantesPath = path.join(cwd, '/static/representantes')

      restoreFromDump(backupFilePath)

      // BORRAR TODO DE ALUMNOS
      await async(access(alumnosPath), log)
      const alumnosItems = await async(readdir(alumnosPath), log);

      if (alumnosItems && alumnosItems.length > 0) {
        for (const item of alumnosItems) {
          const itemPath = path.join(alumnosPath, item);
          await async(rm(itemPath, { recursive: true, force: true }), log);
        }
      }

      // BORRAR TODO DE EMPLEADOS 
      await async(access(empleadosPath), log)
      const empleadosItems = await async(readdir(empleadosPath), log);

      if (empleadosItems && empleadosItems.length > 0) {
        for (const item of empleadosItems) {
          const itemPath = path.join(empleadosPath, item);
          await async(rm(itemPath, { recursive: true, force: true }), log);
        }
      }

      // BORRAR TODO DE REPRESENTANTES 
      await async(access(representantesPath), log)
      const representantesItems = await async(readdir(representantesPath), log);

      if (representantesItems && representantesItems.length > 0) {
        for (const item of representantesItems) {
          const itemPath = path.join(representantesPath, item);
          await async(rm(itemPath, { recursive: true, force: true }), log);
        }
      }

      // COPIAR IMAGENES
      await async(cp(alumnosBackupFolderPath, alumnosPath, { recursive: true }), log)
      await async(cp(empleadosBackupFolderPath, empleadosPath, { recursive: true }), log)
      await async(cp(representantesBackupFolderPath, representantesPath, { recursive: true }), log)

      await async(rm(backupFolderPath, { recursive: true, force: true }), log)
      return response.success('Respaldo restaurado correctamente..')
    } catch (error) {
      handleError(log, error, {})
    }
  },

  createCheckpoint: async ({ locals, request }) => {
    let { log, response } = locals;
    let nombre_checkpoint = (await request.formData()).get('backup_name') as string

    let today = new Date()
    let timestamp = createBackupId(today)

    let backupFolderPath = path.join(process.cwd(), `/static/backups/temporal/backup_${timestamp}`)
    let alumnosFolderPath = path.join(process.cwd(), `/static/alumnos`)
    let empleadosFolderPath = path.join(process.cwd(), `/static/empleados`)
    let representantesFolderPath = path.join(process.cwd(), `/static/representantes`)
    let backupPath = path.join(backupFolderPath, `/backup_${timestamp}.dump`)

    let tarPath = path.join(process.cwd(), `/static/backups/checkpoints/backup_${timestamp}.tar`)

    try {
      // CREAR CARPETA TEMPORAL DE RESPALDO
      await async(mkdir(backupFolderPath), log)

      // CREAR RESPALDO SQL
      createBackup(backupPath)

      // CARPETA DE DOCUMENTOS DENTRO DE LA CARPETA DE RESPALDO
      await async(mkdir(path.join(backupFolderPath, '/alumnos')), log)
      await async(mkdir(path.join(backupFolderPath, '/empleados')), log)
      await async(mkdir(path.join(backupFolderPath, '/representantes')), log)

      // COPIAR CARPETA DE RESPALDOS
      await cp(alumnosFolderPath, path.join(backupFolderPath, '/alumnos'), { recursive: true });
      await cp(empleadosFolderPath, path.join(backupFolderPath, '/empleados'), { recursive: true });
      await cp(representantesFolderPath, path.join(backupFolderPath, '/representantes'), { recursive: true });

      // COMPRIMIR CARPETA DE RESPALDO
      tar.c({
        // gzip: false,
        file: tarPath,
        sync: true,
        portable: true,
        cwd: path.join(process.cwd(), '/static/backups/temporal')
      }, [`backup_${timestamp}`])

      setTimeout(async () => {
        await async(rm(backupFolderPath, { recursive: true, force: true }), log)
      }, 15000)

      await async(
        db
          .insertInto('puntos_restauracion')
          .values({
            nombre: nombre_checkpoint,
            path: `/static/backups/checkpoints/backup_${timestamp}.tar`,
            fecha: today.toLocaleDateString('en'),
            backup_id: timestamp 
          })
          .execute()
      , log)

      return response.success('Copia de Seguridad creada correctamente.', { timestamp: timestamp })
    } catch (error) {
      handleError(log, error, {})
    }

    return response.success('Punto de Restauración creada correctamente.', { timestamp: timestamp })
  },

  selectPunto: async ({ locals, request }) => {
    let { log, response } = locals;
    let backup_id = (await request.formData()).get('backup_id')
    console.log(backup_id)

    let cwd = process.cwd()
    let temporalTarPath = path.join(cwd, `/static/backups/checkpoints/backup_${backup_id}.tar`)

    try {
      tar.x({
        sync: true,
        file: temporalTarPath,
        cwd: path.join(cwd, '/static/backups/checkpoints')
      })

      let backupFolderPath = path.join(cwd, `/static/backups/checkpoints/backup_${backup_id}`)
      let backupFilePath = path.join(backupFolderPath, `/backup_${backup_id}.dump`)

      // RUTAS DE CARPETAS DE IMAGENES EN LA CARPETA DE RESPALDO
      let alumnosBackupFolderPath = path.join(backupFolderPath, `/alumnos`)
      let empleadosBackupFolderPath = path.join(backupFolderPath, `/empleados`)
      let representantesBackupFolderPath = path.join(backupFolderPath, `/representantes`)


      // RUTAS DE CARPETAS DE IMAGENES DEL PROYECTO 
      let alumnosPath = path.join(cwd, '/static/alumnos')
      let empleadosPath = path.join(cwd, '/static/empleados')
      let representantesPath = path.join(cwd, '/static/representantes')

      restoreFromDump(backupFilePath)

      // BORRAR TODO DE ALUMNOS
      await async(access(alumnosPath), log)
      const alumnosItems = await async(readdir(alumnosPath), log);

      if (alumnosItems && alumnosItems.length > 0) {
        for (const item of alumnosItems) {
          const itemPath = path.join(alumnosPath, item);
          await async(rm(itemPath, { recursive: true, force: true }), log);
        }
      }

      // BORRAR TODO DE EMPLEADOS 
      await async(access(empleadosPath), log)
      const empleadosItems = await async(readdir(empleadosPath), log);

      if (empleadosItems && empleadosItems.length > 0) {
        for (const item of empleadosItems) {
          const itemPath = path.join(empleadosPath, item);
          await async(rm(itemPath, { recursive: true, force: true }), log);
        }
      }

      // BORRAR TODO DE REPRESENTANTES 
      await async(access(representantesPath), log)
      const representantesItems = await async(readdir(representantesPath), log);

      if (representantesItems && representantesItems.length > 0) {
        for (const item of representantesItems) {
          const itemPath = path.join(representantesPath, item);
          await async(rm(itemPath, { recursive: true, force: true }), log);
        }
      }

      // COPIAR IMAGENES
      await async(cp(alumnosBackupFolderPath, alumnosPath, { recursive: true }), log)
      await async(cp(empleadosBackupFolderPath, empleadosPath, { recursive: true }), log)
      await async(cp(representantesBackupFolderPath, representantesPath, { recursive: true }), log)

      setTimeout(async () => {
        await async(rm(backupFolderPath, { recursive: true, force: true }), log)
      }, 15000)

      return response.success('Punto de restauracion correctamente restaurado.', { backupID: backup_id })
    } catch (error) {
      handleError(log, error, {})
    }

    return response.success('Punto de restauracion correctamente restaurado.', { backupID: backup_id })
  },

  deletePunto: async ({ locals, request }) => {
    let { log, response } = locals;
    let backup_id = (await request.formData()).get('backup_id') as string
    if (!backup_id || backup_id === "") {
      return
    }

    let relativePath = `/static/backups/checkpoints/backup_${backup_id}.tar`
    let backupPath = path.join(process.cwd(), relativePath)
    unlinkSync(backupPath)

    await async(
      db.deleteFrom('puntos_restauracion').where('backup_id', '=', backup_id).execute()
    , log)

    return response.success('Punto de Restauración correctamente eliminado.')
  },
} satisfies Actions

function createBackup(backupPath: string) {
  // Configure psql arguments
  const args = [
    '-h', import.meta.env.VITE_PGHOST,
    '-p', import.meta.env.VITE_PGPORT || 5432,
    '-U', import.meta.env.VITE_PGUSER,
    '-d', import.meta.env.VITE_PGDATABASE,
    '-Fc',
    '-T', `puntos_restauracion`
    // Add options like `--quiet` to suppress output
  ];

  // Set environment variables (including password)
  const env = {
    ...process.env,
    PGPASSWORD: import.meta.env.VITE_PGPASSWORD, // Pass password non-interactively
  };

  // Spawn pg_dump process
  const pgDumpProcess = spawnSync('pg_dump', args, {
    env,
    encoding: 'buffer',
    stdio: ['ignore', 'pipe', 'pipe']
  });

  // Handle errors
  if (pgDumpProcess.error) {
    throw new Error(`Process error: ${pgDumpProcess.error.message}`);
  }

  if (pgDumpProcess.status !== 0) {
    const errorOutput = pgDumpProcess.stderr.toString();
    throw new Error(`pg_dump failed: ${errorOutput}`);
  }

  // Write backup file
  fs.writeFileSync(backupPath, pgDumpProcess.stdout);
}

function restoreFromDump(dumpPath: string) {
  // Configure psql arguments
  const args = [
    '-h', import.meta.env.VITE_PGHOST,
    '-p', import.meta.env.VITE_PGPORT || 5432,
    '-U', import.meta.env.VITE_PGUSER,
    '-d', import.meta.env.VITE_PGDATABASE,
    '--clean', // Drop objects before recreating (optional)
    dumpPath,  // Path to the dump file
  ];

  // Set environment variables (including password)
  const env = {
    ...process.env,
    PGPASSWORD: import.meta.env.VITE_PGPASSWORD, // Pass password non-interactively
  };

  // Spawn pg_restore process
  const pgRestoreProcess = spawnSync('pg_restore', args, {
    env,
    encoding: 'buffer',
    stdio: ['ignore', 'pipe', 'pipe']
  });

  // Handle errors
  if (pgRestoreProcess.error) {
    throw new Error(`Process error: ${pgRestoreProcess.error.message}`);
  }

  if (pgRestoreProcess.status !== 0) {
    const errorOutput = pgRestoreProcess.stderr.toString();
    throw new Error(`pg_restore failed: ${errorOutput}`);
  }
}

function formatDate(date: Date): string {
  return date.toISOString().replaceAll('-', '').replaceAll(':', '').replaceAll(' ', '').replaceAll('.', '');
}
