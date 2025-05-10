const express = require('express');
const router = express.Router();

// Importamos subrutas específicas por tipo de usuario
const studentRoutes = require('./student/studentAdminRoutes');  
const talleristRoutes = require('./tallerist/talleristAdminRoutes'); 
const professorRoutes = require('./professor/professorAdminRoutes'); 

// Delegamos a cada grupo su prefijo
router.use('/alumnos', studentRoutes);     
router.use('/talleristas', talleristRoutes); 
router.use('/profesores', professorRoutes);  

module.exports = router;
