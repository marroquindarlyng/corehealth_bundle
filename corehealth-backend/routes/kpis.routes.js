const router = require('express').Router();
const K = require('../controllers/kpisController');
const { auth, authorize } = require('../middleware/auth');

router.get('/consultas-por-medico', auth(), authorize('direccion'), K.consultasPorMedico);
router.get('/diagnosticos-frecuentes', auth(), authorize('direccion'), K.diagnosticosFrecuentes);
router.get('/ausentismo', auth(), authorize('direccion'), K.ausentismo);

module.exports = router;