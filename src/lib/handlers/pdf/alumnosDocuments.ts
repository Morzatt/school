import type { StyleDictionary, TDocumentDefinitions } from "pdfmake/interfaces";
import { format, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns';
import type { Alumno, GradoAlumno, GradoCursado, Representante, RepresentantesAlumnos } from "$lib/database/types";
import path from "path"
import { capitalizeFirstLetter } from "$lib/utils/capitlizeFirstLetter";
import { formatStringWithDots } from "$lib";

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
    function generateGradosCursadosTableBody() {
        let result: string[][] = []
        let titles = ['GRADO', 'FECHA', 'ESTADO']
        result.push(titles)
        if (gradosCursados && gradosCursados.length > 0) {
            for (let i of gradosCursados) {
                if (i.grado !== gradoActual?.grado) {
                    let grado = [i.grado.replaceAll('\n', '').replaceAll('  ', ' '), `${i.fecha}`, `${i.estado}`]
                    result.push(grado)
                }
            }
        }

        return result
    }

    function generateRepresentantesTableBody() {
        let result: string[][] = []
        let titles = [
            'NOMBRE',
            'APELLIDO',
            'SEXO',
            'EDAD',
            'PARENTESCO',
            'DIRECCION',
            'TELEFONO',
        ]
        result.push(titles)

        if (!representantes || representantes.length < 1) {
            let representante = [
                'N/A',
                'N/A',
                'N/A',
                'N/A',
                'N/A',
                'N/A',
                'N/A',
            ]
            result.push(representante)
            return result
        }

        for (let i of representantes) {
            let representante = [
                i.nombre || 'N/A',
                i.apellido || 'N/A',
                i.sexo || 'N/A',
                i.edad || 'N/A',
                i.relacion || 'N/A',
                i.direccion || 'N/A',
                i.telefono_1 || 'N/A',
            ]
            result.push(representante)
        }
        return result
    }

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
                image: logoColegioPath,
                alignment: 'center',
                width: 100,
                margin: [0, 20, 0, 0]
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
                            `${alumno.estado === "Retirado" ? "Alumno Retirado" : gradoActual === undefined ? 'Nivel No Asignado' : gradoActual.grado.includes('Grado') ? "Alumno de Primaria" : "Alumno de Preescolar"}` || '', 
                        ]
                    ]
                },
                margin: [0, 5, 0, 5]
            },
            {
                table: {
                    headerRows: 1,
                    widths: ['*', '*', '*'],
                    body: [
                        [
                            { text: 'LATERALIDAD', bold: true, border: [true, true, true, false] },
                            { text: 'PESO.', bold: true, border: [true, true, true, false] },
                            { text: 'ESTATURA', bold: true, border: [true, true, true, false] },
                        ],
                        [
                            { text: `${capitalizeFirstLetter(alumno.lateralidad)}`, bold: true }, 
                            `${alumno.peso}kg` || '',
                            `${alumno.estatura}cm ` || '', 
                        ]
                    ]
                },
                margin: [0, 5, 0, 5]
            },
            {
                table: {
                    headerRows: 1,
                    widths: ['*', '*', '*'],
                    body: [
                        [
                            { text: 'CALZADO', bold: true, border: [true, true, true, false] },
                            { text: 'CAMISA', bold: true, border: [true, true, true, false] },
                            { text: 'PANTALON', bold: true, border: [true, true, true, false] },
                        ],
                        [
                            `${alumno.calzado}` || '', 
                            `${alumno.camisa}` || '', 
                            `${alumno.pantalon}` || '', 
                        ]
                    ]
                },
                margin: [0, 5, 0, 5]
            },


            // INFORMACION ESCOLAR
            {
                text: 'INFORMACION ESCOLAR',
                bold: true,
                margin: [0, 10, 0, 5]
            },
            {
                table: {
                    headerRows: 1,
                    widths: ['auto'],
                    body: [
                        [
                            { text: 'GRADO ACTUAL', bold: true, border: [true, true, true, false] },
                        ],
                        [
                            `${gradoActual === undefined ? "No Asignado" : gradoActual.grado}`, 
                        ]
                    ]
                },
                margin: [0, 5, 0, 5]
            },
            {
                text: 'GRADOS CURSADOS',
                margin: [0, 10, 0, 5]
            },
            {
                table: {
                    headerRows: 1,
                    widths: ['*', '*', '*'],
                    body: generateGradosCursadosTableBody(),
                },
                alignment: 'center',
                margin: [0, 5, 0, 5]
            },


            // REPRESENTANTES
            {
                text: 'REPRESENTANTES',
                bold: true,
                margin: [0, 10, 0, 5]
            },
            {
                table: {
                    headerRows: 1,
                    body: generateRepresentantesTableBody(),
                },
                alignment: 'center',
                margin: [0, 5, 0, 5]
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


export function createRepresentanteDocDef(representante: Representante, alumnos: Array<Alumno & { grados_cursados: & GradoCursado[] } & { relacion: string }> | undefined) {
    // Simple paths to assets
    let bannerGobernacionPath = path.join(process.cwd(), '/src/lib/handlers/pdf/images/bannerMinisterio.jpg')
    let logoColegioPath = path.join(process.cwd(), '/src/lib/handlers/pdf/images/logoColegio.jpg')

    function generateAlumnosTableBody() {
        let result: string[][] = []
        let titles = [
            'NOMBRE',
            'APELLIDO',
            'C.E',
            'EDAD',
            'PARENTESCO',
            'GRADO ACTUAL',
        ]
        result.push(titles)

        if (!alumnos || alumnos.length < 1) {
            let alumno = [
                'N/A',
                'N/A',
                'N/A',
                'N/A',
                'N/A',
                'N/A',
            ]
            result.push(alumno)
            return result
        }

        for (let i of alumnos) {
            let gradoActual = i.grados_cursados.filter(g => { return g.estado.includes('En Curso') })[0]
            let representante = [
                `${i.primer_nombre} ${i.segundo_nombre}`,
                `${i.primer_apellido} ${i.segundo_apellido}`,
                `${i.nacionalidad[0]}-${i.cedula_escolar}`,
                `${i.edad} Años`,
                i.relacion,
                gradoActual ? gradoActual.grado : 'No Asignado'
            ]
            result.push(representante)
        }
        return result
    }

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
                image: logoColegioPath,
                alignment: 'center',
                width: 100,
                margin: [0, 20, 0, 0]
            },

            {
                text: "INFORMACIÓN DEL REPRESENTANTE",
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
                    widths: ['*', '*', '*', '*'],
                    body: [
                        [
                            { text: 'APELLIDOS', bold: true, border: [true, true, true, false] },
                            { text: 'NOMBRES', bold: true, border: [true, true, true, false]},
                            { text: 'C.I', bold: true, border: [true, true, true, false] },
                            { text: 'NACIONALIDAD', bold: true, border: [true, true, true, false] },
                        ],
                        [
                            `${representante.apellido}`,
                            `${representante.nombre}`,
                            `${representante.nacionalidad[0]}-${formatStringWithDots(representante.cedula)}` || '',
                            `${representante.nacionalidad}`,
                        ]
                    ]
                },
                margin: [0, 5, 0, 5]
            },
            {
                table: {
                    headerRows: 1,
                    widths: ['*', '*', '*', '*', '*'],
                    body: [
                        [
                            { text: 'SEXO', bold: true, border: [true, true, true, false] },
                            { text: 'FECHA DE NAC.', bold: true, border: [true, true, true, false] },
                            { text: 'EDAD', bold: true, border: [true, true, true, false] },
                            { text: 'GRADO DE INSTRUCCION', bold: true, border: [true, true, true, false] },
                            { text: 'OCUPACION', bold: true, border: [true, true, true, false] },
                        ],
                        [
                            { text: `${capitalizeFirstLetter(representante.sexo)}`, bold: true }, 
                            new Date(representante.fecha_nacimiento).toLocaleDateString() || '',
                            `${representante.edad} Años` || '', 
                            `${representante.grado_instruccion}` || '', 
                            `${representante.ocupacion}` || '', 
                        ]
                    ]
                },
                margin: [0, 5, 0, 5]
            },

            // INFORMACION ESCOLAR
            {
                text: 'INFORMACION DE CONTACTO',
                bold: true,
                margin: [0, 10, 0, 5]
            },
            {
                table: {
                    headerRows: 1,
                    widths: ['*', '*', '*', '*'],
                    body: [
                        [
                            { text: 'DIRECCION', bold: true, border: [true, true, true, false] },
                            { text: 'CORREO ELECTRONICO', bold: true, border: [true, true, true, false] },
                            { text: 'NUMERO DE TELEFONO 1', bold: true, border: [true, true, true, false] },
                            { text: 'NUMERO DE TELEFONO 2', bold: true, border: [true, true, true, false] },
                        ],
                        [
                            `${representante.direccion}`, 
                            `${representante.correo_electronico}`, 
                            `${representante.telefono_1}`, 
                            `${representante.telefono_2}`, 
                        ]
                    ]
                },
                margin: [0, 5, 0, 5]
            },

            {
                text: 'ALUMNOS REPRESENTADOS',
                margin: [0, 10, 0, 5]
            },
            {
                table: {
                    headerRows: 1,
                    body: generateAlumnosTableBody(),
                },
                alignment: 'center',
                margin: [0, 5, 0, 5]
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