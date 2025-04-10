import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import fs, { unlinkSync } from 'fs'
import { spawn, spawnSync } from "child_process"
import path from 'path';

export const load = (async () => {
    return { puntos: [1, 2] };
}) satisfies PageServerLoad;





export const actions = {
    createBackup: async ({ locals, request }) => {
        let { log, response } = locals;

        // Configure psql arguments
        const args = [
            '-h', import.meta.env.VITE_PGHOST,
            '-p', import.meta.env.VITE_PGPORT || 5432,
            '-U', import.meta.env.VITE_PGUSER,
            '-d', import.meta.env.VITE_PGDATABASE,
            // Add options like `--quiet` to suppress output
        ];

        // Set environment variables (including password)
        const env = {
            ...process.env,
            PGPASSWORD: import.meta.env.VITE_PGPASSWORD, // Pass password non-interactively
        };

        let backupId = new Date().toISOString().replaceAll(' ', '').replaceAll(':', '').replaceAll('-', '').replaceAll('.', '')
        let backupPath =  path.join(process.cwd(), `/static/backups/backup_${backupId}.sql`)

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

        setTimeout(() => {
            unlinkSync(backupPath)
        }, 5000)

        return response.success('Copia de Seguridad creada correctamente.', { timestamp: backupId })        
    },

    uploadBackup: async ({locals, request}) => {
        let { log, response } = locals;
    }
} satisfies Actions

function restoreFromCustomDump(dumpPath, dbConfig, pgRestorePath = 'pg_restore') {
  const { host, port, user, password, database } = dbConfig;

  // Configure pg_restore arguments
  const args = [
    '-h', host,
    '-p', port.toString(),
    '-U', user,
    '-d', database,
    '--clean', // Drop objects before recreating (optional)
    '--create', // Create the database (optional)
    dumpPath, // Path to the dump file
  ];

  // Set environment variables
  const env = {
    ...process.env,
    PGPASSWORD: password,
  };

  // Spawn pg_restore process
  const pgRestoreProcess = spawn(pgRestorePath, args, { env });

  // Handle output
  pgRestoreProcess.stderr.on('data', (data) => {
    console.error(`pg_restore error: ${data}`);
  });

  pgRestoreProcess.on('close', (code) => {
    if (code !== 0) {
      console.error(`pg_restore exited with code ${code}`);
    } else {
      console.log('Restoration completed!');
    }
  });
}