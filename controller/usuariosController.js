const Usuarios = require('../models/Usuarios')
const enviarEmail = require('../handlers/email') //Nos traemos para usar su funcion

exports.formCrearCuenta = (req, res) => {
    res.render('crearCuenta' , {
        nombrePagina : 'Crear Cuenta en Uptask'
    })
}
exports.formIniciarSession = (req, res) => {
    // console.log(res.locals.mensajes)
    const {error} = res.locals.mensajes
    res.render('iniciarSession' , {
        nombrePagina : 'Iniciar Session en Uptask',
        error 
    })
}
exports.crearCuenta = async(req, res) => {
    // leer los datos
    // console.log(req.body) 
    const {email,password} = req.body

    // Manejamos el error y que no se caige el sistema 
    try {
        // crear el usuario
        await Usuarios.create({   
                email,
                password
            });
        
        // TODO AL crear tu cuenta se realizara esto ESTO AYUDA PARA SABER SI EL CORREO EXISTE O NO


        // Crear una URL de confirmar
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`
        
        // Crear el objeto de usuario
        const usuario = {
            email 
        }
        //enviar email
        await enviarEmail.enviar({
            usuario, 
            subject: 'Confirma tu cuenta Uptask',
            confirmarUrl,
            archivo : 'confirmar-cuenta' 
        })
        // redirigir al usuario
        req.flash('correcto', 'Enviamos un correo, confirma tu cuenta')
        res.redirect('/iniciar-sesion');

    
    } catch (error) {
        // map agrupa todos errores y los pasa a 'error' y enviamos el mensaje como parte del flash
        req.flash('error', error.errors.map(error => error.message)) 
        res.render('crearCuenta' , {
            mensajes : req.flash(), 
            nombrePagina : 'Crear Cuenta en Uptask',
            email,
            password
            
        })

    } 
    // quitamos la promesa .then() 
    
}

exports.formRestablecerPassword = (req, res) => {
    res.render('reestablecer',{
        nombrePagina: 'Restablecer tu Contraseña'
    })
}


// Cambia el estado de una cuenta
exports.confirmarCuenta = async(req,res) => {
    // res.json(req.params.correo);
    const usuario = await Usuarios.findOne({
        where : {
            email : req.params.correo
        }
    })

    // si no existe el usuario
    if(!usuario){
        req.flash('error', 'No valido') //mostrara un mensaje si el url esta mal
        res.redirect('/crear-cuenta')
    }
    usuario.activo = 1
    await usuario.save()  // sin necesida de un update

    req.flash('correcto', 'Cuenta activada correctamente')
    res.redirect('/iniciar-sesion')
}