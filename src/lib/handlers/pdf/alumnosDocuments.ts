import type { StyleDictionary, TDocumentDefinitions } from "pdfmake/interfaces";
import { format, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns';
import type { Alumno, GradoAlumno, GradoCursado, Representante, RepresentantesAlumnos } from "$lib/database/types";
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

export function createListaAsistenciasDocDefinition(alumnos: Array<Alumno & GradoAlumno>) {
    function generateTableBody() {
        let diasMes = obtenerDiasDelMesActual('dd')
        var body: any[][] = [];
        var titulos = [
            'N',
            'Nombres y Apellidos',
            'C.E',
            'S',
            ...diasMes
        ]; // Static headers
        body.push(titulos); // Push headers to the body

        for (let i = 0; i < alumnos.length; i++) {
            let fila = [
                `${i+1}`,
               `${alumnos[i].primer_apellido} ${alumnos[i].segundo_apellido}, ${alumnos[i].primer_nombre} ${alumnos[i].segundo_nombre}`,
               `${(alumnos[i].cedula_escolar)}`,
               {text: `${alumnos[i].sexo[0]}`, bold: true},
               ...diasMes.map(i => { return "" })
            ];
            body.push(fila); // Push each row to the body
        }
        return body
    }

    let logo = path.join(process.cwd(), 'src/lib/handlers/pdf/images/logoColegio.jpg')

    const grupalDocDefinition: TDocumentDefinitions = {
        pageSize: "A2",
        content: [
            {
                columns: [
                    {
                        image:  logo,
                        width: 120,
                        height: 80,
                        margin: [0, 0, 0, 0], alignment: "left",
                    },
                    {
                        text: `República Bolivariana de Venezuela
                                Ministerio del Poder Popular para la Educación
                                U.E.N Armando Reverón`,
                        width: "auto",
                        bold: true,
                        fontSize: 10,
                        alignment: "center"
                    },
                ]
            },

            { text: `Ciudad Bolívar, ${new Date().toLocaleDateString()}`, alignment: "right", margin: [0, 20, 0, 0] },

            {text: `Control de Asistencias`, margin: [0, 10, 0, 0], style: 'text_header',  },
            {text:'1er Grado Seccion "A"', style: 'text_subheader',  },
            {text:'Periodo 2024-2025', style: 'text_subheader',  },

            {
                margin: [0, 20, 0, 0],
                columns: [
                    {
                        width: '100%',
                        alignment: "center",
                        table: {
                            headerRows: 1,
                            body: generateTableBody()
                        }
                    }
                ]
            }
        ],
        styles: styles
    };
    return grupalDocDefinition
}

function obtenerDiasDelMesActual(formatType: string) {
  const fechaActual = new Date();
  const inicioMes = startOfMonth(fechaActual);
  const finMes = endOfMonth(fechaActual);
  
  const diasDelMes = eachDayOfInterval({
    start: inicioMes,
    end: finMes
  });
  
  // Formatear cada fecha como string (ejemplo: "2023-04-01")
  return diasDelMes.map(fecha => format(fecha, formatType));
}

export function createAlumnoDocDef(alumno: Alumno, representantes: Array<Representante & RepresentantesAlumnos> | undefined, gradosCursados: GradoCursado[] | undefined) {
    // Simple paths to assets
    let bannerGobernacionPath = path.join(process.cwd(), '/src/lib/handlers/pdf/images/bannerMinisterio.jpg')
    let logoColegioPath = path.join(process.cwd(), '/src/lib/handlers/pdf/images/logoColegio.jpg')

    let gradoActual = gradosCursados?.filter((i) => { return i.estado === "En Curso" })[0]

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
                text: "INFORMACIÓN DEL ALUMNO",
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
                            { text: 'C.E', bold: true, border: [true, true, true, false] },
                        ],
                        [
                            `${alumno.primer_apellido} ${alumno.segundo_apellido}`,
                            `${alumno.primer_nombre} ${alumno.segundo_nombre}`,
                            `${alumno.cedula_escolar}` || ''
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
                            { text: 'NIVEL EDUCATIVO', bold: true, border: [true, true, true, false] },
                        ],
                        [
                            { text: `${capitalizeFirstLetter(alumno.sexo)}`, bold: true }, 
                            alumno.fecha_nacimiento.toLocaleDateString() || '',
                            `${alumno.edad} Años` || '', 
                            `${gradoActual === undefined ? 'Nivel No Asignado' : gradoActual.grado.includes('Grado') ? "Alumno de Primaria" : "Alumno de Preescolar"}` || '', 
                        ]
                    ]
                },
                margin: [0, 5, 0, 5]
            },


            // INFORMACION ESCOLAR
            {
                text: 'INFORMACION PERSONAL',
                bold: true,
                margin: [0, 10, 0, 5]
            },

            // Donor declaration
            // {
            //     text: 'DECLARACIÓN DEL DONANTE',
            //     bold: true,
            //     alignment: 'center',
            //     margin: [0, 10, 0, 5]
            // },
            // {
            //     ol: [
            //         'Doy fe de que los datos suministrados voluntariamente por mi en esta historia al personal médico de este Banco de Sangre son verídicos.',
            // {
            //     text: [
            //                 'Certifico que he sido informado y conozco el texto del artículo 7 de la Ley sobre Transfusiones y Bancos de Sangre que establece: ',
            //                 { text: '"A los efectos de esta Ley, se entiende por donante de sangre o hemodador a toda persona mayor de 18 años y menor de 60 que, previo el cumplimiento de los requisitos legales y reglamentarios, cede voluntaria, libre y gratuitamente, con fines terapéuticos o de investigación, una porción de su sangre en la forma y cuantía que indique la prescripción médica en cada oportunidad."', bold: true },
            //             ]
            //         },
            //         'Doy fe de que estoy en conocimiento que las personas pertenecientes a los grupos de riesgo para SIDA, NO DEBEN DONAR SANGRE, y que por lo tanto mi sangre es suficientemente segura y puede ser usada para la transfusión.'
            //     ],
            //     margin: [0, 0, 0, 20]
            // },
            // {
            //     text: `Ciudad Bolivar, a los ${new Date(donacion.fecha).getDate()} días del mes de ${new Date(donacion.fecha).toLocaleDateString('es', { month: 'long' })} del año ${new Date(donacion.fecha).getFullYear()}`,
            //     alignment: 'center',
            //     margin: [0, 10, 0, 30]
            // },
            // {
            //     text: '___________________________',
            //     alignment: 'center',
            //     margin: [0, 0, 0, 5]
            // },
            // {
            //     text: 'Firma del Donante',
            //     alignment: 'center'
            // }
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