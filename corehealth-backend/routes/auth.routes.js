// corehealth-backend/routes/auth.routes.js
const router = require("express").Router();
const {
  register, // pacientes
  registerMedico, // médicos (nuevo)
  login, // pacientes o medicos
} = require("../controllers/authController");

// Registro Paciente
router.post("/register", register);

// Registro Médico (NUEVO)
router.post("/register-medico", registerMedico);

// Login (paciente o médico)
router.post("/login", login);

module.exports = router;
