const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Maquina = sequelize.define('Maquina', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    codigo: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true
    },
    tipo: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    marca: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    modelo: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    capacidadKg: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    litrosAgua: {
        type: DataTypes.FLOAT,
        defaultValue: 45
    },
    consumoKwh: {
        type: DataTypes.FLOAT,
        defaultValue: 1.2
    },
    estado: {
        type: DataTypes.STRING(30),
        defaultValue: 'Disponible'
    }
    }, {
    tableName: 'Maquinas',
    timestamps: true
});
module.exports = Maquina;