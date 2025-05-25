const db = require('../../config/db/db');

exports.getSchedule = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM view_talleres_calendario');

  const eventos = rows.map(t => ({
    id: t.id,                 
    title: t.title,            
    start: t.start,               
    extendedProps: {
      descripcion: t.descripcion,
      fecha: t.fecha,
      hora: t.hora,
      periodo: t.periodo,
      tallerista: t.tallerista
    }
  }));

  res.json(eventos);
};
