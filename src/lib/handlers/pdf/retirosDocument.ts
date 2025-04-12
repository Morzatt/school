import { StyleDictionary, TDocumentDefinitions } from "pdfmake/interfaces";
import { Retiro } from "../../data/types";

const styles: StyleDictionary = {
    text_header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10] // margin: [izquierda, arriba, derecha, abajo]
    },
    text_subheader: {
        fontSize: 16,
        bold: true,
        margin: [0, 10, 0, 5]
    },
}

// Grupal Document Definition
export function createRetirosDocDefinition(retiros: Retiro[]) {

    function generateTableBody(retirosArr: Retiro[]) {
        var body: string[][] = [];
        var titulos = ["Afiliado", "Fecha", "Cedula", "Total", "Motivo", "Modalidad", "Referencia"]; // Static headers
        body.push(titulos); // Push headers to the body

        for (let key in retirosArr) {
            if (retirosArr.hasOwnProperty(key)) {
                let retiro = retirosArr[key];
                let fila = [`${retiro.nombre} ${retiro.apellido}`, `${retiro.fecha}`, `${retiro.cedula}`,`${retiro.total}Bs`,
                    `${retiro.motivo}`, `${retiro.modalidad}`, `${retiro.referencia ? retiro.referencia : ""}`];
                body.push(fila); // Push each row to the body
            }
        }
        return body
    }

    const grupalDocDefinition: TDocumentDefinitions = {
        pageSize: "A3",
        content: [
            {
                columns: [
                    {
                        image: `src/middleware/pdf/images/logoGobernacion.png`,
                        width: 120, height: 60,
                        margin: [0, 0, 0, 0], alignment: "left",
                    },
                    {
                        text: `CAJA DE AHORRO DE LOS EMPLEADOS, JUBILADOS Y PENSIONADOS 
                                ADMINISTRATIVOS DE LA GOBERNACIÓN DEL ESTADO BOLIVAR 
                                (CAEJPA-GEB) Registro Nº 766 del Sector Público. Rif. Nº J-31336163-1`,
                        width: "auto",
                        bold: true,
                        fontSize: 10,
                        color: "#0032C4",
                        alignment: "center"
                    }
                ]
            },
            { text: `Retiros registrados desde el ${from} hasta el ${to}`, margin: [0, 20, 0, 30] },
            {
                alignment: "center",
                table: {
                    headerRows: 1,
                    widths: "*",
                    body: generateTableBody(retiros)
                }
            }
        ],
        styles: styles
    };
    return grupalDocDefinition
}