//require
const express = require('express');
const colors = require('colors');
const { json } = require('express');

const mongoose = require('mongoose');

//conexión a BD
mongoose.connect('mongodb://localhost:27017/hospitalDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}, (err, resp) => {
    if (err) throw err;
    console.log('Base de datos', 'ONLINE'.green);
});


//Inicializar variables
var app = express();


//Rutas
app.get('/', (req, res, next) => {

    return res.status(200).json({
        ok: true,
        message: 'Hola mundo'
    });

});


//escuchar peticiiones
app.listen(3000, () => {
    console.log('Escuchando puerto: 3000', 'online'.green);
});