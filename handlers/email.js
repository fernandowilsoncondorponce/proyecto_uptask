// se encargara de tener toda la parte de nodemailner

const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice') ;  // para darle estilos
// const  htmlToText = require('html-to-text');
const htmlToText = require('html-to-text')
const util = require('util');
const emailConfig = require ('../config/email'); // se traera las credenciales


// La forma en que node manda los email es por medio de un transport
let transport  = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
      user: emailConfig.user,
      pass: emailConfig.pass,
    },
  });

//   generarHTML
const generarHTML = (archivo, opciones = {}) => { // * NOTA el opciones ahi se encuentra el resetUrl se lo pasa por ese medio
    // importamos el archivo, dirname me trae el directorio actual, y los dos puntos es para volver un nivel atras
    // opciones : este parametro son variables que va a encontrar
        const html = pug.renderFile(`${__dirname}/../views/emails/${archivo}.pug`, opciones);
        return juice(html); //para que le agrege todos los estilos lineales para que pueda ser enviador por email
}

// export para que sea disponible en otros archivos
exports.enviar = async (opciones) => {

    const html = generarHTML(opciones.archivo, opciones)
    const text = htmlToText.convert(html)
    let opcionesEmail = {
        from: 'UpTask <no-reply@uptask.com>', 
        to: opciones.usuario.email , 
        subject: opciones.subject, 
        text , 
        html
      };
    // send email no  soporta await es por eso que importamos util para que soporte async await
    //creamos la funcion enviarEmail y le pasamos el transport : que envia el correo ,  y le tenemos que pasar transport
    const enviarEmail = util.promisify(transport.sendMail,transport)
    // de esta manera sabe donde esta el transport  y las opciones que debe de pasar
    return enviarEmail.call(transport,opcionesEmail) // y va a traer la funcion anterior esto pasa porque se pierde la referencia
    
}

