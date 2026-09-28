const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HistorialEvento = sequelize.define('HistorialEvento', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fecha: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    codigoMaquina: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    evento: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    detalle: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    litrosConsumidos: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    kwhConsumidos: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    }
    }, {
    tableName: 'HistorialEventos',
    timestamps: true
    });

module.exports = HistorialEvento;