const Catalogos = require('../models/catalogosModel');

async function especialidades(req, res) {
  try { res.json(await Catalogos.getEspecialidades()); }
  catch (err) { console.error(err); res.status(500).json({ error: 'Error' }); }
}
async function medicos(req, res) {
  try { res.json(await Catalogos.getMedicos()); }
  catch (err) { console.error(err); res.status(500).json({ error: 'Error' }); }
}
async function medicamentos(req, res) {
  try { res.json(await Catalogos.getMedicamentos()); }
  catch (err) { console.error(err); res.status(500).json({ error: 'Error' }); }
}
async function diagnosticos(req, res) {
  try { res.json(await Catalogos.getDiagnosticos()); }
  catch (err) { console.error(err); res.status(500).json({ error: 'Error' }); }
}
async function consultas(req, res) {
  try { res.json(await Catalogos.getConsultas()); }
  catch (err) { console.error(err); res.status(500).json({ error: 'Error' }); }
}
async function eventos(req, res) {
  try { res.json(await Catalogos.getEventos()); }
  catch (err) { console.error(err); res.status(500).json({ error: 'Error' }); }
}

module.exports = { especialidades, medicos, medicamentos, diagnosticos, consultas, eventos };