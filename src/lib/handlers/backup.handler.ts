import { fail, type RequestEvent } from '@sveltejs/kit';
import { usuarioRepository, type UsuarioRepositoryInterface } from '$lib/database/repositories/user.repository';
import type { NewUsuario } from '$lib/database/types';
import { unlinkSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { VITE_PGDATABASE, VITE_PGUSER } from '$env/static/private';
import path from 'path';
import { postgresPool } from '$lib/database';

function formatDate(date: Date): string {
    return `${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate()}_${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}_${date.getMilliseconds()}`;
}

async function produceDumpFile(timestamp: string) {
    await postgresPool.connect()
    try {
        const result = await postgresPool.query(`pg_dump -d ${import.meta.env.VITE_PGDATABASE} > ./static/backup_${timestamp}.sql`);
        console.log('Database dump successful');
    } catch (err) {
        console.error('Error:', err);
    }
}

export async function createBackupHandler(
    { request }: RequestEvent,
    repository: UsuarioRepositoryInterface = usuarioRepository,
) {
    let timestamp = formatDate(new Date())
    // execSync(`psql -U ${VITE_PGUSER} -d ${VITE_PGDATABASE} > ./static/backup_${timestamp}.sql`)
    await produceDumpFile(timestamp)

    setTimeout(() => {
        unlinkSync(path.join(process.cwd(), `/static/backup_${timestamp}.sql`))
    }, 5000)

    return { success: true, form: "generate", timestamp: timestamp}
}

export async function uploadBackupHandler(
    { request }: RequestEvent,
    repository: UsuarioRepositoryInterface = usuarioRepository,
    mock?: {formData: NewUsuario }
) {
    let formData = Object.fromEntries(await request.formData())
    let { backupUpload } = formData as { backupUpload: File }

    if (!backupUpload.name.endsWith(".sql")) return fail(400, { success: false, type: "Error", message: "El archivo seleccionado no es una archivo sql" });
    writeFileSync(`static/${backupUpload.name}`, Buffer.from(await backupUpload.arrayBuffer()));

    execSync(`psql -U ${VITE_PGUSER} -d ${VITE_PGDATABASE} < ./static/${backupUpload.name}`)

    setTimeout(() => {
        unlinkSync(`static/${backupUpload.name}`)
    }, 5000)

    return { success: true, type: "Success", message: "Solicitud procesada con éxito!" };
}

const { spawn } = require('child_process');
const fs = require('fs');

/**
 * Creates a PostgreSQL database dump.
 * @param {string} outputPath - Path to save the dump file.
 * @param {object} dbConfig - Database connection details.
 * @param {string} [pgDumpPath='pg_dump'] - Path to pg_dump executable.
 */
function createPgDump(outputPath, dbConfig, pgDumpPath = 'pg_dump') {
  const { host, port, user, password, database } = dbConfig;

  // Configure pg_dump arguments
  const args = [
    '-h', host,
    '-p', port.toString(),
    '-U', user,
    '-d', database,
    // Add other options (e.g., '-Fc' for custom format)
  ];

  // Set environment variables (including password)
  const env = {
    ...process.env,
    PGPASSWORD: password, // Pass password non-interactively
  };

  // Create write stream for the output
  const outputStream = fs.createWriteStream(outputPath);

  // Spawn pg_dump process
  const pgDumpProcess = spawn(pgDumpPath, args, { env });

  // Pipe stdout to the output file
  pgDumpProcess.stdout.pipe(outputStream);

  // Handle errors and process exit
  pgDumpProcess.stderr.on('data', (data) => {
    console.error(`pg_dump error: ${data}`);
  });

  pgDumpProcess.on('close', (code) => {
    if (code !== 0) {
      console.error(`pg_dump exited with code ${code}`);
    } else {
      console.log('Dump created successfully at', outputPath);
    }
  });

  // Handle stream errors
  outputStream.on('error', (err) => {
    console.error('File write error:', err);
  });
}

// Example configuration
createPgDump('./backup.sql', {
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'your_password',
  database: 'your_database'
});
