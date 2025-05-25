const express = require('express');
const router = express.Router();

const homeStudentController = require('../../controllers/student/studentViewsControllers');

// ======= Subrutas administrativas =======
const workshopRoutes = require('./workshop/workshopRoutes');

// ======= Vista principal del estudiante =======
router.get('/', homeStudentController.mostrarHomeStudent);

// ======= Submódulos =======
router.use('/talleres', workshopRoutes);

// ======= Exportación =======
module.exports = router;
