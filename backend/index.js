require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const maquinaRoutes = require('./routes/maquinaRoutes');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', maquinaRoutes);

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
    console.log('Servidor EcoWash ejecutándose en http://localhost:8080');
});