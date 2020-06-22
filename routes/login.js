//require
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);



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


//Configuraciones de google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });

    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}
//verify().catch(console.error);


//===================================================
// Login google
//===================================================
app.post('/google', async(req, res) => {

    let token = req.body.token;

    let googleUser = await verify(token)
        .catch(e => {
            res.status(403).json({
                ok: false,
                mensaje: 'Token no válido',
                errors: e
            });
        });

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (usuarioDB) {
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Debe de usar su autenticación normal',
                    errors: {
                        message: 'Debe de usar su autenticación normal'
                    }
                });

            } else {
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });


                return res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token,
                    id: usuarioDB._id
                });

            }
        } else {
            //si el usuario no existe en nuestra BD
            let usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al grabar usuario',
                        errors: err
                    });
                }

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });


                return res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token,
                    id: usuarioDB._id
                });

            });

        }

    });

});


//export
module.exports = app;