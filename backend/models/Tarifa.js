const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Tarifa = sequelize.define('Tarifa', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tarifaAgua: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.02
    },
    tarifaElectricidad: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 1.10
    },
    fechaActualizacion: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: '01/09/2026'
    }
    }, {
    tableName: 'Tarifas',
    timestamps: true
    });
module.exports = Tarifa;