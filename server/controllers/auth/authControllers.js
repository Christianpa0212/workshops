const bcrypt = require('bcryptjs');
const db = require('../../config/db/db');

// ======= Mostrar formulario de registro =======
exports.mostrarRegistro = async (req, res) => {
  const [profesores] = await db.execute('SELECT * FROM view_profesores');
  res.render('layouts/auth/register', { profesores });
};

// ======= Registrar nuevo alumno =======
exports.registrarAlumno = async (req, res) => {
  const { nombre, paterno, materno, email, password, nua, nivel_ingles, idprofesor } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const [existe] = await db.execute('SELECT iduser FROM usuarios WHERE email = ?', [email]);

  if (existe.length === 0) {
    await db.execute(
      'CALL sp_registrar_alumno(?, ?, ?, ?, ?, ?, ?, ?)',
      [nombre, paterno, materno, email, hashedPassword, nua, nivel_ingles, idprofesor]
    );
    return res.redirect('/login');
  }

  res.redirect('/registro');
};

// ======= Mostrar formulario de login =======
exports.mostrarLogin = (req, res) => {
  res.render('layouts/auth/login');
};

// ======= Login de usuario según rol =======
exports.loginUsuario = async (req, res) => {
  const { email, password } = req.body;

  const [rows] = await db.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
  if (rows.length === 0) return res.redirect('/login');

  const user = rows[0];
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.redirect('/login');

  req.session.user = {
    id: user.iduser,
    rol: user.rol,
    nombre: user.nombre
  };

  switch (user.rol) {
    case 'admin': return res.redirect('/admin');
    case 'alumno': return res.redirect('/alumno');
    case 'tallerista': return res.redirect('/tallerista');
  }
};
