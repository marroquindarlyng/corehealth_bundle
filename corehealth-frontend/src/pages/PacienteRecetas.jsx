import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function PacienteRecetas() {
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState(null);

  useEffect(() => {
    api
      .get("/pacientes/me/recetas")
      .then((r) => setRows(r.data || []))
      .catch((e) => setErr(e?.message || "No se pudieron cargar las recetas"));
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h2>Mis Recetas</h2>
      {err && <p style={{ color: "red" }}>{err}</p>}
      {rows.length === 0 ? (
        <p>No tienes recetas aún.</p>
      ) : (
        <ul>
          {rows.map((r) => (
            <li key={r.id}>
              Cita #{r.cita_id} — {new Date(r.creado_en).toLocaleString()} —{" "}
              <Link to={`/paciente/receta/cita/${r.cita_id}`}>Ver</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
