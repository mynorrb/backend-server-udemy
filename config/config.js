//==============
// Puerto
//==============
process.env.PORT = process.env.PORT || 3000;

//==============
// Entorno
//==============
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//==============
// Base de Datos
//==============
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/hospitalDB';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//==============
// Vencimiento del token
//==============
//60 segundos
//60 minutos
//24 horas
//30 días

process.env.CADUCIDAD_TOKEN = '48h';

//==============
// SEED de autenticación
//==============

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';


//==============
// Google client id
//==============

process.env.CLIENT_ID = process.env.CLIENT_ID || '72919168886-tngaf4tg8gcr52u3ri3680tl34oqhbfj.apps.googleusercontent.com';