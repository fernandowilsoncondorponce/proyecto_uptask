const express = require('express');
const routes = require('./routes') //usamos los router
const path = require('path') // lo usaremos para las vistas, es una libreria que ya existe en node
// path : lee los filesystem es decir los archivos que existen en tus carpetas
const flash = require('connect-flash')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
const passport = require('./config/passport')
// importar las variables
require('dotenv').config({ path: 'variables.env' });


// const expressValidator = require('express-validator');

// helpers con algunas funciones
const helpers = require('./helpers') //se agrega el ./ para decir que son arcchivos internos y no un paquete


//Crear la conexion a la BD
const db = require('./config/db') // lo trae para usarlo aqui

// importamos el modelo para que cree la estructura
require('./models/Proyectos') 
require('./models/Tareas')
require('./models/Usuarios')

//sync : lo usamos para crear la tabla proyectos

db.sync() // regresara un promesa
    .then(() => console.log('Conextado al servidor') ) // va a ejecutar un arrow f
    .catch(error => console.log(error)  )


// crear una app de express
const app = express();

// Donde cargar los archivos estaticos
app.use(express.static('public')); //para que pueda utilizar el css en el pug

// Habilitar Pug
app.set('view engine', 'pug');


//  Habilitar bodyParser para leer datos del formulario
app.use(bodyParser.urlencoded({extended:true})); 


// Agregamos express validator a toda la aplicacion



// Añadir la carpeta de las vistas
app.set('views', path.join(__dirname, './views')) //para que controller pueda usar los pug
// join es una funcion
// dirname : nos retorna el directorio principal es donde esta este index.js 


// Agregar flash messager
app.use(flash())

app.use(cookieParser());


// sessiones nos permite navegar entre distintas paginas sin volvernos a autenticar
app.use(session({
    secret : 'supersecreto', //ayuda a firmar el cookie
    resave: false, //mantiene la session viva
    saveUninitialized : false //mantiene la session viva
}));

app.use(passport.initialize()); //arrancara la instancia de passport
app.use(passport.session()) // para que el usuario se mueva entre las paginas

// Pasar var dump a la aplicacion 
//Middleware:  cuando tiene un next()
app.use((req, res, next) => {
    //console.log(req.user) // podremos ver el usuario ingresado
    // quiero que las funciones del vardump sea disponible en cualquier parte de mi aplicacion
    res.locals.vardump = helpers.vardump;  // res.local  : crear variables y consumirlo en cualquier lugar
    // NOTA : locals.mensajes , la palabra mensajes se uso en usuariosController para que luego se utilize en crearCuenta.pug
    res.locals.mensajes = req.flash() // utilizar la libreria flash para los mensajes de error   ESCUCHA TODOS LOS ERROES QUE PUEDAN PASAR
    // el sprite operator crea una copia y si no existe sera null
    res.locals.usuario = {...req.user} || null 

    next(); // se va al siguiete midelware que son los que tienen use()
});




app.use('/', routes()); // el entre parentesis es porque es funcion en el archivo de rutas
// NOTA : va a tomar las rutas definidas en routes()

// app.listen(3000);

// Servidor y Puerto
const host = process.env.HOST || '0.0.0.0' //estos ceros heroku se encarga de ofrecerle una url al servidor
const port = process.env.PORT || 3000;
app.listen(port, host, () => {
    console.log('El servidor esta funcionando')
})

require('./handlers/email')