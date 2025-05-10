const express = require('express');
const router = express.Router();
const tallerController = require('../../../controllers/admin/workshop/workshopAdminControllers');

// Vista principal
router.get('/', tallerController.renderTalleresView);

// APIs para la sección Admin
router.get('/api', tallerController.getTalleres);              
router.get('/api/:id', tallerController.getTallerById);           
router.get('/talleristas/api', tallerController.getTalleristas); 
router.post('/api', tallerController.createTaller);               
router.put('/api/:id', tallerController.editTaller);            
router.patch('/estado/:id', tallerController.changeEstadoTaller); 

module.exports = router;
