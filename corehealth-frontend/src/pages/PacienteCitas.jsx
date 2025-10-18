import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function PacienteCitas() {
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const { data } = await api.get("/pacientes/me/citas");
      setRows(data || []);
    } catch (e) {
      setErr(e?.message || "Error cargando citas");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h2>Mis Citas</h2>
      <div style={{ marginBottom: 12 }}>
        <Link to="/paciente/citas/nueva">Agendar cita</Link>{" "}
        <button onClick={load} style={{ marginLeft: 8 }}>
          Actualizar
        </button>
      </div>

      {loading && <p>Cargando…</p>}
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
              <th>Médico</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.fecha}</td>
                <td>{r.hora}</td>
                <td>{r.medico}</td>
                <td>{r.estado}</td>
                <td>
                  {r.tiene_receta ? (
                    <Link to={`/paciente/receta/cita/${r.id}`}>Ver receta</Link>
                  ) : (
                    <span style={{ opacity: 0.6 }}>Sin receta</span>
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
