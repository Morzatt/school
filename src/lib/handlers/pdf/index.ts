import { createHorario, createIndividualdDocDefinition} from "./documents";
import PdfPrinter from "pdfmake";
import fs from "fs"
import path from "path";
import type { HorarioPrint } from "../print.handlers";
import { handleError } from "$lib/utils/asyncHandler";

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

export function printHorario(horario: HorarioPrint[], path: string) {
    const horarioDocDefinition = createHorario(horario) 
    const pdfDoc = printer.createPdfKitDocument(horarioDocDefinition);
    let res = pdfDoc.pipe(fs.createWriteStream(path));

    if (res.errored){
        throw res.errored
    }

    pdfDoc.end();
}