const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // Importera sequelize-instansen

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = User; // Exportera User-modellen