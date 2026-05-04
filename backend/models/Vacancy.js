const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Vacancy = sequelize.define('Vacancy', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    company: {
        type: DataTypes.STRING,
        allowNull: false
    },
    salary: {
        type: DataTypes.STRING
    },
    img: {
        type: DataTypes.STRING
    },
    phone: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    }
});

module.exports = Vacancy;
