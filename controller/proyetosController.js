// el controlador se contacta con el modelo, toda la interaccion con la base de datoss es por medio del modelo
const Proyectos = require('../models/Proyectos')
const Tareas = require('../models/Tareas')


// * toda consulta a base de datos usar ASYNC
exports.proyectosHome = async (req, res) => { //por medio de get mostrara
    // console.log(res.locals.usuario)

    const usuarioId = res.locals.usuario.id
    // proyectos es el modelo
    const proyectos = await Proyectos.findAll({where : {usuarioId}}); // findAll es como realizar un select * from proyectos



    res.render('index',{ // ? podremos enviarle informacion
        nombrePagina : 'Proyectos ',
        proyectos //pasar los resultados de la consulta hacia la vista
    }); // render si va a imprimir html y el nombre del pug
    // es como si estuviera en el index.js principal y al escribir index , como se trajo toda los archivos de la carpeta view lo puede usar todo
}

exports.formularioProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id
    // proyectos es el modelo
    const proyectos = await Proyectos.findAll({where : {usuarioId}});  // se iterara

    res.render('nuevoProyecto', {
        nombrePagina: 'Nuevo Proyecto',
        proyectos
    })
}

exports.nuevoProyecto =  async (req, res) => {

    const usuarioId = res.locals.usuario.id
    // proyectos es el modelo
    const proyectos = await Proyectos.findAll({where : {usuarioId}});  // se iterara


    //console.log(req.body) // ver lo que el usuario escribe en consola
    // req = (request es la peticion que tu haces y .body = es una libreria que usa de el index principal para leer lo que se escribe )
    // NOTA: el "name" del input y lo escrito apareceran en consola
    // res.send('Enviaste el Formulario') //al dar click al submit se mostrara

    // *  validar que tengamos algo en el input (aplicamos destruction)
    const {nombre} = req.body;

    let errores = []

    // en caso de que este vacio
    if(!nombre) {
        errores.push({'texto' : 'Agrega un Nombre al Proyecto'})
    }

    // si hay errores
    if(errores.length > 0) {
        res.render('nuevoProyecto', { // con render envio info 
            nombrePagina : 'Nuevo Proyecto',
            errores, // la variable debe ser igual --
            proyectos // TODO importante pasar a los errores en caso de que tengamos un error los enlaces de proyectos deben verse
        })
    } else { 
        // que pasa si no hay errores
        //Insertar en la Base de Datos
        //const url = slug(nombre).toLowerCase() //al ser un frameword de js puedes pasar  cualquier funcion de JS
        // aqui se puede mostrar que se pueden agregar mas datos antes de ingresarlo a la base de datos
        // No Hay Errores
        // Insertar en la BD
        const usuarioId = res.locals.usuario.id
        await Proyectos.create({ nombre , usuarioId}) //toma parametros lo que vas a insertar en la bd
        res.redirect('/')  // una ves que se ejecuto me lleve al home



        // secualize es un orm basado en Promises entonces
        //? con promesas 
        // .then(() => console.log('Insertado correctamente'))
        // .catch(error  => console.log(error))
    }
}

exports.proyectoPorUrl = async (req,res, next) => { 
    const usuarioId = res.locals.usuario.id
    // proyectos es el modelo
    const proyectosPromise =  Proyectos.findAll({where : {usuarioId}});  // * se agrega para que el layout pueda iterarlos 

    // res.send(req.params.URL);  --> se muestra la url del enlace de arriba
        
    const proyectoPromise =  Proyectos.findOne({ //aqui solo te traera uno
            where: {
                url: req.params.URL,
                usuarioId
            }
        })
    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise])
    // TODO : si escribes en el enlace muchas letras y le das enter que no sea el enlace en consola aparecera "null"    if (!proyecto) return next(); //detendra la ejecucion y se ira al siguiente midelware pero como no hay mas middelware no seguira y no se ejecutara el codigo siguiente

    // Consultar tareas del Proyecto actual
    
    const tareas = await Tareas.findAll({
        where : {
            proyectoId : proyecto.id
        },
        //* es como el "JOIN" como parte de tareas tambien se va a agregar la informacion del modelo
        // include : [ // lo mejor de orm que se pude incluir el objeto completo podras verlo con el vardump de tareas.pug
        //     {model : Proyectos} // TODO que es nuestro otro modelo (esta en el require) 
        // ]
    })



    // render a la vista 
    res.render('tareas',{
        nombrePagina : 'Tareas del Proyecto',
        proyecto,
        proyectos, //* se lo envia para que lo puedo iterar el loyout
        tareas
    })

}

exports.formularioEditar = async (req, res) => {

    const usuarioId = res.locals.usuario.id
    // proyectos es el modelo
    // findAll y findOne no dependen el primero para el segundo 
    const proyectosPromise = Proyectos.findAll({where : {usuarioId}}); 
    
    const proyectoPromise =  Proyectos.findOne({
        where: {
            id: req.params.ID,
            usuarioId
        }
    })
    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise])

    // render a la vista
    res.render('nuevoProyecto', {
        nombrePagina : 'Editar Proyecto',
        proyectos,
        proyecto
    })

}

exports.actualizarProyecto =  async (req, res) => {
    const usuarioId = res.locals.usuario.id
    // proyectos es el modelo
    const proyectos = await Proyectos.findAll({where : {usuarioId}}); 
    
    const {nombre} = req.body;

    let errores = []

    // en caso de que este vacio
    if(!nombre) {
        errores.push({'texto' : 'Agrega un Nombre al Proyecto'})
    }

    // si hay errores
    if(errores.length > 0) {
        res.render('nuevoProyecto', {
            nombrePagina : 'Nuevo Proyecto',
            errores, 
            proyectos 
        })
    } else { 
    
        await Proyectos.update(
            { nombre : nombre }, // queremos actualizar el nombre con el nombre
            { where: {id: req.params.ID}}
        );
        res.redirect('/')  



    
    }
}

exports.eliminarProyecto = async (req, res , next) => {
    // console.log(req) podremos ver info en consola como peticion al servidor
    // * req: "query" para acceder a urlProyectos  o "params"  lo obtiene gracias al enlace de la url
    const {urlProyecto} = req.query;
    const resultado = await Proyectos.destroy({where: {url : urlProyecto}});

    if(!resultado){ // no hubo un resultado
        return next();
    }

    res.status(200).send('Proyecto Eliminado Correctamente') //aqui envia una send (respuesta)  ayuda para ser leido por el axios
}