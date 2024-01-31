const Sequelize = require('sequelize')
const db = require('../config/db')
const Proyectos = require('./Proyectos') // los usuarios pueden crear proyectos
const bcrypt = require('bcrypt-nodejs')


const Usuarios = db.define('usuarios' , {
    id:{
        type : Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true

    },
    email:{
        type: Sequelize.STRING(60),
        allowNull : false, // no puede ir vacio
        validate: { // usamos las validaciones de sequealize
            isEmail : { //para acceptar solo emails
                msg : 'Agrega un Correo Valido'
            },
            notEmpty : {
                msg : 'El e-mail no puede ir vacio'
            }
        },
        unique : { // que no se repita el email
            args: true,
            msg : 'Usuario Ya Registrado'
        }
    },
    password:{
        type: Sequelize.STRING(60), // la contraseña sera encryptado con 60 caracteres por bcrypt
        allowNull: false,
        validate : {
            notEmpty : {
                msg : 'El password no puede ir vacio'
            }
        }
    },
    activo : { //para saber si ya recupero su cuenta y no 
        type: Sequelize.INTEGER,
        defaultValue : 0

    },
    token : Sequelize.STRING,
    expiracion : Sequelize.DATE

}, 
{
    hooks:{
        beforeCreate(usuario){ //obtiene el objeto del form
            usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10))
        }
    }
}

)
// Metodos personalizados : todos los objetos se creen de este Usuarios podran usar la funcion verf..
Usuarios.prototype.verificarPassword = function (password) {
    return bcrypt.compareSync(password, this.password); //compara y regresa un true y false , nota el this.password es el de la base de datos
}

Usuarios.hasMany(Proyectos) // hasMany porque pueden crear mas de uno
module.exports = Usuarios;