const passport = require('passport')
const Usuarios = require('../models/Usuarios') // importamos para realizar la consulta
const { Sequelize } = require('sequelize')
const Op = Sequelize.Op
const crypto = require('crypto') //nos gerera el token
const bcrypt = require('bcrypt-nodejs') //hashea los password
const enviarEmail = require('../handlers/email')



// usamos el metodo.autenticate y podre usar funciones de autenticate
exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/', //cuando el usuario se autentique correctamente donde ira en este caso pagina principal
    failureRedirect: '/iniciar-sesion', //si hay un error ira a .. quiere decir que no se movera de ahi
    failureFlash : true,
    badRequestMessage : 'Ambos Campos son Obligatorios'
})

// Funcion para revisarsi el usuario esta logueado o no
exports.usuarioAutenticado = (req, res, next) => {

    // si el usuario esta autenticado , adelante
    if(req.isAuthenticated()){ //verifica que este autenticado y es por el session ayuda que despues de la autneticacion cada pagina este seguro
        return next() //pasa al siguiente midelware en el router 
    }
    // si no esta autenticado, redirigir al formulario
    return res.redirect('/iniciar-sesion')

}

//Funcion para cerrar session 
exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/'); //al cerrar session nos lleva al login
    })
}

// genera un tocken si el usuario es valido
exports.enviarToken = async (req, res) => {
    // verificar que el usuario existe
    const {email} = req.body
    const usuario = await Usuarios.findOne({where: {email}})

    // Si no existe el usuario
    if(!usuario){
        req.flash('error' , 'No existe esa cuenta') // se crea el error
        res.redirect('/reestablecer')
        // res.render('reestablecer', {
        //     nombrePagina: 'Restablecer tu Contraseña',
        //     mensajes : req.flash()
        // })
    }

    // Usuario Existe y usamos el objeto usuario para injectar informacion
    usuario.token = crypto.randomBytes(20).toString('hex') //crea un token de 20 caracteres
    usuario.expiracion = Date.now() + 3600000; // por una hora
    
    // Guardarlos en la base de datos , y usamos save y no update,ni select etc , porque arriba ya tengo el objeto identificado
     await usuario.save(); //con esto lo almacenamos a la base de datos

    // url de reset
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`

    // Enciar el Correo con el Token
    await enviarEmail.enviar({
        // lo mando como un objeto porque lo voy a enviar con muchas cosas
        usuario, // para que tenga toda su informacion eso quiere decir su correo
        subject: 'Password Reset',
        resetUrl,
        archivo : 'reestablecer-password' // debe ser igual al nombre del archivo pug
    })
    // Para que no se quede cargando porque despues de arriba se realize espera algo
    req.flash('correcto' , 'Se envio un mensaje a tu correo')
    res.redirect('/iniciar-sesion')
}

exports.validarToken = async(req, res ) => {
        // res.json(req.params.token);
        const usuario = await Usuarios.findOne({
            where : {
                token : req.params.token
            }
        });

        // si no encuentra el usuario
        if(!usuario){
            req.flash('error', 'No Valido')
            res.redirect('/reestablecer')
        }
        // Formulario para generar
        res.render('resetPassword', {
            nombrePagina : 'Reestablecer Contraseña'
        })
        // console.log(usuario)
}

// cambia el password por uno nuevo
exports.actualizarPassword = async (req, res) => {
    // console.log(req.params.token)
    // Verifica el token valido pero tambien la fecha de expiracion
    const usuario = await Usuarios.findOne({
        where: {
            token : req.params.token,
            expiracion: {
                [Op.gte] : Date.now() //gte es mayor o igual  , Nota ver operadores en siquelize
            }
        }
    })
    // Verificamos si el usuario existe
    if(!usuario) {
        req.flash('error', 'No Valido');
        res.redirect('/reestablecer')
    }

    // Hashear el nuevo password , recordar que password es el del name de el resetPassword
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))

    // utilizamos usuario porque arriba estoy retornando una instancia de ese usuario
    usuario.token = null; //para que el token desaparesca de la base de datos porque ya se uso y sea otra vez NULL
    usuario.expiracion = null; 

    // Guardamos el nuevo password , guardamos los cambios
    await usuario.save(); 

    // y para que ya se puedan logear en el sistema 
    // flash() lo podemos usar en todo el sistema porque esta en el index principal como global
    req.flash('correcto', 'Tu password se ha modificado correctamente') // enviamos este mensaje donde debe estar en iniciar-session.pug
    res.redirect('/iniciar-sesion')
}