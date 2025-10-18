import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function RecetaView() {
  const { citaId } = useParams();
  const { user } = useAuth();

  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setErr(null);
    api
      .get(`/recetas/cita/${citaId}`)
      .then((r) => mounted && setData(r.data))
      .catch((e) => mounted && setErr(e?.response?.data?.error || e.message))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [citaId]);

  const backHref = user?.rol === "medico" ? "/medico/citas" : "/paciente/citas";

  if (loading) return <div style={{ padding: 16 }}>Cargando…</div>;
  if (err) return <div style={{ padding: 16, color: "red" }}>{err}</div>;
  if (!data) return <div style={{ padding: 16 }}>Sin datos</div>;

  const { diagnostico_id, observaciones, detalle = [] } = data;

  return (
    <div style={{ padding: 16 }}>
      <nav style={{ display: "flex", gap: 12, marginBottom: 8 }}>
        {user?.rol === "medico" && (
          <>
            <Link to="/medico">Panel Médico</Link>
            <Link to="/medico/citas">Agenda</Link>
          </>
        )}
        {user?.rol === "paciente" && (
          <>
            <Link to="/paciente">Panel Paciente</Link>
            <Link to="/paciente/citas">Mis Citas</Link>
          </>
        )}
      </nav>

      <h2>Receta — Cita #{citaId}</h2>

      <p>
        <b>Diagnóstico:</b> #{diagnostico_id}
      </p>
      <p>
        <b>Observaciones:</b> {observaciones || "—"}
      </p>

      <h3>Indicaciones</h3>
      {detalle.length === 0 ? (
        <p>Sin medicamentos.</p>
      ) : (
        <ol>
          {detalle.map((d) => (
            <li key={d.id} style={{ marginBottom: 8 }}>
              <div>#{d.medicamento_id}</div>
              <div>{d.indicaciones}</div>
              <div>Días: {d.duracion_dias}</div>
            </li>
          ))}
        </ol>
      )}

      <div style={{ marginTop: 12 }}>
        <button onClick={() => window.print()}>Imprimir</button>
        <Link to={backHref} style={{ marginLeft: 12 }}>
          Volver a Agenda
        </Link>
      </div>
    </div>
  );
}
