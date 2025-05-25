// ======= Renderiza el panel principal del Tallerista =======
exports.mostrarHomeTallerist = (req, res) => {
  res.render('layouts/tallerist/home', {
    nombre: req.session.user.nombre
  });
};
