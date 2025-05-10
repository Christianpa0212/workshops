const express = require('express');
const router = express.Router();
const professorController = require('../../../../controllers/admin/user/professor/professorAdminControllers');

// ======= Vista principal (HBS) =======
router.get('/', professorController.renderProfessorListView);

// ======= API REST (JSON) =======
router.get('/api', professorController.getAllProfessors);      
router.get('/api/:id', professorController.getProfessorById);     
router.post('/api', professorController.createProfessor);   
router.put('/api/:id', professorController.updateProfessor);      
router.delete('/api/:id', professorController.deleteProfessor);   

// ======= Exportación =======
module.exports = router;
