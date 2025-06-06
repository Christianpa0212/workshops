
const sgMail = require('../config/emailConfig');
const db = require('../config/db/db');

async function notificarCancelacionTaller(idtaller) {
  try {
    const [alumnos] = await db.query(`
      SELECT u.email, u.nombre AS nombre_alumno, t.nombre AS nombre_taller
      FROM inscripciones i
      JOIN usuarios u ON u.idusuario = i.idalumno
      JOIN talleres t ON t.idtaller = i.idtaller
      WHERE i.idtaller = ? AND i.estatus = 'inscrito'
    `, [idtaller]);

    for (const alumno of alumnos) {
      const msg = {
        to: alumno.email,
        from: process.env.CORREO_ADMIN,
        subject: `🚫 Cancelación del taller ${alumno.nombre_taller}`,
        html: `
          <p>Hola ${alumno.nombre_alumno},</p>
          <p>Lamentamos informarte que el taller <strong>${alumno.nombre_taller}</strong> ha sido cancelado.</p>
          <p>Te invitamos a revisar otros talleres disponibles en el sistema para que puedas inscribirte.</p>
        `
      };

      await sgMail.send(msg);
      console.log(`✉️ Notificación enviada a ${alumno.email}`);
    }
  } catch (err) {
    console.error("❌ Error al enviar notificaciones de cancelación:", err);
  }
}

module.exports = notificarCancelacionTaller;
