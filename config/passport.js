const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy

// ESTO PASA ANTES DEL POST pasa por el indexprincipal y luego aqui y luego authController


//Referencia al Modelo donde vamos a autenticar
const Usuarios = require('../models/Usuarios')

//local strategy - Login con credenciales propios (usuario y password)
passport.use(
    new LocalStrategy(
        // por default passport espera un usurio y password
        {
            usernameField : 'email', //email y password deben se igual como lo tienes en models
            passwordField : 'password'
        },
        // Hace la consulta luego de obtener
        async (email, password, done) => { // para saber si existe o no , "done" es aque que finaliza la ejecucion
            try {
            // usuario es el usuario encontrado solo un registro del usuario encontrado
                const usuario = await Usuarios.findOne({  // buscara en la tabla en caso de que lo encuentre  lo guardara en usuario
                    where : {
                        email,
                        activo : 1 //para saber si se confirmo con su correo
                    }
                });
                // El usuario existe , password incorrecto
                if(!usuario.verificarPassword(password)){ //verificarPassword es una funcion en Usuarios.js
                    return done(null,false , { //tres parametros null - elerror , false - el usuario  , y el mensaje personalizado
                        message : 'Password Incorrecto'
                    }) 
                }
                // El email existe, y el password correcto
                return done(null,usuario)  // este usuario es el objeto
                    
            } catch  (error) {
                //El usuario no existe
                return done(null,false , { //tres parametros null - elerror , false - el usuario  , y el mensaje personalizado
                    message : 'Esa cuenta no existe'
                }) 
            }
        }
    )

)

// TODO ayudaran a LEER o ACCEDER A LOS VALORES del objeto usuario que fue creado en el return done(null, usuario)


// serializar el usuario : ponerlo junto otravez como objeto
passport.serializeUser((usuario, callback) => {
    callback(null, usuario);//toma dos parametros el error y el id

});


// Deserializar el usuario : si es un objeto accedera a sus valores internos
passport.deserializeUser((usuario, callback) => {
    callback(null, usuario)
});

// exportar 
module.exports = passport; //se exporta en el index principal 