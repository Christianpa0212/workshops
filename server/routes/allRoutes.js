const express = require('express');
const router = express.Router();

// ======= Middlewares =======
const { isAdmin } = require('../middlewares/auth/authMiddlewares');
const { isStudent } = require('../middlewares/auth/authMiddlewares');
const { isTallerist } = require('../middlewares/auth/authMiddlewares');

// ======= Subrutas =======
const adminRoutes = require('./admin/adminRoutes');
const studentRoutes = require('./student/studentRoutes');
const talleristRoutes = require('./tallerist/talleristRoutes');
const generalRoutes = require('./gen/generalRoutes');
const authRoutes = require('./auth/authRoutes');

// ======= Rutas protegidas =======
router.use('/admin', isAdmin, adminRoutes);
router.use('/alumno', isStudent, studentRoutes);
router.use('/tallerista', isTallerist, talleristRoutes);

// ======= Rutas públicas =======
router.use('/', generalRoutes);
router.use('/', authRoutes);

// ======= Ruta para retroalimentación 5 estrellas ======
const fs = require('fs');
const path = require('path');

router.post('/guardar-valoracion', (req, res) => {
  const { estrellas } = req.body;

  if (!estrellas || estrellas < 1 || estrellas > 5) {
    return res.status(400).json({ mensaje: 'Valor inválido' });
  }

  const rutaArchivo = path.join(__dirname, '../data/valoraciones.txt');
  const fecha = new Date().toLocaleString('es-MX');
  const entrada = `[${fecha}] Calificación: ${estrellas} estrellas\n`;

  fs.appendFile(rutaArchivo, entrada, err => {
    if (err) {
      console.error(err);
      return res.status(500).json({ mensaje: 'Error al guardar la calificación' });
    }
    res.status(200).json({ mensaje: '¡Gracias por tu calificación!' });
  });
});

module.exports = router;
