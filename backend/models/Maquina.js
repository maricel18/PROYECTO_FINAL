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
        type: DataTypes.STRING(30),
        allowNull: false 
    },
    capacidadKg: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    estado: {
        type: DataTypes.STRING(20),
        defaultValue: 'Disponible' 
    },
    tiempoRestanteMin: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
    }, 
    {
    tableName: 'Maquinas',
    timestamps: true
});
module.exports = Maquina;