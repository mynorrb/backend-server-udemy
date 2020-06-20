const express = require('express');

const app = express();

app.get('/', (req, res, next) => {

    return res.status(200).json({
        ok: true,
        message: 'Petición realizada correctamente'
    });

});

module.exports = app;