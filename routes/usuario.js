//require
const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

//configuración de express
const app = express();

//modelo de usuario
const Usuario = require('../models/usuario');

//middlewares
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

//===================================================
// Obtener todos los usuarios
//===================================================
app.get('/', verificaToken, (req, res, next) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email img role')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando usuario',
                    errors: err
                });
            }

            Usuario.countDocuments({ estado: true }, (err, conteo) => {
                return res.status(200).json({
                    ok: true,
                    usuarios,
                    total: conteo
                });
            });

        });

});


//===================================================
// Crear un nuevo usuario
//===================================================
app.post('/', [verificaToken, verificaAdmin_Role], (req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear el usuario',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioDB
        });
    });

});


//===================================================
// Actualizar usuario
//===================================================
app.put('/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);


    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al actualizar el usuario',
                errors: err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con ese ID',
                errors: {
                    message: 'No existe un usuario con ese ID'
                }
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioDB
        });

    });

});


//===================================================
// Eliminar usuario por id
//===================================================
app.delete('/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    }

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al borrar el usuario',
                errors: err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con ese ID',
                errors: {
                    message: 'No existe un usuario con ese ID'
                }
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });

    });

});

//export
module.exports = app;