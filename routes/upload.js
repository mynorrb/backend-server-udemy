const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');
const { rest } = require('underscore');

const fs = require('fs');
const path = require('path');


// default options
app.use(fileUpload());

//===================================================
// Upload de archivo por tip y id
//===================================================
app.put('/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {

        return res.status(400).json({
            ok: false,
            mensaje: 'No se ha seleccionado ningún archivo',
            errors: {
                message: 'No se ha seleccionado ningún archivo'
            }
        });
    }

    //validar tipo
    let tiposValidos = ['usuarios', 'hospitales', 'medicos'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo no válido',
            errors: {
                message: 'Los tipos validos son ' + tiposValidos.join(', ')
            }
        });
    }

    let archivo = req.files.imagen;

    //extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1]

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extensión no válida',
            errors: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(', '),
                ext: extension
            }
        });
    }

    //cambiar el nombre al archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;
    let path = `uploads/${tipo}/${nombreArchivo}`;

    //mover el archivo a la ruta
    archivo.mv(path, (err) => {

        if (err)
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });

        //aquí, imagen cargada
        switch (tipo) {
            case 'usuarios':
                imagenUsuario(id, res, nombreArchivo);
                break;

            case 'hospitales':
                imagenHospital(id, res, nombreArchivo);
                break;

            case 'medicos':
                imagenMedico(id, res, nombreArchivo);
                break;

            default:
                break;
        }

    });


});


function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar la imagen',
                errors: err
            });
        }

        if (!usuarioDB) {
            borraArchivo(nombreArchivo, 'usuarios');

            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario no existe',
                errors: {
                    message: 'El usuario no existe'
                }
            });
        }

        //borrar archivo
        borraArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {

            return res.status(200).json({
                ok: true,
                mensaje: 'Imagen actualizada',
                usuario: usuarioGuardado,
                img: nombreArchivo
            });

        });


    });

}


function imagenHospital(id, res, nombreArchivo) {

    Hospital.findById(id, (err, HospitalDB) => {

        if (err) {
            borraArchivo(nombreArchivo, 'hospitales');
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar el archivo',
                errors: err
            });
        }

        if (!HospitalDB) {
            borraArchivo(nombreArchivo, 'hospitales');

            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital no existe',
                errors: {
                    message: 'El hospital no existe'
                }
            });
        }

        //borrar archivo
        borraArchivo(HospitalDB.img, 'hospitales');

        HospitalDB.img = nombreArchivo;

        HospitalDB.save((err, hospitalGuardado) => {

            return res.status(200).json({
                ok: true,
                mensaje: 'Imagen actualizada',
                producto: hospitalGuardado,
                img: nombreArchivo
            });

        });


    });

}

function imagenMedico(id, res, nombreArchivo) {

    Medico.findById(id, (err, medicoDB) => {

        if (err) {
            borraArchivo(nombreArchivo, 'medicos');
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar el archivo',
                errors: err
            });
        }

        if (!medicoDB) {
            borraArchivo(nombreArchivo, 'medicos');

            return res.status(400).json({
                ok: false,
                errors: {
                    message: 'El médico no existe'
                }
            });
        }

        //borrar archivo
        borraArchivo(medicoDB.img, 'medicos');

        medicoDB.img = nombreArchivo;

        medicoDB.save((err, medicoGuardado) => {

            return res.status(200).json({
                ok: true,
                mensaje: 'Imagen actualizada',
                producto: medicoGuardado,
                img: nombreArchivo
            });

        });


    });

}

function borraArchivo(nombreImagen, tipo) {

    console.log('nombre archivo: ' + nombreImagen);
    let pathImagen = path.resolve(__dirname, `../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);

    }

}

module.exports = app;