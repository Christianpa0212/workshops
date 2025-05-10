const express = require('express');
const router = express.Router();

const generalRoutes = require('./gen/generalRoutes');

// ======= Rutas públicas =======
router.use('/', generalRoutes);


module.exports = router;
