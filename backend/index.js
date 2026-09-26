const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        modulo: 'EcoWash Backend - API Operativa',
        timestamp: new Date().toISOString()
    });
    });

    app.listen(8080, () => {
    console.log('Servidor EcoWash corriendo en http://localhost:8080');
});