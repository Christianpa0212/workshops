// ======= Renderiza el panel principal del Estudiante =======
exports.mostrarHomeStudent = (req, res) => {
  res.render('layouts/student/home', {
    nombre: req.session.user.nombre
  });
};
