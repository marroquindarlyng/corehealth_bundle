const KPIs = require('../models/kpisModel');

async function consultasPorMedico(req, res) {
  try { res.json(await KPIs.consultasPorMedico()); }
  catch (err) { console.error(err); res.status(500).json({ error: 'Error' }); }
}
async function diagnosticosFrecuentes(req, res) {
  try { res.json(await KPIs.diagnosticosFrecuentes()); }
  catch (err) { console.error(err); res.status(500).json({ error: 'Error' }); }
}
async function ausentismo(req, res) {
  try { res.json(await KPIs.ausentismo()); }
  catch (err) { console.error(err); res.status(500).json({ error: 'Error' }); }
}

module.exports = { consultasPorMedico, diagnosticosFrecuentes, ausentismo };