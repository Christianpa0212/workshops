const express = require('express');
const router = express.Router();

const generalRoutes = require('./gen/generalRoutes');
const authRoutes = require('./auth/authRoutes');

// ======= Rutas públicas =======
router.use('/', generalRoutes);
router.use('/', authRoutes);

module.exports = router;
