const db = require('../../../../config/db/db');
const bcrypt = require('bcryptjs');

// ============================
// Vista para renderizar HBS
// ============================
exports.renderTalleristListView = async (req, res) => {
  const [talleristas] = await db.execute('SELECT * FROM view_admin_talleristas');
  res.render('layouts/admin/usuarios', { tipo: 'tallerista', datos: talleristas });
};

// ============================
// API REST JSON
// ============================

// GET /api
exports.getAllTallerists = async (req, res) => {
  const [rows] = await db.execute('SELECT * FROM view_admin_talleristas');
  res.status(200).json(rows);
};

// GET /api/:id
exports.getTalleristById = async (req, res) => {
  const { id } = req.params;
  const [rows] = await db.execute(
    'SELECT * FROM view_admin_tallerista_by_id WHERE idtallerista = ?',
    [id]
  );

  if (rows.length === 0) {
    return res.status(404).json({ message: 'Tallerista no encontrado' });
  }

  res.status(200).json(rows[0]);
};

// POST /api
exports.createTallerist = async (req, res) => {
  const { nombre, paterno, materno, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  await db.execute('CALL sp_nuevo_tallerista(?, ?, ?, ?, ?)', [
    nombre, paterno, materno, email, hash
  ]);

  res.status(201).json({ message: 'Tallerista creado correctamente' });
};

// PUT /api/:id
exports.updateTallerist = async (req, res) => {
  const { id } = req.params;
  const { nombre, paterno, materno, email } = req.body;

  await db.execute(
    'CALL sp_editar_tallerista(?, ?, ?, ?, ?)',
    [id, nombre, paterno, materno, email]
  );

  res.status(200).json({ message: 'Tallerista actualizado correctamente' });
};

// DELETE /api/:id
exports.deleteTallerist = async (req, res) => {
  const { id } = req.params;

  await db.execute('CALL sp_eliminar_tallerista(?)', [id]);

  res.status(200).json({ message: 'Tallerista eliminado correctamente' });
};
