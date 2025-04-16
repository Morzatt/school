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
import { invalidateAll } from '$app/navigation';

export const load = (async ({ locals, url }) => {
  let { log } = locals;
  let puntos = await async(db.selectFrom('puntos_restauracion').selectAll().orderBy('fecha desc').execute(), log)
  await checkPuntos(puntos, log)

  return { puntos };
}) satisfies PageServerLoad;

async function checkPuntos(puntos: PuntoRestauracion[] | undefined, log: pino.Logger<never, boolean>) {
  if (puntos) {
    for (let i of puntos) {
      try {
        let backupPath = path.join(process.cwd(), `/static/backups/checkpoints/backup_${i.backup_id}.dump`)
        await access(backupPath, constants.F_OK)
      } catch (error) {
        handleError(log, error, { msg: `El archivo ${i.nombre} no existe, borrado en proceso`, ...i })
        await async(db.deleteFrom('puntos_restauracion').where('backup_id', '=', i.backup_id).execute(), log)
        invalidateAll()
      }
    }
  }
}

function createBackupId(date: Date) {
  return date.toISOString().replaceAll(' ', '').replaceAll(':', '').replaceAll('-', '').replaceAll('.', '')
}

export const actions = {
  createBackup: async ({ locals, request }) => {
    let { response } = locals;
    let backupId = createBackupId(new Date())
    let backupPath = path.join(process.cwd(), `/static/backups/temporal/backup_${backupId}.dump`)
    createBackup(backupPath)
    setTimeout(() => {
      unlinkSync(backupPath)
    }, 5000)
    return response.success('Copia de Seguridad creada correctamente.', { timestamp: backupId })
  },

  uploadBackup: async ({ locals, request }) => {
    let { response } = locals;

    let data = await request.formData()
    let backupUpload = data.get('backupUpload') as File

    if (!backupUpload || backupUpload.size <= 0) return fail(400, response.error("No ha seleccionado ningún archivo de respaldo."));
    if (!backupUpload.name.endsWith(".dump")) return fail(400, response.error("El archivo seleccionado no es una archivo de respaldo (.dump)"));

    let backupPath = path.join(process.cwd(), `/static/backups/temporal/${backupUpload.name}`)

    writeFileSync(backupPath, Buffer.from(await backupUpload.arrayBuffer()));
    restoreFromDump(backupPath)

    setTimeout(() => {
      unlinkSync(backupPath)
    }, 5000)

    return response.success('Copia de Seguridad creada correctamente.', { backupID: backupUpload.name })
  },

  createCheckpoint: async ({ locals, request }) => {
    let { log, response } = locals;
    let nombre_checkpoint = (await request.formData()).get('backup_name') as string

    let today = new Date()
    let backupId = createBackupId(today)
    let relativePath = `/static/backups/checkpoints/backup_${backupId}.dump`
    let backupPath = path.join(process.cwd(), relativePath)
    createBackup(backupPath)

    await async(
      db
        .insertInto('puntos_restauracion')
        .values({
          nombre: nombre_checkpoint,
          path: relativePath,
          fecha: today.toLocaleDateString('en'),
          backup_id: backupId
        })
        .execute()
      , log)

    return response.success('Punto de Restauración creada correctamente.', { timestamp: backupId })
  },

  selectPunto: async ({ locals, request }) => {
    let { log, response } = locals;
    let backup_id = (await request.formData()).get('backup_id')
    let backupPath = path.join(process.cwd(), `/static/backups/checkpoints/backup_${backup_id}.dump`)

    restoreFromDump(backupPath)

    return response.success('Punto de restauracion correctamente restaurado.', { backupID: backup_id })
  },

  deletePunto: async ({ locals, request }) => {
    let { log, response } = locals;
    let backup_id = (await request.formData()).get('backup_id') as string
    if (!backup_id || backup_id === "") {
      return
    }

    let relativePath = `/static/backups/checkpoints/backup_${backup_id}.dump`
    let backupPath = path.join(process.cwd(), relativePath)
    unlinkSync(backupPath)

    await async(
      db.deleteFrom('puntos_restauracion').where('backup_id', '=', backup_id).execute()
      , log)

    return response.success('Punto de Restauración correctamente eliminado.')
  },
} satisfies Actions

async function createBackup(backupPath: string) {
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