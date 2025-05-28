const express = require('express');
const router = express.Router();
const workshopsController = require('../../../controllers/tallerist/workshop/workshopTalleristControllers');

// Renderiza la vista principal de talleres del tallerista
router.get('/', workshopsController.renderWorkshopsView);

// API: Ver talleres propios
router.get('/api/mis-talleres', workshopsController.getTalleresPropios);

// API: Crear nuevo taller
router.post('/api/crear', workshopsController.crearTaller);

// API: Cancelar taller
router.post('/api/cancelar/:idtaller', workshopsController.cancelarTaller);

// API: Ver inscritos a un taller
router.get('/api/inscritos/:idtaller', workshopsController.getInscritosTaller);

// API: Marcar asistencias
router.post('/api/asistencia', workshopsController.marcarAsistencias);

// editar taller
router.put('/api/:idtaller', workshopsController.editarTaller);

// API: id 
router.get('/api/mis-talleres/:idtaller', workshopsController.getTallerById);

module.exports = router;
