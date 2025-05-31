import type { StyleDictionary, TDocumentDefinitions } from "pdfmake/interfaces";
import { format, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns';
import type { Alumno, Empleado, GradoAlumno, GradoCursado, Representante, RepresentantesAlumnos } from "$lib/database/types";
import path from "path"
import { capitalizeFirstLetter } from "$lib/utils/capitlizeFirstLetter";

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

export function createEmpleadoDocDef(empleado: Empleado) {
    // Simple paths to assets
    let bannerGobernacionPath = path.join(process.cwd(), '/src/lib/handlers/pdf/images/bannerMinisterio.jpg')
    let logoColegioPath = path.join(process.cwd(), '/src/lib/handlers/pdf/images/logoColegio.jpg')

    const docDefinition: TDocumentDefinitions = {
        pageSize: "A4",
        content: [
            // Header
            {
                text: `REPUBLICA BOLIVARIANA DE VENEZUELA
                        MINISTERIO DEL PODER POPULAR PARA LA EDUCACIÓN
                        UNIDAD EDUCATIVA  NACIONAL “ARMANDO REVERON”`,
                bold: true,
                alignment: "center",
                margin: [0, 20, 0, 0],
                lineHeight: 1.5
            },

            {
                text: "INFORMACIÓN DEL EMPLEADO",
                bold: true,
                margin: [0, 20, 0, 0],
                alignment: 'center',
                decoration: 'underline'
            },


            {
                columns: [
                    { width: '*', text: '' },
                    {
                        width: 'auto',
                        table: {
                            body: [
                                [{ text: 'FECHA', bold: true }],
                                [new Date().toLocaleDateString()]
                            ],
                            widths: [100],
                        },
                        margin: [0, 16, 0, 10]
                    },
                ]
            },


            // Personal information section
            {
                text: 'INFORMACION PERSONAL',
                bold: true,
                margin: [0, 10, 0, 5]
            },
            {
                table: {
                    headerRows: 1,
                    widths: ['*', '*', '*'],
                    body: [
                        [
                            { text: 'APELLIDOS', bold: true, border: [true, true, true, false] },
                            { text: 'NOMBRES', bold: true, border: [true, true, true, false]},
                            { text: 'C.I', bold: true, border: [true, true, true, false] },
                        ],
                        [
                            `${empleado.primer_apellido} ${empleado.segundo_apellido}`,
                            `${empleado.primer_nombre} ${empleado.segundo_nombre}`,
                            `${empleado.cedula}` || ''
                        ]
                    ]
                },
                margin: [0, 5, 0, 5]
            },
            {
                table: {
                    headerRows: 1,
                    widths: ['*', '*', '*', '*'],
                    body: [
                        [
                            { text: 'SEXO', bold: true, border: [true, true, true, false] },
                            { text: 'FECHA DE NAC.', bold: true, border: [true, true, true, false] },
                            { text: 'EDAD', bold: true, border: [true, true, true, false] },
                            { text: 'ESTADO', bold: true, border: [true, true, true, false] },
                        ],
                        [
                            { text: `${capitalizeFirstLetter(empleado.sexo)}`, bold: true }, 
                            empleado.fecha_nacimiento.toLocaleDateString() || '',
                            `${empleado.edad} Años` || '',
                            `${empleado.estado === "Activo" ? "Empleado Activo" : "Empleado Retirado"}`, 
                        ]
                    ]
                },
                margin: [0, 5, 0, 5]
            },

            // PROFESIONAL
            {
                text: 'INFORMACIÓN PROFESIONAL',
                bold: true,
                margin: [0, 10, 0, 5]
            },
            {
                table: {
                    headerRows: 1,
                    widths: ['*', '*', '*'],
                    body: [
                        [
                            { text: 'GRADO DE INSTRUCCION', bold: true, border: [true, true, true, false] },
                            { text: 'ESPECIALIZACION', bold: true, border: [true, true, true, false]},
                            { text: 'AREA', bold: true, border: [true, true, true, false] },
                        ],
                        [
                            empleado.grado_instruccion,
                            empleado.especializacion,
                            empleado.area
                        ]
                    ]
                },
                margin: [0, 5, 0, 5]
            },

            // INFORMACION DENTRO DE LA INSTITUCION
            {
                text: 'INFORMACION LABORAL',
                bold: true,
                margin: [0, 10, 0, 5]
            },
            {
                table: {
                    headerRows: 1,
                    widths: ['*', '*', '*', '*'],
                    body: [
                        [
                            { text: 'CARGO', bold: true, border: [true, true, true, false] },
                            { text: 'GECHA DE INGRESO', bold: true, border: [true, true, true, false]},
                            { text: 'TIEMPO DE SERVICIO', bold: true, border: [true, true, true, false] },
                            { text: 'TURNO', bold: true, border: [true, true, true, false] },
                        ],
                        [
                            empleado.cargo,
                            empleado.especializacion,
                            `${empleado.tiempo_servicio} Años`,
                            empleado.turno,
                        ]
                    ]
                },
            } 
        ],
        styles: {
            header: {
                fontSize: 16,
                bold: true,
                margin: [0, 10, 0, 10]
            },
            subheader: {
                fontSize: 14,
                bold: true,
                margin: [0, 10, 0, 5]
            }
        },
        defaultStyle: {
            fontSize: 10
        }
    };

    return docDefinition;
}