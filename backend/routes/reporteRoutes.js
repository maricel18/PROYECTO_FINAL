const express = require('express');
const router = express.Router();
const { obtenerHistorial, registrarEvento } = require('../controllers/reporteController');

router.get('/', obtenerHistorial);
router.post('/', registrarEvento);

module.exports = router;