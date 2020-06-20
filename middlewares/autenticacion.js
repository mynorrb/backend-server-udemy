const jwt = require('jsonwebtoken');

//===================================================
// Verificar token
//===================================================
let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decode) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token no válido',
                errors: err
            });
        }


        req.usuario = decode.usuario;
        next();

    });

};

//===================================================
// verificar admin role
//===================================================
let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;


    if (usuario.role === 'ADMIN_ROLE') {
        next();

    } else {
        return res.json({
            ok: false,
            mensaje: 'El usuario no es adminitrador',
            errors: {
                message: 'El ususairo no es administrador'
            }
        });

    }


};

//===================================================
// verificar token img
//===================================================
let verificaTokenImg = (req, res, next) => {
    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decode) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }


        req.usuario = decode.usuario;
        next();

    });

}

module.exports = {
    verificaToken,
    verificaAdmin_Role,
    verificaTokenImg
}