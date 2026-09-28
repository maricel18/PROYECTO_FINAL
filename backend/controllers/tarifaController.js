const Tarifa = require('../models/Tarifa');

const obtenerTarifas = async (req, res) => {
    try {
        let tarifa = await Tarifa.findOne({ order: [['id', 'DESC']] });
        if (!tarifa) {
        tarifa = await Tarifa.create({
            tarifaAgua: 0.02,
            tarifaElectricidad: 1.10,
            fechaActualizacion: '01/09/2026'
        });
        }
        res.status(200).json(tarifa);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener tarifas', error: error.message });
    }
};

const guardarTarifas = async (req, res) => {
    try {
        const { tarifaAgua, tarifaElectricidad } = req.body;
        const fechaHoy = new Date().toLocaleDateString('es-ES');

        let tarifa = await Tarifa.findOne({ order: [['id', 'DESC']] });

        if (tarifa) {
        await tarifa.update({
            tarifaAgua: parseFloat(tarifaAgua),
            tarifaElectricidad: parseFloat(tarifaElectricidad),
            fechaActualizacion: fechaHoy
        });
        } else {
        tarifa = await Tarifa.create({
            tarifaAgua: parseFloat(tarifaAgua),
            tarifaElectricidad: parseFloat(tarifaElectricidad),
            fechaActualizacion: fechaHoy
        });
        }

        res.status(200).json(tarifa);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al guardar tarifas', error: error.message });
    }
};

module.exports = {
    obtenerTarifas,
    guardarTarifas
};