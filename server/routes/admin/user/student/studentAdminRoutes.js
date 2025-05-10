const express = require('express');
const router = express.Router();
const studentController = require('../../../../controllers/admin/user/student/studentAdminControllers');

// Vista principal: renderiza tabla de alumnos
router.get('/', studentController.renderAlumnoListView);

// API REST
router.get('/api', studentController.getAllAlumnos);          
router.get('/api/:id', studentController.getAlumnoById);       
router.put('/api/:id', studentController.updateAlumno);       
router.delete('/api/:id', studentController.deleteAlumno);     

module.exports = router;
