const sgMail = require('../config/emailConfig');
const db = require('../config/db/db');

async function notificarTalleristaPorCancelacion(idinscripcion) {
  try {
    const [[info]] = await db.query(`
      SELECT
        a.idalumno,
        CONCAT(u_al.nombre, ' ', u_al.paterno, ' ', u_al.materno) AS nombre_alumno,
        t.nombre AS nombre_taller,
        t.fecha,
        t.hora,
        CONCAT(u_tall.nombre, ' ', u_tall.paterno, ' ', u_tall.materno) AS nombre_tallerista,
        u_tall.email AS email_tallerista
      FROM inscripciones i
      JOIN alumnos a ON i.idalumno = a.idalumno
      JOIN usuarios u_al ON a.idalumno = u_al.iduser
      JOIN talleres t ON i.idtaller = t.idtaller
      JOIN usuarios u_tall ON t.idtallerista = u_tall.iduser
      WHERE i.idinscripcion = ?
    `, [idinscripcion]);

    if (!info) return;

    const msg = {
      to: info.email_tallerista,
      from: process.env.CORREO_ADMIN,
      subject: `🔔 Cancelación de inscripción en el taller ${info.nombre_taller}`,
      html: `
        <p>Hola ${info.nombre_tallerista},</p>
        <p>Te informamos que el alumno <strong>${info.nombre_alumno}</strong> ha cancelado su inscripción al taller <strong>${info.nombre_taller}</strong>.</p>
        <p>Fecha: ${info.fecha} &nbsp;&nbsp; Hora: ${info.hora}</p>
      `
    };

    await sgMail.send(msg);
    console.log(`✉️ Notificación enviada a ${info.email_tallerista}`);
  } catch (error) {
    console.error("❌ Error al notificar tallerista por cancelación de alumno:", error);
  }
}

module.exports = notificarTalleristaPorCancelacion;
