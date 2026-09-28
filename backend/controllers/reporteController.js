const HistorialEvento = require('../models/HistorialEvento');

const obtenerHistorial = async (req, res) => {
    try {
        const eventos = await HistorialEvento.findAll({
        order: [['id', 'DESC']]
        });
        res.status(200).json(eventos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener historial', error: error.message });
    }
};

const registrarEvento = async (req, res) => {
    try {
        const { codigoMaquina, evento, detalle, litrosConsumidos, kwhConsumidos } = req.body;
        const fechaHoy = new Date().toLocaleDateString('es-ES');

        const nuevoEvento = await HistorialEvento.create({
        fecha: fechaHoy,
        codigoMaquina,
        evento,
        detalle,
        litrosConsumidos: litrosConsumidos || 0,
        kwhConsumidos: kwhConsumidos || 0
        });

        res.status(201).json(nuevoEvento);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al registrar evento', error: error.message });
    }
};

module.exports = {
    obtenerHistorial,
    registrarEvento
};