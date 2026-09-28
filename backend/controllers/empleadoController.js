const Empleado = require('../models/Empleado');

const iniciarSesion = async (req, res) => {
    try {
        const { usuario, password } = req.body;

        if (!usuario || typeof usuario !== 'string' || !password || typeof password !== 'string') {
        return res.status(400).json({ mensaje: 'Credenciales inválidas o formato no soportado' });
        }

        const usuarioLimpio = usuario.trim();
        const passwordLimpia = password.trim();

        if (usuarioLimpio.length === 0 || passwordLimpia.length === 0 || usuarioLimpio.length > 50) {
        return res.status(400).json({ mensaje: 'Credenciales inválidas' });
        }

        const empleado = await Empleado.findOne({
        where: { usuario: usuarioLimpio, password: passwordLimpia }
        });

        if (!empleado) {
        return res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }

        if (empleado.estado !== 'Activo') {
        return res.status(403).json({ mensaje: 'Usuario inactivo. Acceso denegado.' });
        }

        res.status(200).json({
        id: empleado.id,
        nombre: empleado.nombre,
        usuario: empleado.usuario,
        rol: empleado.rol
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al procesar el inicio de sesión' });
    }
};

const obtenerEmpleados = async (req, res) => {
    try {
        const empleados = await Empleado.findAll({
        attributes: ['id', 'nombre', 'usuario', 'rol', 'estado'],
        order: [['id', 'ASC']]
        });
        res.status(200).json(empleados);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener empleados', error: error.message });
    }
};

const crearEmpleado = async (req, res) => {
    try {
        const { nombre, usuario, password, rol, estado } = req.body;

        if (!nombre || !usuario || !password || !rol) {
        return res.status(400).json({ mensaje: 'Todos los campos obligatorios deben ser llenados' });
        }

        const existe = await Empleado.findOne({ where: { usuario: usuario.trim() } });
        if (existe) {
        return res.status(400).json({ mensaje: `El usuario "${usuario}" ya se encuentra registrado` });
        }

        const nuevoEmpleado = await Empleado.create({
        nombre: nombre.trim(),
        usuario: usuario.trim(),
        password: password.trim(),
        rol,
        estado: estado || 'Activo'
        });

        res.status(201).json(nuevoEmpleado);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al registrar empleado', error: error.message });
    }
};

const actualizarEmpleado = async (req, res) => {
    try {
        const { id } = req.params;
        const empleado = await Empleado.findByPk(id);

        if (!empleado) {
        return res.status(404).json({ mensaje: 'Empleado no encontrado' });
        }

        await empleado.update(req.body);
        res.status(200).json(empleado);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar empleado', error: error.message });
    }
};

const eliminarEmpleado = async (req, res) => {
    try {
        const { id } = req.params;
        const empleado = await Empleado.findByPk(id);

        if (!empleado) {
        return res.status(404).json({ mensaje: 'Empleado no encontrado' });
        }

        await empleado.destroy();
        res.status(200).json({ mensaje: 'Empleado eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar empleado', error: error.message });
    }
};

module.exports = {
    iniciarSesion,
    obtenerEmpleados,
    crearEmpleado,
    actualizarEmpleado,
    eliminarEmpleado
};