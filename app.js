//require
require('./config/config');
const express = require('express');
const colors = require('colors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


//Inicializar variables
var app = express();

// parse application/x-www-form-urlencoded (body parser)
app.use(bodyParser.urlencoded({ extended: false }));


//Importando rutas
const appRoutes = require('./routes/app');
const usuarioRoutes = require('./routes/usuario');
const loginRoutes = require('./routes/login');

//Modelos
const usuario = require('./models/usuario');


//conexión a BD
mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}, (err, resp) => {
    if (err) throw err;
    console.log('Base de datos', 'ONLINE'.green);
});



//Rutas
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);



//escuchar peticiiones
app.listen(3000, () => {
    console.log('Escuchando puerto:', (process.env.PORT).red, 'online'.green);
});