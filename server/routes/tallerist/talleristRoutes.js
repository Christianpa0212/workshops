const express = require('express');
const router = express.Router();

const homeTalleristController = require('../../controllers/tallerist/talleristViewControllers');

// ======= Subrutas administrativas =======
const workshopRoutes = require('./workshop/workshopRoutes');

// ======= Vista principal del estudiante =======
router.get('/', homeTalleristController.mostrarHomeTallerist);

// ======= Submódulos =======
router.use('/talleres', workshopRoutes);

// ======= Exportación =======
module.exports = router;
