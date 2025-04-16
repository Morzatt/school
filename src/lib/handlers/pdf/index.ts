import { createHorario, createIndividualdDocDefinition} from "./horariosDocuments";
import PdfPrinter from "pdfmake";
import fs from "fs"
import path from "path";
import type { HorarioPrint } from "../print.handlers";
import { handleError } from "$lib/utils/asyncHandler";
import type { TDocumentDefinitions } from "pdfmake/interfaces";
import { createListaAsistenciasDocDefinition } from "./alumnosDocuments";
import type { Alumno, Empleado, Grado, GradoAlumno, GradoCursado } from "$lib/database/types";
import { createBuenaConductaDocument } from "./constanciasDocument";

let fontPath = path.join(process.cwd(), `/src/lib/handlers/pdf/fonts`)

let fonts = {
    Roboto: {
        normal: `${fontPath}/Roboto-Regular.ttf`,
        bold: `${fontPath}/Roboto-Medium.ttf`,
        italics: `${fontPath}/Roboto-Italic.ttf`,
        bolditalics: `${fontPath}/Roboto-MediumItalic.ttf`
    }
};

const printer = new PdfPrinter(fonts);

function print(docDef: TDocumentDefinitions, path: string) {
    const pdfDoc = printer.createPdfKitDocument(docDef);
    let res = pdfDoc.pipe(fs.createWriteStream(path));
    if (res.errored){
        throw res.errored
    }
    pdfDoc.end();
}

export function printHorario(horario: HorarioPrint[], path: string) {
    const horarioDocDefinition = createHorario(horario) 
    print(horarioDocDefinition, path)
}

export function printListadeAsistencias(asistencias: Array<Alumno & GradoAlumno>, path: string) {
    const asistenciasDocDefinition = createListaAsistenciasDocDefinition(asistencias)
    print(asistenciasDocDefinition, path)
}

export function printBuenaConducta(alumno: Alumno, grado: Grado & GradoAlumno | undefined, grado_cursado: GradoCursado | undefined, director: Empleado, path: string) {
    const asistenciasDocDefinition = createBuenaConductaDocument(alumno, grado, grado_cursado, director)
    print(asistenciasDocDefinition, path)
}