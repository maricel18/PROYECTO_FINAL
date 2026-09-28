const express = require('express');
const router = express.Router();
const { obtenerTarifas, guardarTarifas } = require('../controllers/tarifaController');

router.get('/', obtenerTarifas);
router.post('/', guardarTarifas);

module.exports = router;