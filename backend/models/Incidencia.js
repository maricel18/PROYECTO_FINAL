const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Incidencia = sequelize.define('Incidencia', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    codigoMaquina: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    estado: {
        type: DataTypes.STRING(20),
        defaultValue: 'Abierta'
    },
    fecha: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
    }, {
    tableName: 'Incidencias',
    timestamps: true
    });

module.exports = Incidencia;