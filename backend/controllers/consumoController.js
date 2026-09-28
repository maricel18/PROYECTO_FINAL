const Consumo = require('../models/Consumo');
const Maquina = require('../models/Maquina');

const obtenerConsumos = async (req, res) => {
    try {
        const consumos = await Consumo.findAll({
        order: [['id', 'DESC']]
        });
        res.status(200).json(consumos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener consumos', error: error.message });
    }
};

const registrarConsumo = async (req, res) => {
    try {
        const { codigoMaquina, recurso, valorLeido } = req.body;

        if (!codigoMaquina || !recurso || valorLeido === undefined || valorLeido === '') {
        return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
        }

        const valorReal = parseFloat(valorLeido);
        const maquina = await Maquina.findOne({ where: { codigo: codigoMaquina } });

        let teorico = 0;
        if (maquina) {
        teorico = recurso === 'Agua' ? (maquina.litrosAgua ?? 0) : (maquina.consumoKwh ?? 1.2);
        } else {
        teorico = recurso === 'Agua' ? 45 : 1.5;
        }

        const diferencia = parseFloat((valorReal - teorico).toFixed(2));

        let semaforo = 'Eficiente';
        if (recurso === 'Agua') {
        if (diferencia > 10) {
            semaforo = 'Crítico';
        } else if (diferencia > 2) {
            semaforo = 'Atención';
        }
        } else {
        if (diferencia > 1.0) {
            semaforo = 'Crítico';
        } else if (diferencia > 0.3) {
            semaforo = 'Atención';
        }
        }

        const nuevoConsumo = await Consumo.create({
        codigoMaquina,
        recurso,
        teorico,
        real: valorReal,
        diferencia,
        semaforo
        });

        res.status(201).json(nuevoConsumo);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al registrar consumo', error: error.message });
    }
};

module.exports = {
    obtenerConsumos,
    registrarConsumo
};