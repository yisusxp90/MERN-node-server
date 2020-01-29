const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');
// crear el servidor

const app = express();

conectarDB();

// habilitar cors
app.use(cors());

// Habilitar express.json esto antes se hacia con el body-parser
app.use(express.json({extended: true}));

//puerto de la app
const PORT = process.env.PORT || 4000;

// importar rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tareas'));

app.listen(PORT, () => {
    console.log(`El servidor esta funcionando en el puerto ${PORT}`);
});

