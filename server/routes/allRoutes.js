const express = require('express');
const router = express.Router();

// ======= Middlewares =======
const { isAdmin } = require('../middlewares/auth/authMiddlewares');

// ======= Subrutas =======
const adminRoutes = require('./admin/adminRoutes');
const generalRoutes = require('./gen/generalRoutes');
const authRoutes = require('./auth/authRoutes');

// ======= Rutas protegidas =======
router.use('/admin', isAdmin, adminRoutes);

// ======= Rutas públicas =======
router.use('/', generalRoutes);
router.use('/', authRoutes);

module.exports = router;
