const express = require('express');
const router = express.Router();
const authController = require('../../controllers/auth/authControllers');

// ======= Registro =======
router.get('/registro', authController.mostrarRegistro);
router.post('/registro', authController.registrarAlumno);

// ======= Login =======
router.get('/login', authController.mostrarLogin);
router.post('/login', authController.loginUsuario);

// ======= Logout =======
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = router;
