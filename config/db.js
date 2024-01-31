const { Sequelize } = require('sequelize');
// importar las variables
require('dotenv').config({ path: 'variables.env' });

const dbHost = process.env.BD_HOST;
const dbUser = process.env.DB_USERNAME;
const dbName = process.env.DB_NOMBRE;
const dbPassword = process.env.DB_PASS;
const dbPort = process.env.BD_PORT;
//"escribir todo"

console.log(dbPassword)

const db = new Sequelize(`${dbName}`, `${dbUser}`, `${dbPassword}`, {
    host: `${dbHost}`,
    dialect:  'mysql',
    port: `${dbPort}`,
    operatorsAliases:false,    
    define : {
        timestamps:false // Si no necesitas las columnas createdAt y updatedAt en tus modelos
    },
    pool: {
        max : 5,
        min : 0,
        acquire : 30000,
        idle : 10000
    }
    
});

module.exports = db;