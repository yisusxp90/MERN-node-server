const express = require('express');
const router = express.Router();
const proyectoController = require('../controllers/proyectoController');
const { check } = require('express-validator');
const auth = require('../middleware/authentication');

// crea proyecto
// api/proyectos
router.post('/',
    // primero va al middleware de auth y despues va al proyectoController
    auth,
    [
        check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    proyectoController.crearProyecto
);

router.get('/',
    // primero va al middleware de auth y despues va al proyectoController
    auth,
    proyectoController.obtenerProyectos
);

router.put('/:id',
    // primero va al middleware de auth y despues va al proyectoController
    auth,
    [
        check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty(),
    ],
    proyectoController.actualizarProyecto
);

router.delete('/:id',
    // primero va al middleware de auth y despues va al proyectoController
    auth,
    proyectoController.eliminarProyecto
);
module.exports = router;