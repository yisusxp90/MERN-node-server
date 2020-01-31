const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator')

exports.crearTarea = async (req, res) => {

    // revisar si hay errores
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errores: errors.array()});
    }
    // extraer el proyecto y verificar si existe
    const { proyecto } = req.body;

    try {
        const proyectoDB = await Proyecto.findById(proyecto);
        if(!proyectoDB){
            res.status(404).json({msg: 'Proyecto no Encontrado'});
        }
        // verificar el creador del proyecto
        if(proyectoDB.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No autorizado'});
        }

        // creamos la tarea
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json({tarea});
    }catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Error guardando Tarea'});
    }
};

// obtener tareas por proyecto
exports.obtenerTareas = async (req, res) => {

    const { proyecto } = req.query;

    try {
        const proyectoDB = await Proyecto.findById(proyecto);
        if(!proyectoDB){
            res.status(404).json({msg: 'Proyecto no Encontrado'});
        }
        // verificar el creador del proyecto
        if(proyectoDB.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No autorizado'});
        }
        const tareas = await Tarea.find({proyecto: proyecto});
        res.json({tareas});
    }catch (error) {
        res.status(500).json({msg: 'Error obteniendo tareas'});
    }
};

exports.actualizarTarea = async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({errores: errors.array()});
    }

    const {proyecto, nombre, estado} = req.body;

    try {

        // si existe o no la tarea
        let tareaDB = await Tarea.findById(req.params.id);
        if(!tareaDB){
            res.status(404).json({msg: 'Tarea no encontrada'});
        }
        const proyectoDB = await Proyecto.findById(proyecto);
        // verificar el creador del proyecto
        if(proyectoDB.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No autorizado'});
        }

        tareaDB.nombre = nombre;
        tareaDB.estado = estado;

        const tarea = await Tarea.findByIdAndUpdate({_id: req.params.id}, {$set: tareaDB}, {new: true});

        res.json({tarea});
    }catch (error) {
        res.status(500).json({msg: 'Error actualizando Proyecto'});
    }
};


exports.eliminarTarea = async (req, res) => {
    try {

        const { proyecto } = req.query;
        let proyectoDB = await Proyecto.findById(proyecto);
        // si existe o no el proyecto
        if(!proyectoDB){
            res.status(404).json({msg: 'Proyecto no encontrado'});
        }
        // verificar el creador del proyecto
        if(proyectoDB.creador.toString() !== req.usuario.id){
            return res.status(401).json({msg: 'No autorizado'});
        }

        let tareaDB = await Tarea.findById(req.params.id);
        if(!tareaDB){
            res.status(404).json({msg: 'Tarea no encontrada'});
        }

        // borrar
        await Tarea.findOneAndRemove({_id: req.params.id});

        res.json({msg: 'Tarea eliminada'});
    }catch (error) {
        res.status(500).json({msg: 'Error borrando Tarea'});
    }
};