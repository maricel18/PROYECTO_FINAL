const Incidencia = require('../models/Incidencia');

const obtenerIncidencias = async (req, res) => {
    try {
        const incidencias = await Incidencia.findAll({
        order: [['id', 'DESC']]
        });
        res.status(200).json(incidencias);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener incidencias', error: error.message });
    }
};

const crearIncidencia = async (req, res) => {
    try {
        const { codigoMaquina, descripcion } = req.body;

        if (!codigoMaquina || !descripcion) {
        return res.status(400).json({ mensaje: 'Debe seleccionar una máquina y detallar el problema' });
        }

        const fechaHoy = new Date().toLocaleDateString('es-ES');

        const nuevaIncidencia = await Incidencia.create({
        codigoMaquina,
        descripcion: descripcion.trim(),
        estado: 'Abierta',
        fecha: fechaHoy
        });

        res.status(201).json(nuevaIncidencia);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al registrar incidencia', error: error.message });
    }
    };

    const cambiarEstadoIncidencia = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        const incidencia = await Incidencia.findByPk(id);
        if (!incidencia) {
        return res.status(404).json({ mensaje: 'Incidencia no encontrada' });
        }

        await incidencia.update({ estado });
        res.status(200).json(incidencia);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar estado', error: error.message });
    }
};

module.exports = {
    obtenerIncidencias,
    crearIncidencia,
    cambiarEstadoIncidencia
};