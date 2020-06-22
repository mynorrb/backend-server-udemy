//require
const express = require('express');

//configuración de express
const app = express();

//modelo de hospital
const Hospital = require('../models/hospital');

//middlewares
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

//===================================================
// Obtener todos los hospitales
//===================================================
app.get('/', (req, res, next) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Hospital.find({})
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .exec((err, hospitalesDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando hospitales',
                    errors: err
                });
            }
            Hospital.countDocuments({}, (err, conteo) => {
                return res.status(200).json({
                    ok: true,
                    hospitalesDB,
                    total: conteo
                });
            });

        });

});


//===================================================
// Crear un nuevo hospital
//===================================================
app.post('/', verificaToken, (req, res) => {

    let body = req.body;

    let hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    hospital.save((err, hospitalDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear el hospital',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            hospital: hospitalDB
        });
    });

});


//===================================================
// Actualizar hospital
//===================================================
app.put('/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let nombreHospital = {
        nombre: body.nombre,
        usuario: req.usuario._id
    }

    Hospital.findByIdAndUpdate(id, nombreHospital, { new: true, runValidators: true }, (err, hospitalDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al actualizar el hospital',
                errors: err
            });
        }

        if (!hospitalDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un hospital con ese ID',
                errors: {
                    message: 'No existe un hospital con ese ID'
                }
            });
        }

        res.status(200).json({
            ok: true,
            hospital: hospitalDB
        });

    });

});


//===================================================
// Eliminar hospital por id
//===================================================
app.delete('/:id', verificaToken, (req, res) => {

    let id = req.params.id;


    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al borrar el hospital',
                errors: err
            });
        }

        if (!hospitalBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un hospital con ese ID',
                errors: {
                    message: 'No existe un hospital con ese ID'
                }
            });
        }

        res.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        });

    });

});

//export
module.exports = app;