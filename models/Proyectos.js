const Sequelize = require('sequelize')
const slug = require('slug'); // solo agrega una linea para simular enlaces 
const shortid = require('shortid') // para que agrege un id a la url y que sean diferentes todos
const db = require('../config/db')



const Proyectos = db.define('proyectos', {
    // aqui tenemos la descripcion de las tablas de las bases de datos
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: Sequelize.STRING(100),
    url : Sequelize.STRING(100)
    // cuando solamente le pasa una puedes eliminar las llaves y el type

},{
    hooks : { //estos hooks corren una funcion en determinado tiempo
        // este hook que se ejecutara anter de insertar a la base de datos - sequelize pagina : Hooks(order of Operations)
        // TODO solo se ejecuta cuando se realiza un create
        beforeCreate(proyecto){  //cuando se realiza un create en el controlador aqui toma un objeto - aqui estara el nombre y la url vacia
            const url = slug(proyecto.nombre).toLowerCase();
            proyecto.url = `${url}-${shortid.generate()}`; // y aqui para que url tenga el valor creado
        }
        // no ingresamos beforeUpdate : porque como el que quiere vender una casa y despues le cambia el nombre  y ya puso anuncios por todos lados esos anuncios ya no servirian 
    }
}
);

module.exports = Proyectos //para lo que tengamos aqui en proyectos lo podamos importar en otras piesas de nuestros proyectos
// por ejemplo estaremos usando este modelo por ejemplo en el index principal y tambien en los controladores para hacer las consultas a las bases de datos  y 
// pasar los resultados hacia las vistas
