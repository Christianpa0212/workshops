// ======= Renderiza el panel principal del administrador =======
exports.mostrarHomeAdmin = (req, res) => {
  res.render('layouts/admin/home', {
    nombre: req.session.user.nombre
  });
};
