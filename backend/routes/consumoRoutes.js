const express = require('express');
const router = express.Router();
const { obtenerConsumos, registrarConsumo } = require('../controllers/consumoController');

router.get('/', obtenerConsumos);
router.post('/', registrarConsumo);

module.exports = router;