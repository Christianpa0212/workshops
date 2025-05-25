const express = require('express');
const router = express.Router();
const workshopsController = require('../../../controllers/student/workshop/workshopStudentControllers');

// Renderiza la vista principal de talleres del alumno
router.get('/', workshopsController.renderWorkshopsView);

// API: Obtener talleres activos para calendario (vista compartida con tallerista)
router.get('/api/talleres-calendario', workshopsController.getTalleresParaCalendario);

// API: Obtener inscripciones del alumno (para la tabla)
router.get('/api/inscripciones', workshopsController.getMisInscripciones);

// API: Inscribirse a un taller (desde el calendario)
router.post('/api/inscribirse/:idtaller', workshopsController.inscribirseTaller);

// API: Cancelar inscripción (desde el calendario o tabla)
router.post('/api/cancelar/:idinscripcion', workshopsController.cancelarInscripcion);

//Verifica inscripcion
router.get('/api/estado-inscripcion/:idtaller', workshopsController.verificarInscripcion);

module.exports = router;
