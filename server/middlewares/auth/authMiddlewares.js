// ======= Middleware: Acceso solo para administradores =======
const isAdmin = (req, res, next) => {
  if (!req.session.user || req.session.user.rol !== 'admin') {
    return res.status(403).send('Acceso denegado: solo administradores');
  }
  next();
};

// ======= Middleware: Acceso solo para alumnos =======
const isStudent = (req, res, next) => {
  if (!req.session.user || req.session.user.rol !== 'alumno') {
    return res.status(403).send('Acceso denegado: solo alumnos');
  }
  next();
};

// ======= Middleware: Acceso solo para talleristas =======
const isTallerist = (req, res, next) => {
  if (!req.session.user || req.session.user.rol !== 'tallerista') {
    return res.status(403).send('Acceso denegado: solo talleristas');
  }
  next();
};

// ======= Exportación =======
module.exports = {
  isAdmin,
  isStudent,
  isTallerist
};
