// controllers/reportesAdminController.js
const db = require('../../../config/db/db');
const { generatePDFBuffer } = require('../../../utils/pdfmakeGenerator');

// 1. Vista previa: Alumnos
const getReporteAlumnos = async (req, res) => {
  const { idperiodo } = req.params;
  try {
    const [alumnos] = await db.query(
      `SELECT * FROM view_admin_alumnos WHERE idalumno IN (
        SELECT idalumno FROM inscripciones i
        JOIN talleres t ON i.idtaller = t.idtaller
        WHERE t.idperiodo = ?
      )`,
      [idperiodo]
    );
    res.json(alumnos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener alumnos' });
  }
};

// 2. PDF: Alumno individual
const getReporteAlumnoByIdPDF = async (req, res) => {
  const { idalumno, idperiodo } = req.params;
  try {
    const [datos] = await db.query(
      `SELECT * FROM view_reporte_alumno_detalle
       WHERE idalumno = ? AND idtaller IN (
         SELECT idtaller FROM talleres WHERE idperiodo = ?
       )`,
      [idalumno, idperiodo]
    );
    if (!datos.length) return res.status(404).json({ msg: 'No hay datos' });

    const alumno = datos[0];
    const sesiones = datos.map((s, i) => [
      i + 1, s.taller, s.fecha, s.hora, s.asistencia ?? '-', s.titulo ?? '-', s.tipo_material ?? '-'
    ]);

    const docDefinition = {
      content: [
        { text: 'Reporte de Alumno', style: 'header' },
        { text: `Nombre: ${alumno.nombre_completo}` },
        { text: `NUA: ${alumno.nua}` },
        { text: `Nivel: ${alumno.nivel_ingles}` },
        { text: `Profesor: ${alumno.profesor_email}`, margin: [0, 0, 0, 10] },
        {
          table: {
            headerRows: 1,
            widths: ['auto', '*', 'auto', 'auto', 'auto', '*', '*'],
            body: [
              ['#', 'Taller', 'Fecha', 'Hora', 'Asistencia', 'Material', 'Tipo'],
              ...sesiones
            ]
          }
        }
      ],
      styles: { header: { fontSize: 18, bold: true, alignment: 'center' } },
      defaultStyle: { font: 'Roboto' }
    };

    const buffer = await generatePDFBuffer(docDefinition);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=reporte_alumno_${idalumno}.pdf`);
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ msg: 'Error al generar PDF' });
  }
};

// 3. Vista previa: Talleristas
const getReporteTalleristas = async (_req, res) => {
  try {
    const [data] = await db.query(`SELECT * FROM view_admin_talleristas`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener talleristas' });
  }
};

// 4. PDF: Tallerista individual
const getReporteTalleristaByIdPDF = async (req, res) => {
  const { idtallerista } = req.params;
  try {
    const [datos] = await db.query(`SELECT * FROM view_reporte_tallerista_detalle WHERE idtallerista = ?`, [idtallerista]);
    if (!datos.length) return res.status(404).json({ msg: 'No hay datos' });

    const tallerista = datos[0];
    const filas = datos.map((d, i) => [i + 1, d.taller, d.fecha, d.hora, d.alumno ?? '-', d.asistencia ?? '-']);

    const docDefinition = {
      content: [
        { text: 'Reporte de Tallerista', style: 'header' },
        { text: `Nombre: ${tallerista.nombre_completo}` },
        { text: `Correo: ${tallerista.email}`, margin: [0, 0, 0, 10] },
        {
          table: {
            headerRows: 1,
            widths: ['auto', '*', 'auto', 'auto', '*', 'auto'],
            body: [
              ['#', 'Taller', 'Fecha', 'Hora', 'Alumno', 'Asistencia'],
              ...filas
            ]
          }
        }
      ],
      styles: { header: { fontSize: 18, bold: true, alignment: 'center' } },
      defaultStyle: { font: 'Roboto' }
    };

    const buffer = await generatePDFBuffer(docDefinition);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=reporte_tallerista_${idtallerista}.pdf`);
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ msg: 'Error al generar PDF' });
  }
};

// 5. Vista previa: Niveles
const getReporteNiveles = async (_req, res) => {
  res.json([
    { clave: '1A' }, { clave: '1B' }, { clave: '2A' }, { clave: '2B' }, { clave: '3A' }, { clave: '3B' }
  ]);
};

// 6. PDF: Nivel general
const getReporteNivelByClavePDF = async (req, res) => {
  const { clave } = req.params;
  try {
    const [datos] = await db.query(`SELECT * FROM view_reporte_nivel_general WHERE nivel_ingles = ?`, [clave]);
    if (!datos.length) return res.status(404).json({ msg: 'No hay datos' });

    const filas = datos.map((d, i) => [i + 1, d.alumno, d.nua, d.total_asistencias, d.total_faltas]);

    const docDefinition = {
      content: [
        { text: `Reporte Nivel ${clave}`, style: 'header' },
        {
          table: {
            headerRows: 1,
            widths: ['auto', '*', 'auto', 'auto', 'auto'],
            body: [
              ['#', 'Alumno', 'NUA', 'Asistencias', 'Faltas'],
              ...filas
            ]
          }
        }
      ],
      styles: { header: { fontSize: 18, bold: true, alignment: 'center' } },
      defaultStyle: { font: 'Roboto' }
    };

    const buffer = await generatePDFBuffer(docDefinition);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=reporte_nivel_${clave}.pdf`);
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ msg: 'Error al generar PDF' });
  }
};

// 7. Vista previa: Talleres
const getReporteTalleres = async (req, res) => {
  const { idperiodo } = req.params;
  try {
    const [data] = await db.query(`SELECT * FROM view_admin_talleres WHERE idperiodo = ?`, [idperiodo]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener talleres' });
  }
};

// 8. PDF: Taller individual
const getReporteTallerByIdPDF = async (req, res) => {
  const { idtaller } = req.params;
  try {
    const [datos] = await db.query(`SELECT * FROM view_reporte_taller_general WHERE idtaller = ?`, [idtaller]);
    if (!datos.length) return res.status(404).json({ msg: 'No hay datos' });

    const taller = datos[0];
    const filas = datos.map((d, i) => [i + 1, d.alumno ?? '-', d.nua ?? '-', d.asistencia ?? '-']);

    const docDefinition = {
      content: [
        { text: 'Reporte de Taller', style: 'header' },
        { text: `Taller: ${taller.taller}` },
        { text: `Tallerista: ${taller.tallerista}` },
        { text: `Fecha: ${taller.fecha}` },
        { text: `Hora: ${taller.hora}`, margin: [0, 0, 0, 10] },
        {
          table: {
            headerRows: 1,
            widths: ['auto', '*', 'auto', 'auto'],
            body: [
              ['#', 'Alumno', 'NUA', 'Asistencia'],
              ...filas
            ]
          }
        }
      ],
      styles: { header: { fontSize: 18, bold: true, alignment: 'center' } },
      defaultStyle: { font: 'Roboto' }
    };

    const buffer = await generatePDFBuffer(docDefinition);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=reporte_taller_${idtaller}.pdf`);
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ msg: 'Error al generar PDF' });
  }
};

// 9. Vista previa: Profesores
const getReporteProfesores = async (_req, res) => {
  try {
    const [data] = await db.query(`SELECT * FROM view_admin_profesores`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener profesores' });
  }
};

// 10. PDF: Profesor individual
const getReporteProfesorByIdPDF = async (req, res) => {
  const { idprofesor } = req.params;
  try {
    const [datos] = await db.query(`SELECT * FROM view_reporte_profesor_alumnos WHERE idprofesor = ?`, [idprofesor]);
    if (!datos.length) return res.status(404).json({ msg: 'No hay datos' });

    const profesor = datos[0].profesor;
    const filas = datos.map((d, i) => [i + 1, d.alumno, d.nua, d.total_asistencias, d.total_faltas]);

    const docDefinition = {
      content: [
        { text: `Reporte del Profesor`, style: 'header' },
        { text: `Nombre: ${profesor}`, margin: [0, 0, 0, 10] },
        {
          table: {
            headerRows: 1,
            widths: ['auto', '*', 'auto', 'auto', 'auto'],
            body: [
              ['#', 'Alumno', 'NUA', 'Asistencias', 'Faltas'],
              ...filas
            ]
          }
        }
      ],
      styles: { header: { fontSize: 18, bold: true, alignment: 'center' } },
      defaultStyle: { font: 'Roboto' }
    };

    const buffer = await generatePDFBuffer(docDefinition);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=reporte_profesor_${idprofesor}.pdf`);
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ msg: 'Error al generar PDF' });
  }
};

module.exports = {
  getReporteAlumnos,
  getReporteAlumnoByIdPDF,
  getReporteTalleristas,
  getReporteTalleristaByIdPDF,
  getReporteNiveles,
  getReporteNivelByClavePDF,
  getReporteTalleres,
  getReporteTallerByIdPDF,
  getReporteProfesores,
  getReporteProfesorByIdPDF
};
