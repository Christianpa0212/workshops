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

module.exports = router;
