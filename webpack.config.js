const path = require('path') // nos ayudara  a acceder al file system es decir a todos los archivos que tenemos localmente
const webpack = require('webpack');

module.exports = {
    entry : './public/js/app.js', //aqui se define el archivo de entrada que usara webpack
    output : { //la salida
        filename : 'bundle.js', 
        // dirname : directorio actual en el que estemos
        // y queremos que lo cree en /public/dist
        path: path.join(__dirname, './public/dist' )
    }, 
    module: { // webpack tiene modulos instalador pero tambien se pueden instalar como en nuestro caso instalamos babel
        rules:[
            {
                // nos indica que archivo va a utilizar , en este caso todos los archivos que sean js de la carpeta public
                test : /\.m?js$/,
                use : {
                    // que pluying de babel quieres usar 
                    loader: 'babel-loader',
                    options: { // y aqui las opciones
                        presets: ['@babel/preset-env']
                    }
                }

            }
        ]
    }
}