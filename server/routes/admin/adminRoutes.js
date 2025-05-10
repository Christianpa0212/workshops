const express = require('express');
const router = express.Router();

const homeAdminController = require('../../controllers/admin/adminViewsControllers');

// ======= Subrutas administrativas =======
const userRoutes = require('./user/userAdminRoutes');       // Alumnos, talleristas y profesores');
const workshopRoutes = require('./workshop/workshopRoutes');

// ======= Vista principal del administrador =======
router.get('/', homeAdminController.mostrarHomeAdmin);

// ======= Redirección por defecto de usuarios =======
router.get('/usuarios', (req, res) => {
  res.redirect('/admin/usuarios/alumnos');
});

// ======= Submódulos =======
router.use('/usuarios', userRoutes);
router.use('/periodos', periodRoutes);
router.use('/talleres', workshopRoutes);

// ======= Exportación =======
module.exports = router;
