const router = require('express').Router();
const { crear, porCita } = require('../controllers/recetasController');
const { auth, authorize } = require('../middleware/auth');

router.post('/', auth(), authorize('medico'), crear);
router.get('/cita/:id', auth(), authorize('medico', 'paciente', 'recepcion'), porCita);

module.exports = router;