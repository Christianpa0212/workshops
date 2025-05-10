const express = require('express');
const router = express.Router();
const generalController = require('../../controllers/gen/generalControllers');

// ======= Redireccion =======
router.get('/', (req, res) => {
  res.redirect('/horarios');
});

// ======= Vistas =======
router.get('/horarios', (req, res) => {
  res.render('layouts/gen/horarios');
});

// ======= API =======
router.get('/api/horarios', generalController.getSchedule);

module.exports = router;
