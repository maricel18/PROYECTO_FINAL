const express = require('express');
const router = express.Router();
const {
    obtenerIncidencias,
    crearIncidencia,
    cambiarEstadoIncidencia
    } = require('../controllers/incidenciaController');

router.get('/', obtenerIncidencias);
router.post('/', crearIncidencia);
router.put('/:id', cambiarEstadoIncidencia);

module.exports = router;