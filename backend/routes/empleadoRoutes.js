const express = require('express');
const router = express.Router();
const {
    iniciarSesion,
    obtenerEmpleados,
    crearEmpleado,
    actualizarEmpleado,
    eliminarEmpleado
    } = require('../controllers/empleadoController');

router.post('/login', iniciarSesion);
router.get('/', obtenerEmpleados);
router.post('/', crearEmpleado);
router.put('/:id', actualizarEmpleado);
router.delete('/:id', eliminarEmpleado);

module.exports = router;