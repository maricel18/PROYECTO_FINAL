const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Consumo = sequelize.define('Consumo', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    codigoMaquina: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    recurso: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    teorico: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    real: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    diferencia: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    semaforo: {
        type: DataTypes.STRING(20),
        allowNull: false
    }
    }, {
    tableName: 'Consumos',
    timestamps: true
    });

module.exports = Consumo;