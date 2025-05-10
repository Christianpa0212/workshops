const db = require('../../../../config/db/db');
const bcrypt = require('bcryptjs');

// ============================
// Vista para renderizar HBS
// ============================
exports.renderProfessorListView = async (req, res) => {
  const [profesores] = await db.execute('SELECT * FROM view_admin_profesores');
  res.render('layouts/admin/usuarios', { tipo: 'profesor', datos: profesores });
};

// ============================
// API REST JSON
// ============================

// GET /api
exports.getAllProfessors = async (req, res) => {
  const [rows] = await db.execute('SELECT * FROM view_admin_profesores');
  res.status(200).json(rows);
};

// GET /api/:id
exports.getProfessorById = async (req, res) => {
  const { id } = req.params;
  const [rows] = await db.execute(
    'SELECT * FROM view_admin_profesor_by_id WHERE idprofesor = ?',
    [id]
  );

  if (rows.length === 0) {
    return res.status(404).json({ message: 'Profesor no encontrado' });
  }

  res.status(200).json(rows[0]);
};

// POST /api
exports.createProfessor = async (req, res) => {
  const { nombre, paterno, materno, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  await db.execute('CALL sp_nuevo_profesor(?, ?, ?, ?, ?)', [
    nombre, paterno, materno, email, hash
  ]);

  res.status(201).json({ message: 'Profesor creado correctamente' });
};

// PUT /api/:id
exports.updateProfessor = async (req, res) => {
  const { id } = req.params;
  const { nombre, paterno, materno, email } = req.body;

  await db.execute(
    'CALL sp_editar_profesor(?, ?, ?, ?, ?)',
    [id, nombre, paterno, materno, email]
  );

  res.status(200).json({ message: 'Profesor actualizado correctamente' });
};

// DELETE /api/:id
exports.deleteProfessor = async (req, res) => {
  const { id } = req.params;

  await db.execute('CALL sp_eliminar_profesor(?)', [id]);

  res.status(200).json({ message: 'Profesor eliminado correctamente' });
};
