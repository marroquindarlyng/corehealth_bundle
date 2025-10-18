// src/pages/MedicoCitas.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function MedicoCitas() {
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  function load() {
    setLoading(true);
    setErr(null);
    api
      .get("/medicos/me/citas")
      .then((r) => setRows(r.data || []))
      .catch((e) => setErr(e?.message || "Error cargando citas"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  const fmtFecha = (v) => (v ? String(v).slice(0, 10) : "");

  return (
    <div style={{ padding: 16 }}>
      <h2>Agenda de Citas</h2>

      <div style={{ marginBottom: 8 }}>
        <button onClick={load} disabled={loading}>
          {loading ? "Actualizando..." : "Actualizar"}
        </button>
      </div>

      {err && <p style={{ color: "red" }}>{err}</p>}

      {rows.length === 0 ? (
        <p>No hay citas</p>
      ) : (
        <table
          border="1"
          cellPadding="6"
          style={{ borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Paciente</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{fmtFecha(r.fecha)}</td>
                <td>{r.hora}</td>
                <td>{r.paciente}</td>
                <td>
                  {Number(r.tiene_receta) ? (
                    <Link to={`/medico/receta/cita/${r.id}`}>Ver receta</Link>
                  ) : (
                    <Link to={`/medico/receta/nueva/${r.id}`}>
                      Emitir receta
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
