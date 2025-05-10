const express = require('express');
const router = express.Router();
const talleristController = require('../../../../controllers/admin/user/tallerist/talleristAdminControllers');

// Vista principal: renderiza tabla de talleristas
router.get('/', talleristController.renderTalleristListView);

// API REST
router.get('/api', talleristController.getAllTallerists);        
router.get('/api/:id', talleristController.getTalleristById);      
router.post('/api', talleristController.createTallerist);        
router.put('/api/:id', talleristController.updateTallerist);     
router.delete('/api/:id', talleristController.deleteTallerist);  

module.exports = router;
