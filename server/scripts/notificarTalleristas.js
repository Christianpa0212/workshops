require('dotenv').config();
const sgMail = require('../config/emailConfig');
const db = require('../config/db/db');

async function notificarTalleresSinInscritos() {
  try {
    const [talleres] = await db.query(`
  SELECT t.idtaller, t.nombre, t.fecha, t.hora,
         u.email AS correo_tallerista,
         CONCAT(u.nombre, ' ', u.paterno, ' ', u.materno) AS nombre_tallerista
  FROM talleres t
  JOIN usuarios u ON t.idtallerista = u.iduser
  WHERE t.estado = 'active'
    AND DATE(t.fecha) = CURDATE()
    AND TIMESTAMPDIFF(HOUR, NOW(), CONCAT(t.fecha, ' ', t.hora)) BETWEEN 0 AND 3
    AND NOT EXISTS (
      SELECT 1 FROM inscripciones i
      WHERE i.idtaller = t.idtaller AND i.estatus = 'inscrito'
    )
`);


    if (talleres.length === 0) {
      console.log("✅ No hay talleres sin inscritos en las próximas 3 horas");
      return;
    }

    for (const taller of talleres) {
      const msg = {
        to: taller.correo_tallerista,
        from: process.env.CORREO_ADMIN,
        subject: `📭 Taller sin inscritos: ${taller.nombre}`,
        html: `
          <p>Hola ${taller.nombre_tallerista},</p>
          <p>Tu taller <strong>${taller.nombre}</strong>, programado para hoy a las ${taller.hora}, no tiene alumnos inscritos a 3 horas de comenzar.</p>
          <p>Te recomendamos estar al pendiente por si se cancela automáticamente.</p>
        `
      };

      await sgMail.send(msg);
      console.log(`✉️ Correo enviado a ${taller.correo_tallerista}`);
    }
  } catch (error) {
    console.error("❌ Error general:", error);
  }
}

notificarTalleresSinInscritos();
module.exports = notificarTalleresSinInscritos;