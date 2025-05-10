const db = require('../../../../config/db/db');

// GET /api/admin/alumnos
exports.getAllAlumnos = async (req, res) => {
  const [rows] = await db.execute('SELECT * FROM view_admin_alumnos');
  res.status(200).json(rows);
};

// GET /api/admin/alumnos/:id
exports.getAlumnoById = async (req, res) => {
  const { id } = req.params;
  const [rows] = await db.execute(
    'SELECT * FROM view_admin_alumno_by_id WHERE idalumno = ?',
    [id]
  );

  if (rows.length === 0) {
    return res.status(404).json({ message: 'Alumno no encontrado' });
  }

  res.status(200).json(rows[0]);
};

// PUT /api/admin/alumnos/:id
exports.updateAlumno = async (req, res) => {
  const {
    nombre,
    paterno,
    materno,
    email,
    nua,
    nivel_ingles,
    idprofesor
  } = req.body;
  const { id } = req.params;

  if (!nombre || !email || !nua || !nivel_ingles) {
    return res.status(400).json({ message: 'Faltan campos obligatorios' });
  }

  await db.execute(
    'CALL sp_editar_alumno(?, ?, ?, ?, ?, ?, ?, ?)',
    [id, nombre, paterno, materno, email, nua, nivel_ingles, idprofesor]
  );

  res.status(200).json({ message: 'Alumno actualizado correctamente' });
};

// DELETE /api/admin/alumnos/:id
exports.deleteAlumno = async (req, res) => {
  const { id } = req.params;
  await db.execute('CALL sp_eliminar_alumno(?)', [id]);
  res.sendStatus(204);
};


// GET /admin/usuarios/alumnos
exports.renderAlumnoListView = async (req, res) => {
  const [alumnos] = await db.execute('SELECT * FROM view_admin_alumnos');
  res.render('layouts/admin/users', {
    tipo: 'alumno',
    datos: alumnos
  });
};