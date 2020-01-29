const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // leer el token del header
    const token = req.header('x-auth-token');

    if(!token){
        res.status(401).json({msg: 'No hay token, permiso no valido'});
    }
    // validar token
    try {
        const cifrado = jwt.verify(token, process.env.SECRET);
        req.usuario = cifrado.usuario;
        // para que se vaya al siguiente middleware
        next();
    }catch (error) {
        res.status(401).json({msg: 'Token no valido'});
    }
};
