const express = require('express');
const router = express.Router();
const {
    obtenerMaquinas,
    crearMaquina,
    actualizarMaquina,
    eliminarMaquina
} = require('../controllers/maquinaController');

router.get('/maquinas', obtenerMaquinas);
router.post('/maquinas', crearMaquina);
router.put('/maquinas/:id', actualizarMaquina);
router.delete('/maquinas/:id', eliminarMaquina);

module.exports = router;