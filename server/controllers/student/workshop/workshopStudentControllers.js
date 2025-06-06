const db = require('../../../config/db/db');
const sgMail = require('../../../config/emailConfig');

// ===============================
// Renderizar vista de talleres del alumno
// ===============================
exports.renderWorkshopsView = async (req, res) => {
  res.render('layouts/student/talleres');
};

// ===============================
// Obtener talleres activos para el calendario
// ===============================
exports.getTalleresParaCalendario = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM view_taller_by_id');
    res.json(rows);
  } catch (error) {
    console.error("❌ Error al cargar talleres para calendario:", error);
    res.status(500).json({ error: 'Error al obtener talleres' });
  }
};

// ===============================
// Obtener inscripciones del alumno (tabla)
// ===============================
exports.getMisInscripciones = async (req, res) => {
  const idalumno = req.session.user.id;
  try {
    const [rows] = await db.query('SELECT * FROM view_inscripciones_alumno WHERE idalumno = ?', [idalumno]);
    res.json(rows);
  } catch (error) {
    console.error('❌ Error al obtener inscripciones:', error);
    res.status(500).json({ error: 'Error al obtener inscripciones' });
  }
};


// Función auxiliar para generar el rango de fechas para Google Calendar
function formateaParaGoogleCalendar(fecha, hora) {
  const [year, month, day] = fecha.split('-');
  const [hour, minute] = hora.split(':');
  const start = `${year}${month}${day}T${hour}${minute}00`;
  const endHour = String(parseInt(hour) + 1).padStart(2, '0'); // taller de 1 hora
  const end = `${year}${month}${day}T${endHour}${minute}00`;
  return `${start}/${end}`;
}

// ===============================
// Inscribirse a un taller
// ===============================
exports.inscribirseTaller = async (req, res) => {
  const idalumno = req.session.user.id;
  const { idtaller } = req.params;

  try {
    await db.query('CALL sp_inscribirse_taller(?, ?)', [idalumno, idtaller]);

    const [[alumno]] = await db.query(`
      SELECT u.nombre, u.paterno, u.materno, u.email
      FROM alumnos a
      JOIN usuarios u ON a.idalumno = u.iduser
      WHERE a.idalumno = ?
    `, [idalumno]);

    const [[taller]] = await db.query(`
      SELECT nombre, fecha, hora
      FROM talleres
      WHERE idtaller = ?
    `, [idtaller]);

    //---------------------------------------------
    const fechaStr = typeof taller.fecha === 'string'
  ? taller.fecha
  : taller.fecha.toISOString().split('T')[0];

const horaStr = typeof taller.hora === 'string'
  ? taller.hora
  : taller.hora.toString().slice(0, 5);

const calendarLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(taller.nombre)}&dates=${formateaParaGoogleCalendar(fechaStr, horaStr)}&details=Inscripción al taller ${encodeURIComponent(taller.nombre)}`;
//--------------------------------

    const msg = {
      to: alumno.email,
      from: process.env.CORREO_ADMIN,
      subject: '🎓 Confirmación de inscripción a taller',
      html: `
        <p>Hola <strong>${alumno.nombre} ${alumno.paterno}</strong>,</p>
        <p>Te confirmamos tu inscripción al taller <strong>${taller.nombre}</strong>.</p>
        <p>📅 Fecha: <strong>${taller.fecha}</strong><br>
           🕒 Hora: <strong>${taller.hora}</strong></p>
        <p><a href="${calendarLink}" target="_blank">📆 Agregar a Google Calendar</a></p>
        <p>¡Gracias por participar!</p>
      `
    };

    await sgMail.send(msg);

    res.status(201).json({ message: 'Inscripción y correo enviados correctamente' });

  } catch (error) {
    console.error('❌ Error al inscribirse:', error);
    res.status(400).json({ error: error.sqlMessage || 'No se pudo inscribir' });
  }
};


// ===============================
// Cancelar inscripción
// ===============================
const notificarTalleristaPorCancelacion = require('../../../scripts/notificarCancelacionAlumno');

exports.cancelarInscripcion = async (req, res) => {
  const { idinscripcion } = req.params;

  try {
    await db.query('CALL sp_cancelar_inscripcion(?)', [idinscripcion]);

    //  Notificar al tallerista
    await notificarTalleristaPorCancelacion(idinscripcion);

    res.json({ message: 'Inscripción cancelada y tallerista notificado' });
  } catch (error) {
    console.error('❌ Error al cancelar inscripción:', error);
    res.status(400).json({ error: error.sqlMessage || 'No se pudo cancelar' });
  }
};


// ===============================
// Verifica si el alumno está inscrito y obtiene estado del taller
// ===============================
exports.verificarInscripcion = async (req, res) => {
  const idalumno = req.session.user.id;
  const { idtaller } = req.params;

  try {
    // Obtener inscripción si existe
    const [inscripciones] = await db.query(
      'SELECT idinscripcion FROM inscripciones WHERE idalumno = ? AND idtaller = ? AND estatus = "inscrito"',
      [idalumno, idtaller]
    );

    // Obtener estado del taller
    const [tallerInfo] = await db.query(
      'SELECT estado FROM talleres WHERE idtaller = ?',
      [idtaller]
    );

    const response = {
      inscrito: inscripciones.length > 0,
      estado: tallerInfo.length > 0 ? tallerInfo[0].estado : 'desconocido'
    };

    if (response.inscrito) {
      response.idinscripcion = inscripciones[0].idinscripcion;
    }

    res.json(response);
  } catch (error) {
    console.error('❌ Error verificando inscripción:', error);
    res.status(500).json({ error: 'Error al verificar inscripción' });
  }
};

// ===============================
// Obtener detalles de una inscripción por ID
// ===============================
exports.getInscripcionById = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      'SELECT * FROM view_inscripciones_alumno WHERE idinscripcion = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Inscripción no encontrada' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("❌ Error al obtener inscripción:", error);
    res.status(500).json({ error: 'Error al obtener inscripción' });
  }
};



// funcionalidad para reportes
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');


exports.generarReporteAlumno = async (req, res) => {
  // Verificación de sesión y correo
  if (!req.session.user || !req.session.user.email) {
    return res.status(400).send('Sesión no válida o sin correo');
  }

  const idalumno = req.session.user.id;
  const email = req.session.user.email;

  try {
    const [talleres] = await db.query(
      'SELECT nombre_taller AS nombre, fecha, hora FROM view_inscripciones_alumno WHERE idalumno = ?',
      [idalumno]
    );

    const tempDir = path.join(__dirname, '../../../../client/public/temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true }); // permite crear carpetas anidadas
    }

    const filePath = path.join(tempDir, `reporte_alumno_${idalumno}.pdf`);
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Logo
    doc.image(path.join(__dirname, '../../../../client/public/img/logo.png'), 50, 30, { width: 80 });

    doc.fontSize(20).text('Reporte de Talleres Asistidos', 150, 30);
    doc.moveDown(2);

    if (talleres.length === 0) {
      doc.image(path.join(__dirname, '../../../../client/public/img/vacio.png'), { width: 150 });
      doc.fontSize(16).text('No asististe a ningún taller.', { align: 'center' });
    } else {
      talleres.forEach((t, i) => {
        doc.fontSize(12).text(`${i + 1}. ${t.nombre} - ${t.fecha} - ${t.hora}`);
      });
    }

    doc.end();

    stream.on('finish', async () => {
      try {
        // Enviar por correo
        await sgMail.send({
          to: email,
          from: process.env.CORREO_ADMIN, 

          subject: 'Reporte de Talleres Asistidos',
          text: 'Aquí está tu reporte de talleres en PDF.',
          attachments: [{
            content: fs.readFileSync(filePath).toString("base64"),
            filename: "reporte_talleres.pdf",
            type: "application/pdf",
            disposition: "attachment"
          }]
        });

        // Descargar archivo PDF
        res.download(filePath, err => {
          if (!err) {
            // Opcional: eliminar archivo después de enviarlo y descargarlo
            fs.unlinkSync(filePath);
          }
        });

      } catch (correoError) {
        console.error("❌ Error al enviar correo:", correoError);
        res.status(500).send("Error al enviar el reporte por correo.");
      }
    });

  } catch (error) {
    console.error('❌ Error al generar PDF:', error);
    res.status(500).send('Error al generar el reporte');
  }
};
