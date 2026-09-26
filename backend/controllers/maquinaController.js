const Maquina = require('../models/Maquina');

const obtenerMaquinas = async (req, res) => {
    try {
        const maquinas = await Maquina.findAll();
        res.status(200).json(maquinas);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener las máquinas', error: error.message });
    }
};

const crearMaquina = async (req, res) => {
    try {
        const { codigo, tipo, capacidadKg, estado, tiempoRestanteMin } = req.body;
        
        // Validar código existente
        const existe = await Maquina.findOne({ where: { codigo } });
        if (existe) {
        return res.status(400).json({ mensaje: `El código ${codigo} ya se encuentra registrado.` });
        }

        const nuevaMaquina = await Maquina.create({
        codigo,
        tipo,
        capacidadKg,
        estado: estado || 'Disponible',
        tiempoRestanteMin: tiempoRestanteMin || 0
        });

        res.status(201).json(nuevaMaquina);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al registrar la máquina', error: error.message });
    }
};

const actualizarMaquina = async (req, res) => {
    try {
        const { id } = req.params;
        const maquina = await Maquina.findByPk(id);
        
        if (!maquina) {
        return res.status(404).json({ mensaje: 'Máquina no encontrada' });
        }

        await maquina.update(req.body);
        res.status(200).json(maquina);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar la máquina', error: error.message });
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
        res.status(500).json({ mensaje: 'Error al eliminar la máquina', error: error.message });
    }
};

module.exports = {
    obtenerMaquinas,
    crearMaquina,
    actualizarMaquina,
    eliminarMaquina
};