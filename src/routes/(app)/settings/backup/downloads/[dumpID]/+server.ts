import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import fs from 'node:fs';
import path from 'node:path';
import mime from 'mime';
import { handleError } from '$lib/utils/asyncHandler';

const TEMP_DIR = path.join(process.cwd(), '/static/backups/temporal');

export const GET: RequestHandler = async ({ locals, params }) => {
    let { log, response } = locals;
    const uniqueId = params.dumpID;

    const tempFileName = `backup_${uniqueId}.dump`;
    const tempFilePath = path.join(TEMP_DIR, tempFileName);

    try {
        // Check if the file and metadata exist
        await Promise.all([
            fs.promises.access(tempFilePath, fs.constants.F_OK),
        ]);

        // const dumpFile = JSON.parse(await fs.promises.readFile(tempFileName, 'utf-8'))

        // Determine the content type (try based on original filename extension)
        // const contentType = mime.getType(dumpFile) || 'application/octet-stream';

        // Create a readable stream for the file
        const fileStream = fs.createReadStream(tempFilePath);

        // Return the file as a Response
        return new Response(fileStream, {
            headers: {
                // 'Content-Type': contentType,
                // Content-Disposition header to suggest download and filename
                // 'Content-Disposition': `attachment; filename="${originalFilename}"`,
                // Optional: Add a header to indicate when the file was served (for cleanup logic)
                // 'X-Served-At': Date.now().toString(),
            },
        });

    } catch (e) {
        handleError(log, e, {})
    }
};

