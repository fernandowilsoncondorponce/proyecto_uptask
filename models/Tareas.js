const Sequelize = require('sequelize');
const db = require('../config/db')
const Proyectos = require('./Proyectos')

const Tareas = db.define('tareas' , {
    id: {
        type : Sequelize.INTEGER(11),
        primaryKey : true,
        autoIncrement : true
    },
    tarea: Sequelize.STRING(100),
    estado: Sequelize.INTEGER(1)
})
// TODO creamos la llave foranea
Tareas.belongsTo(Proyectos) //cada ves que creo una tarea caada tarea pertenece a un proyecto
//Proyectos.hasMany(Tareas) // esto seria al reves(un proyecto puede tener muchas tareas) ambos estarian bien pero esto deberia estar en Projectos.js

module.exports = Tareas