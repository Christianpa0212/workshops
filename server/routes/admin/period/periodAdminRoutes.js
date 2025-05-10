const express = require('express');
const router = express.Router();
const periodoController = require('../../../controllers/admin/period/periodAdminControllers');

// ======= Vista principal (HBS) =======
router.get('/', periodoController.renderPeriodoView);

// ======= API: Endpoints JSON =======
router.get('/api', periodoController.getPeriodos);
router.get('/api/:id', periodoController.getPeriodoById);
router.get('/activo/api', periodoController.getPeriodoActivo);
router.post('/api', periodoController.createPeriodo);
router.put('/api/:id', periodoController.updatePeriodo);

// ======= Exportación =======
module.exports = router;
