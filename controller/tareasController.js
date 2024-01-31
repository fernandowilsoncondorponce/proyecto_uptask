const Proyectos = require('../models/Proyectos')
const Tareas = require('../models/Tareas')


exports.agregarTarea = async (req, res, next) => {
    //console.log(req.params.URL)  // nos mostrara la url

    // Obtenemos el Proyecto actual
    const proyecto = await Proyectos.findOne({ // para traes solo 1 solo el primer resultado SELECT * FROM proyectos WHERE id 20 LIMIT 1
        where : {url : req.params.URL}
    })
    // console.log(proyecto);
    // console.log(req.body); // para saber que nos esta trayendo correctamente la tarea que ingresamos en el form

    //leer el valor del input 
    const {tarea} = req.body; // usar solo el .body en input

    // estado 0 = incompleto y ID de Proyecto
    const estado = 0;  
    const proyectoId = proyecto.id

    // Insertar en la base de datos
    const resultado = await Tareas.create({tarea , estado, proyectoId}) // como el orden en la tabla

    if(!resultado){
        return next()
    }

    // redireccionar 
    res.redirect(`/proyectos/${req.params.URL}`) // redireccionamos al usuario a la misma url
}   

exports.cambiarEstadoTarea = async (req, res) => {
    console.log(req.params) //podremos ver la informacion que nos envia por consola,  nota:query  no funciona
    const{id} = req.params
    const tarea = await Tareas.findOne({
        where : {id}
    }) 
    // console.log(tarea)

    //*  cambiar el estado
    let estado = 0
    if(tarea.estado === estado) { // 1 === 0  : falso
        estado = 1
    }
    tarea.estado = estado;
    
    const resultado = await tarea.save();

    if(!resultado) return next();

    res.status(200).send('Actualizado')  //TODO Nota : tu puedes cambiar el status a 404 etc


}

exports.eliminarTarea = async (req, res) => {
    // TODO params : te envia el id que se encuentra del router , nos trae puero id para destruccion
    // TODO query : si te imprime lo que pases por params
    //console.log(req.params) // siempre usar query o params cuando pasamos con axios params mirar consola  esta nuestro id, aparecera el id de la tarea

    const {id} = req.params

    // Eliminar la tarea
    const resultado = await Tareas.destroy({where: {id}}) // cuando la llave y el valor son iguales solo le pasas uno

    if(!resultado) return next()

    res.status(200).send('Tarea Eliminada Correctamente')
}

