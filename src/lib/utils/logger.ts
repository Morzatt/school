// logger set up

import pino, { destination } from "pino"
import path from "path"

const logger = pino({
    level: "error",
    timestamp: pino.stdTimeFunctions.isoTime,
    transport: {
        targets: [
            {
                target: "pino-pretty",
            },
            {
                target: "pino/file",
                options: { destination: path.join(process.cwd(), "/app.log") }
            }
        ]
    },
    redact: ["contraseña"]
})

export default logger; 