const express = require('express'); // para usar todas las funciones de expres
const router = express.Router(); // Router es uno de los metodos de express

// importar express validator
const {body} = require('express-validator') //una ventaja de usar el validator puedes elejir : body, cookies , params, header,
// check es una funcion donde estan todos los metodos para revisar lo que queremos hacer


// * importar el controlador
const proyectosController = require('../controller/proyetosController');
const tareasController = require('../controller/tareasController')
const usuariosController = require('../controller/usuariosController')
const authController = require('../controller/authController')

// para hacerlo disponible en el archivo principal index.js
module.exports = function(){ //esta funcion
    
    // Rutas para el home
    router.get('/', 
        authController.usuarioAutenticado,
        proyectosController.proyectosHome 
    );
    router.get('/nuevo-proyecto', 
        authController.usuarioAutenticado,
        proyectosController.formularioProyecto 
    )
    router.post('/nuevo-proyecto', 
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(), 
        proyectosController.nuevoProyecto
    );

    // TODO listar Proyecto , siempre que exista un enlace nuevo hacer routing
    //  la idea de hacer esto que envace a la url haremos la consulta al campo de la bd y se traera el registro completo basado en la url
    // nota el :url (no sabemos cual va a visitar el usuario tu puedes nombrarlo como desees, ayuda a usar la informacion de este en controler)
    router.get('/proyectos/:URL', 
        authController.usuarioAutenticado,
        proyectosController.proyectoPorUrl
    )

    // TODO Actualizar el Proyecto
    router.get('/proyecto/editar/:ID', 
        authController.usuarioAutenticado,
        proyectosController.formularioEditar
    )
    
    router.post('/nuevo-proyecto/:ID', 
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(), 
        proyectosController.actualizarProyecto
    );

    // Eliminar Proyecto
    router.delete('/proyectos/:URL',
        authController.usuarioAutenticado,
        proyectosController.eliminarProyecto
    );

    // tareas
    router.post('/proyectos/:URL',
        authController.usuarioAutenticado,
        tareasController.agregarTarea
    )

    // Actualizar Tareas //path cambia solo una parte y up date cambia todo el registro
    router.patch('/tareas/:id', 
        authController.usuarioAutenticado,
        tareasController.cambiarEstadoTarea
    )

    // Eliminar Tareas
    router.delete('/tareas/:id', 
        authController.usuarioAutenticado,
        tareasController.eliminarTarea
    )

    // Crear nueva cuenta
    router.get('/crear-cuenta', usuariosController.formCrearCuenta)
    router.post('/crear-cuenta', usuariosController.crearCuenta)
    router.get('/confirmar/:correo', usuariosController.confirmarCuenta)

    // Iniciar session
    router.get('/iniciar-sesion', usuariosController.formIniciarSession)
    router.post('/iniciar-sesion', authController.autenticarUsuario)

    // cerrar session
    router.get('/cerrar-sesion', authController.cerrarSesion)

    // reestablecer contraseña
    router.get('/reestablecer', usuariosController.formRestablecerPassword)
    router.post('/reestablecer',authController.enviarToken)
    router.get('/reestablecer/:token', authController.validarToken)
    router.post('/reestablecer/:token', authController.actualizarPassword)
    return router; //para hacerlo disponible en el otro archivo
}
// tiene que usarse la validacion antes del controlador
//que nombre no tenga todas estas funciones buscar en ckeck API
        // trim() : elimine espacion en blanco, isEmpty : vacio, escape : caracteres