const Maquina = require('../models/Maquina');

const obtenerMaquinas = async (req, res) => {
    try {
        const maquinas = await Maquina.findAll({
        order: [['id', 'DESC']] 
        });
        res.status(200).json(maquinas);
    } catch (error) {
        console.error('Error al obtener máquinas:', error);
        res.status(500).json({ 
        mensaje: 'Error al obtener las máquinas', 
        error: error.message 
        });
    }
    };

    const obtenerMaquinaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const maquina = await Maquina.findByPk(id);

        if (!maquina) {
        return res.status(404).json({ mensaje: 'Máquina no encontrada' });
        }

        res.status(200).json(maquina);
    } catch (error) {
        console.error('Error al buscar máquina:', error);
        res.status(500).json({ 
        mensaje: 'Error al buscar la máquina', 
        error: error.message 
        });
    }
    };

    const crearMaquina = async (req, res) => {
    try {
        const { 
        codigo, 
        tipo, 
        marca, 
        modelo, 
        capacidadKg, 
        litrosAgua, 
        consumoKwh, 
        estado 
        } = req.body;

        if (!codigo || !tipo || !capacidadKg) {
        return res.status(400).json({ 
            mensaje: 'Los campos código, tipo y capacidad (Kg) son obligatorios.' 
        });
        }

        const existe = await Maquina.findOne({ where: { codigo } });
        if (existe) {
        return res.status(400).json({ 
            mensaje: `El código "${codigo}" ya está registrado.` 
        });
        }

        const nuevaMaquina = await Maquina.create({
        codigo: codigo.trim(),
        tipo,
        marca: marca ? marca.trim() : 'ECOWASH',
        modelo: modelo ? modelo.trim() : 'Estándar',
        capacidadKg: parseFloat(capacidadKg),
        litrosAgua: litrosAgua ? parseFloat(litrosAgua) : 45,
        consumoKwh: consumoKwh ? parseFloat(consumoKwh) : 1.2,
        estado: estado || 'Disponible'
        });

        res.status(201).json(nuevaMaquina);
    } catch (error) {
        console.error('Error al registrar máquina:', error);
        res.status(500).json({ 
        mensaje: 'Error al registrar la máquina', 
        error: error.message 
        });
    }
    };

    const actualizarMaquina = async (req, res) => {
    try {
        const { id } = req.params;
        const maquina = await Maquina.findByPk(id);

        if (!maquina) {
        return res.status(404).json({ mensaje: 'Máquina no encontrada' });
        }

        const datosActualizados = { ...req.body };
        if (datosActualizados.capacidadKg) {
        datosActualizados.capacidadKg = parseFloat(datosActualizados.capacidadKg);
        }
        if (datosActualizados.litrosAgua) {
        datosActualizados.litrosAgua = parseFloat(datosActualizados.litrosAgua);
        }
        if (datosActualizados.consumoKwh) {
        datosActualizados.consumoKwh = parseFloat(datosActualizados.consumoKwh);
        }

        await maquina.update(datosActualizados);
        res.status(200).json(maquina);
    } catch (error) {
        console.error('Error al actualizar máquina:', error);
        res.status(500).json({ 
        mensaje: 'Error al actualizar la máquina', 
        error: error.message 
        });
    }
    };

    const eliminarMaquina = async (req, res) => {
    try {
        const { id } = req.params;
        const maquina = await Maquina.findByPk(id);

        if (!maquina) {
        return res.status(404).json({ mensaje: 'Máquina no encontrada' });
        }

        await maquina.destroy();
        res.status(200).json({ mensaje: 'Máquina eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar máquina:', error);
        res.status(500).json({ 
        mensaje: 'Error al eliminar la máquina', 
        error: error.message 
        });
    }
    };

    module.exports = {
    obtenerMaquinas,
    obtenerMaquinaPorId,
    crearMaquina,
    actualizarMaquina,
    eliminarMaquina
};