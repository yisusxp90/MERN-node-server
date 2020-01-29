const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken');

exports.autenticarUsuario = async (req, res) => {
    // revisar si hay errores
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errores: errors.array()});
    }
    // extraer email y passord
    const {email, password} = req.body;

    try {

        // validar que sea un usuario registrado
        let usuario = await Usuario.findOne({email});
        if(!usuario){
            return res.status(400).json({msg: 'Usuario/clave invalido'});
        }
        // validar password correcta
        const passwordCorrecta = await bcryptjs.compare(password, usuario.password);
        if(!passwordCorrecta){
            return res.status(400).json({msg: 'Usuario/clave invalido'});
        }

        // si pasamos las validaciones crear y firmar el JWT
        const payload = {
            usuario: {
                id: usuario.id
            }
        };
        jwt.sign(payload, process.env.SECRET, {
            expiresIn: 3600
        }, (error, token) => {

            if(error) throw error;

            res.json({token});
        });


    }catch (error) {
        console.log(error);
    }
};

exports.obtenerUsuarioAutenticado = async (req, res) => {
  try {
      // con el select le decimos q no devuelva el password en la respuesta
      const usuario = await Usuario.findById(req.usuario.id).select('-password');
      res.json({usuario});
  }catch (err) {
      res.status(500).json({msg: 'Ocurrio un error'});
  }
};