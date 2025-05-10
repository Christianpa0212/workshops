const db = require('../../config/db/db');

// Talleres al calendario
exports.getSchedule = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM view_talleres_calendario');
  res.json(rows);
};
