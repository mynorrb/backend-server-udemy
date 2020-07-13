//require
require('./config/config');
const express = require('express');
const colors = require('colors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');



//Inicializar variables
var app = express();


// parse application/x-www-form-urlencoded (body parser)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

    next();
});


//habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, './public')));

//Importando rutas
const appRoutes = require('./routes/app');
const usuarioRoutes = require('./routes/usuario');
const hospitalRoutes = require('./routes/hospital');
const medicoRoutes = require('./routes/medico');
const busquedaRoutes = require('./routes/busqueda');
const loginRoutes = require('./routes/login');
const uploadRoutes = require('./routes/upload');
const imagenRoutes = require('./routes/imagenes');


//Modelos
const usuario = require('./models/usuario');
const hospital = require('./models/hospital');
const medico = require('./models/medico');


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
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/imagen', imagenRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);



//escuchar peticiiones
app.listen(3000, () => {
    console.log('Escuchando puerto:', (process.env.PORT).red, 'online'.green);
});