//require
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


//configuración de express
const app = express();

//modelo de usuario
const Usuario = require('../models/usuario');


//===================================================
// Login
//===================================================
app.post('/', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al hacer login',
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Usuario o contraseña incorrectos',
                err: {
                    message: '(Usuario) o contraseña incorrectos'
                }
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Usuario o contraseña incorrectos',
                err: {
                    message: 'Usuario o (contraseña) incorrectos'
                }
            });
        }

        //creando el token
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        //respueta correcta
        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token
        });


    });


});


//export
module.exports = app;