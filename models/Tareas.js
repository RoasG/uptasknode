const Sequelize = require('sequelize');
const db = require('../config/database');

const Proyectos = require('./Proyectos');

const Tareas = db.define('tareas', {
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: Sequelize.STRING(50)
    },
    estado: {
        type: Sequelize.INTEGER(1)
    }
});

Tareas.belongsTo(Proyectos);

module.exports = Tareas;