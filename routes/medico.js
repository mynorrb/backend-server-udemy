//require
const express = require('express');

//configuración de express
const app = express();

//modelo de médico
const Medico = require('../models/medico');

//middlewares
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

//===================================================
// Obtener todos los médicos
//===================================================
app.get('/', (req, res, next) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Medico.find({})
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('hospital', 'nombre')
        .exec((err, medicoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando médicos',
                    errors: err
                });
            }

            Medico.countDocuments({}, (err, conteo) => {
                return res.status(200).json({
                    ok: true,
                    medicoDB,
                    total: conteo
                });
            });

        });

});


//===================================================
// Crear un nuevo médico
//===================================================
app.post('/', verificaToken, (req, res) => {

    let body = req.body;

    let medico = new Medico({
        nombre: body.nombre,
        hospital: body.hospital,
        usuario: req.usuario._id
    });

    medico.save((err, medicoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear el médico',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            medico: medicoDB
        });
    });

});


//===================================================
// Actualizar médico
//===================================================
app.put('/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let nuevoMedico = {
        nombre: body.nombre,
        hospital: body.hospital,
        usuario: req.usuario._id
    };

    Medico.findByIdAndUpdate(id, nuevoMedico, { new: true, runValidators: true }, (err, medicoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al actualizar el médico',
                errors: err
            });
        }

        if (!medicoDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un médico con ese ID',
                errors: {
                    message: 'No existe un médico con ese ID'
                }
            });
        }

        res.status(200).json({
            ok: true,
            medico: medicoDB
        });

    });

});


//===================================================
// Eliminar médico por id
//===================================================
app.delete('/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al borrar el médico',
                errors: err
            });
        }

        if (!medicoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un médico con ese ID',
                errors: {
                    message: 'No existe un médico con ese ID'
                }
            });
        }

        res.status(200).json({
            ok: true,
            medico: medicoBorrado
        });

    });

});

//export
module.exports = app;