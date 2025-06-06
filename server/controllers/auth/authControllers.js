const bcrypt = require('bcryptjs');
const db = require('../../config/db/db');
const sgMail = require('../../config/emailConfig');

// ======= Mostrar formulario de registro =======
exports.mostrarRegistro = async (req, res) => {
  const [profesores] = await db.execute('SELECT * FROM view_profesores');
  res.render('layouts/auth/register', { profesores });
};

// ======= Registrar nuevo alumno y enviar correo =======
exports.registrarAlumno = async (req, res) => {
  const { nombre, paterno, materno, email, password, nua, nivel_ingles, idprofesor } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Verificar si el correo ya existe
    const [existe] = await db.execute('SELECT iduser FROM usuarios WHERE email = ?', [email]);
    if (existe.length > 0) {
      return res.redirect('/registro');
    }

    // Registrar alumno en la base de datos
    await db.execute(
      'CALL sp_registrar_alumno(?, ?, ?, ?, ?, ?, ?, ?)',
      [nombre, paterno, materno, email, hashedPassword, nua, nivel_ingles, idprofesor]
    );

    // Validación de campo obligatorio para evitar error de SendGrid
    if (!email) {
      console.error('❌ El email del alumno es obligatorio.');
      return res.status(400).json({ error: 'Correo del alumno no disponible' });
    }

    // Enviar correo de confirmación
    const msg = {
      to: email,
      from: process.env.CORREO_ADMIN,
      subject: '🎓 Registro exitoso en la plataforma',
      html: `
        <p>Hola <strong>${nombre}</strong>,</p>
        <p>Tu registro se ha completado exitosamente.</p>
        <p>Ahora puedes iniciar sesión y registrarte a los talleres disponibles.</p>
        <p>¡Bienvenido!</p>
      `
    };

    await sgMail.send(msg);
    return res.redirect('/login');

  } catch (err) {
    console.error('❌ Error en registro o envío de correo:', err);
    return res.status(500).json({ error: 'Error en registro o envío de correo' });
  }
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
    default: return res.redirect('/login');
  }
};

