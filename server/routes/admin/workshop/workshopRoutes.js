const express = require('express');
const router = express.Router();
const tallerController = require('../../../controllers/admin/workshop/workshopAdminControllers');
const workshopsController = require('../../../controllers/admin/workshop/workshopAdminControllers');


// ======= Vista principal (HBS) =======
router.get('/', tallerController.renderTalleresView);

// ======= API REST para talleres =======
router.get('/api', tallerController.getTalleres);                
router.get('/api/:id', tallerController.getTallerById);             
//router.post('/api', tallerController.createTaller); 
router.post('/api/crear', workshopsController.createTaller);

router.put('/api/:id', tallerController.editTaller);               
router.patch('/estado/:id', tallerController.changeEstadoTaller);  

// ======= API auxiliar =======
router.get('/talleristas/api', tallerController.getTalleristas);   

module.exports = router;
