import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";

/**
 * Muestra la receta asociada a una cita para poder verla e imprimirla.
 * GET /api/recetas/cita/:citaId  (requiere token)
 * Además carga catálogos de medicamentos/diagnósticos para mostrar nombres.
 */
export default function MedicoRecetaVista() {
  const { citaId } = useParams();

  const [receta, setReceta] = useState(null);
  const [meds, setMeds] = useState([]);
  const [diagnosticos, setDiagnosticos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const medsById = useMemo(() => {
    const m = new Map();
    meds.forEach((x) => m.set(Number(x.id), x));
    return m;
  }, [meds]);

  const diagsById = useMemo(() => {
    const m = new Map();
    diagnosticos.forEach((x) => m.set(Number(x.id), x));
    return m;
  }, [diagnosticos]);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const [r1, r2, r3] = await Promise.all([
          api.get(`/recetas/cita/${citaId}`),
          api.get("/medicamentos"),
          api.get("/diagnosticos"),
        ]);
        if (!alive) return;
        setReceta(r1.data || null);
        setMeds(r2.data || []);
        setDiagnosticos(r3.data || []);
      } catch (e) {
        if (!alive) return;
        setErr(
          e?.response?.data?.error || e.message || "No se pudo cargar la receta"
        );
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [citaId]);

  function medNombre(id) {
    const m = medsById.get(Number(id));
    return m?.nombre || `#${id}`;
    // si tu catálogo viene sin nombres, quedará #id
  }
  function diagNombre(id) {
    const d = diagsById.get(Number(id));
    return d?.nombre || `#${id}`;
  }

  if (loading) return <div style={{ padding: 16 }}>Cargando…</div>;
  if (err) return <div style={{ padding: 16, color: "red" }}>{err}</div>;
  if (!receta)
    return <div style={{ padding: 16 }}>No hay receta para esta cita.</div>;

  const { diagnostico_id, observaciones, detalle } = receta;

  return (
    <div style={{ padding: 16, maxWidth: 900, margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <Link to="/medico">Panel Médico</Link>
        <Link to="/medico/citas">Agenda</Link>
        <div style={{ marginLeft: "auto" }} />
      </div>

      <h2>Receta — Cita #{citaId}</h2>

      <section style={{ margin: "12px 0" }}>
        <p>
          <strong>Diagnóstico: </strong>
          {diagNombre(diagnostico_id)}
        </p>
        {observaciones ? (
          <p>
            <strong>Observaciones:</strong> {observaciones}
          </p>
        ) : null}
      </section>

      <section style={{ margin: "12px 0" }}>
        <h3>Indicaciones</h3>
        {!detalle?.length ? (
          <p>No hay detalle de medicamentos.</p>
        ) : (
          <ol>
            {detalle.map((d) => (
              <li key={d.id} style={{ marginBottom: 6 }}>
                <div>
                  <strong>{medNombre(d.medicamento_id)}</strong>
                </div>
                <div>{d.indicaciones}</div>
                <div>Días: {d.duracion_dias}</div>
              </li>
            ))}
          </ol>
        )}
      </section>

      <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
        <button onClick={() => window.print()}>Imprimir</button>
        <Link to="/medico/citas">Volver a Agenda</Link>
      </div>
    </div>
  );
}
