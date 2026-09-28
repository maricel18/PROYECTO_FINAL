require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const sequelize = require('./config/database');

const maquinaRoutes = require('./routes/maquinaRoutes');
const empleadoRoutes = require('./routes/empleadoRoutes');
const tarifaRoutes = require('./routes/tarifaRoutes');
const consumoRoutes = require('./routes/consumoRoutes');
const incidenciaRoutes = require('./routes/incidenciaRoutes');
const reporteRoutes = require('./routes/reporteRoutes');
const app = express();

app.use(helmet());

const limitadorGeneral = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    standardHeaders: true,
    legacyHeaders: false,
    message: { mensaje: 'Demasiadas solicitudes desde esta IP, intente más tarde.' }
});
app.use(limitadorGeneral);

const limitadorLogin = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 15,
    message: { mensaje: 'Demasiados intentos fallidos. Espere 5 minutos antes de volver a intentar.' }
});
app.use('/api/empleados/login', limitadorLogin);

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json({ limit: '10kb' }));

// Rutas de la API
app.use('/api', maquinaRoutes);
app.use('/api/empleados', empleadoRoutes);
app.use('/api/tarifas', tarifaRoutes);
app.use('/api/consumos', consumoRoutes);
app.use('/api/incidencias', incidenciaRoutes);
app.use('/api/reportes', reporteRoutes);

app.use((req, res) => {
    res.status(404).json({ mensaje: 'Recurso no encontrado' });
});

app.use((err, req, res, next) => {
    console.error('Error capturado por middleware:', err.message);
    res.status(500).json({ mensaje: 'Error interno controlado en el servidor' });
});

process.on('uncaughtException', (err) => {
    console.error('Excepción no capturada evitada:', err.message);
});

process.on('unhandledRejection', (reason) => {
    console.error('Promesa rechazada no capturada evitada:', reason);
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Conexión a SQL Server establecida correctamente.');
        return sequelize.sync();
    })
    .then(() => {
        console.log('Base de datos sincronizada correctamente.');
    })
    .catch((error) => {
        console.error('Error al conectar o sincronizar la base de datos:', error);
    });

app.listen(8080, () => {
    console.log('Servidor EcoWash seguro ejecutándose en http://localhost:8080');
});