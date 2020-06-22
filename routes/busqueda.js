const express = require('express');

const app = express();

let Hospital = require('../models/hospital');
let Medico = require('../models/medico');
let Usuario = require('../models/usuario');


//===================================================
// búsqueda de colecciones (todas)
//===================================================
app.get('/todo/:busqueda', (req, res, next) => {

    let busqueda = req.params.busqueda;
    let regex = new RegExp(busqueda, 'i');

    Promise.all([
            buscarHospitales(busqueda, regex),
            buscarMedicos(busqueda, regex),
            buscarUsuarios(busqueda, regex)
        ])
        .then(respuestas => {

            return res.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            });

        });

});

//===================================================
// búsqueda (por colección)
//===================================================
app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    let tabla = req.params.tabla;

    let busqueda = req.params.busqueda;
    let regex = new RegExp(busqueda, 'i');

    let promesa;

    switch (tabla) {
        case 'hospitales':
            promesa = buscarHospitales(busqueda, regex);

            break;
        case 'medicos':
            promesa = buscarMedicos(busqueda, regex);

            break;
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);

            break;
        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de búsqueda solo son: usuarios, medicos y hospitales',
                errors: {
                    message: 'Debe de especificar una tabla válida'
                }
            });
    }

    promesa.then(data => {

        res.status(200).json({
            ok: true,
            [tabla]: data
        });

    });

});


//===================================================
// Busqueda de hospitales
//===================================================
function buscarHospitales(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Hospital.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec((err, hospitales) => {

                if (err) {
                    reject('Error al cargar hospitales', err);
                } else {
                    resolve(hospitales);
                }

            });

    });

}

//===================================================
// Busqueda de medicos
//===================================================
function buscarMedicos(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Medico.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec((err, medicos) => {

                if (err) {
                    reject('Error al cargar médicos', err);
                } else {
                    resolve(medicos);
                }

            });

    });

}


//===================================================
// Busqueda de usuarios
//===================================================
function buscarUsuarios(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Usuario.find()
            .or([{ nombre: regex }, { email: regex }])
            .exec((err, usuarios) => {

                if (err) {
                    reject('Error al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }

            });

    });

}

module.exports = app;