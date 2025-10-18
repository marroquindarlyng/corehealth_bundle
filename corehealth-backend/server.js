/**
 * Core Health Backend
 * Express + MySQL2
 * CORS + JWT
 */
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use("/api", require("./routes/catalogos.routes"));
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/pacientes", require("./routes/pacientes.routes"));
app.use("/api/citas", require("./routes/citas.routes"));
app.use("/api/recetas", require("./routes/recetas.routes"));
app.use("/api", require("./routes/catalogos.routes"));
app.use("/api/kpis", require("./routes/kpis.routes"));
app.use("/api/medicos", require("./routes/medicos.routes"));
app.use("/api", require("./routes/medicos.routes"));

// Healthcheck
app.get("/health", (_req, res) => res.json({ ok: true }));

const port = process.env.PORT || 3001;

//app.listen(process.env.PORT || 3001, () => {
//console.log("API on", process.env.PORT || 3001);

app.listen(port, () =>
  console.log(`Core Health API escuchando en http://localhost:${port}`)
);
