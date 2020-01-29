const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator')

exports.crearProyecto = async (req, res) => {

    // revisar si hay errores
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errores: errors.array()});
    }

    try {

        const proyecto = new Proyecto(req.body);
        // guardar el usuario creador con JWT
        proyecto.creador = req.usuario.id;
        await proyecto.save();

        res.json({proyecto});

    }catch (error) {
        console.log(error);
        res.status(400).json({msg: 'Error guardando Proyecto'});
    }
};

exports.obtenerProyectos = async (req, res) => {
    try {
        const proyectos = await Proyecto.find({creador: req.usuario.id});
        res.json({proyectos});
    }catch (error) {
        res.status(500).json({msg: 'Error obteniendo Proyectos'});
    }
};

exports.actualizarProyecto = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errores: errors.array()});
    }

    const nombre = req.body.nombre;

    try {
        // obtener id
        let proyecto = await Proyecto.findById(req.params.id);
        // si existe o no el proyecto
        if(!proyecto){
            res.status(404).json({msg: 'Proyecto no encontrado'});
        }
        // verificar el creador del proyecto
        if(proyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No autorizado'});
        }
        if(nombre === proyecto.nombre){
            res.status(500).json({msg: 'No hay cambios realizados.'});
        }
        proyecto.nombre = nombre;
        // actualizar
        proyecto = await Proyecto.findByIdAndUpdate({_id: req.params.id}, {$set: proyecto}, {new: true});

        res.json({proyecto});
    }catch (error) {
        res.status(500).json({msg: 'Error actualizando Proyecto'});
    }
};

exports.eliminarProyecto = async (req, res) => {
    try {
        // obtener id
        let proyecto = await Proyecto.findById(req.params.id);
        // si existe o no el proyecto
        if(!proyecto){
            res.status(404).json({msg: 'Proyecto no encontrado'});
        }
        // verificar el creador del proyecto
        if(proyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No autorizado'});
        }

        // borrar
        await Proyecto.findOneAndRemove({_id: req.params.id});

        res.json({msg: 'Proyecto eliminado'});
    }catch (error) {
        res.status(500).json({msg: 'Error borrando Proyecto'});
    }
};