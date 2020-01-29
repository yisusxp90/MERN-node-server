const express = require('express');
const router = express.Router();
const tareaController = require('../controllers/tareaController');
const { check } = require('express-validator');
const auth = require('../middleware/authentication');

// crea proyecto
// api/proyectos
router.post('/',
    // primero va al middleware de auth y despues va al tareaController
    auth,
    [
        check('nombre', 'El nombre de la tarea es obligatorio').not().isEmpty(),
        check('proyecto', 'El proyecto es obligatorio').not().isEmpty()
    ],
    tareaController.crearTarea
);

router.get('/',
    auth,
    tareaController.obtenerTareas
);

router.put('/:id',
    // primero va al middleware de auth y despues va al proyectoController
    auth,
    [
        check('nombre', 'El nombre de la tarea es obligatorio').not().isEmpty(),
    ],
    tareaController.actualizarTarea
);

router.delete('/:id',
    // primero va al middleware de auth y despues va al proyectoController
    auth,
    tareaController.eliminarTarea
);
module.exports = router;