// src/pages/MedicoRecetaNueva.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

/**
 * Crea una receta para la cita :citaId
 * - Carga catálogos de diagnosticos y medicamentos
 * - Valida campos requeridos
 * - Envía POST /api/recetas
 * - Redirige a /medico/receta/cita/:citaId al guardar
 */
export default function MedicoRecetaNueva() {
  const { citaId } = useParams();
  const navigate = useNavigate();

  const [diagnosticos, setDiagnosticos] = useState([]);
  const [meds, setMeds] = useState([]);

  const [catsLoading, setCatsLoading] = useState(true);
  const [catsError, setCatsError] = useState(null);

  const [form, setForm] = useState({
    diagnostico_id: "",
    observaciones: "",
    medicamentos: [{ medicamento_id: "", indicaciones: "", duracion_dias: 1 }],
  });

  const [ok, setOk] = useState(null);
  const [err, setErr] = useState(null);
  const [saving, setSaving] = useState(false);

  // Cargar catálogos (diagnósticos + medicamentos) en paralelo
  useEffect(() => {
    (async () => {
      try {
        setCatsLoading(true);
        setCatsError(null);
        const [dRes, mRes] = await Promise.all([
          api.get("/diagnosticos"),
          api.get("/medicamentos"),
        ]);
        setDiagnosticos(dRes.data || []);
        setMeds(mRes.data || []);
      } catch (e) {
        setCatsError("No se pudieron cargar catálogos");
        setDiagnosticos([]);
        setMeds([]);
      } finally {
        setCatsLoading(false);
      }
    })();
  }, []);

  // Helpers de items
  function upItem(i, k, v) {
    const arr = [...form.medicamentos];
    arr[i] = { ...arr[i], [k]: v };
    setForm((f) => ({ ...f, medicamentos: arr }));
  }

  function addItem() {
    setForm((f) => ({
      ...f,
      medicamentos: [
        ...f.medicamentos,
        { medicamento_id: "", indicaciones: "", duracion_dias: 1 },
      ],
    }));
  }

  function rmItem(i) {
    setForm((f) => ({
      ...f,
      medicamentos: f.medicamentos.filter((_, idx) => idx !== i),
    }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr(null);
    setOk(null);

    // Validaciones mínimas en el cliente
    if (!form.diagnostico_id) {
      setErr("Selecciona un diagnóstico.");
      return;
    }
    const itemsLimpios = form.medicamentos
      .map((m) => ({
        medicamento_id: Number(m.medicamento_id),
        indicaciones: String(m.indicaciones || "").trim(),
        duracion_dias: Number(m.duracion_dias || 1),
      }))
      .filter((m) => m.medicamento_id && m.indicaciones);

    if (itemsLimpios.length === 0) {
      setErr("Agrega al menos un medicamento con indicaciones.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        cita_id: Number(citaId),
        diagnostico_id: Number(form.diagnostico_id),
        observaciones: form.observaciones || null,
        medicamentos: itemsLimpios,
      };

      const { data } = await api.post("/recetas", payload);
      setOk(`Receta creada (id ${data?.id ?? ""})`);

      // Redirigir a la vista de la receta para imprimir
      navigate(`/medico/receta/cita/${citaId}`, { replace: true });
    } catch (e) {
      setErr(e?.response?.data?.error || e.message || "Error al crear receta");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ padding: 16, maxWidth: 1000 }}>
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

      <h2>Nueva Receta — Cita #{citaId}</h2>

      {catsLoading && <p>Cargando catálogos…</p>}
      {catsError && <p style={{ color: "red" }}>{catsError}</p>}

      <form
        onSubmit={onSubmit}
        style={{
          display: "grid",
          gap: 12,
          maxWidth: 960,
          opacity: catsLoading ? 0.6 : 1,
        }}
      >
        {/* Diagnóstico */}
        <select
          required
          disabled={catsLoading}
          value={form.diagnostico_id}
          onChange={(e) =>
            setForm((f) => ({ ...f, diagnostico_id: e.target.value }))
          }
        >
          <option value="">-- Diagnóstico --</option>
          {diagnosticos.map((d) => (
            <option key={d.id} value={String(d.id)}>
              {d.nombre || `#${d.id}`}
            </option>
          ))}
        </select>

        {/* Observaciones */}
        <textarea
          placeholder="Observaciones"
          value={form.observaciones}
          onChange={(e) =>
            setForm((f) => ({ ...f, observaciones: e.target.value }))
          }
          disabled={catsLoading}
          rows={3}
        />

        {/* Medicamentos */}
        <div>
          <h4 style={{ margin: "8px 0" }}>Medicamentos</h4>

          {form.medicamentos.map((m, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 3fr 1fr auto",
                gap: 8,
                marginBottom: 8,
              }}
            >
              <select
                required
                disabled={catsLoading}
                value={String(m.medicamento_id || "")}
                onChange={(e) => upItem(i, "medicamento_id", e.target.value)}
              >
                <option value="">-- Medicamento --</option>
                {meds.map((md) => (
                  <option key={md.id} value={String(md.id)}>
                    {md.nombre || `#${md.id}`}
                  </option>
                ))}
              </select>

              <input
                required
                disabled={catsLoading}
                placeholder="Indicaciones (ej. 1 tableta cada 8h)"
                value={m.indicaciones}
                onChange={(e) => upItem(i, "indicaciones", e.target.value)}
              />

              <input
                required
                disabled={catsLoading}
                type="number"
                min={1}
                placeholder="Días"
                value={String(m.duracion_dias ?? 1)}
                onChange={(e) => upItem(i, "duracion_dias", e.target.value)}
              />

              <button
                type="button"
                onClick={() => rmItem(i)}
                disabled={catsLoading}
              >
                Quitar
              </button>
            </div>
          ))}

          <button type="button" onClick={addItem} disabled={catsLoading}>
            + Agregar medicamento
          </button>
        </div>

        {/* Acciones */}
        <div style={{ textAlign: "right", marginTop: 8 }}>
          <button type="submit" disabled={saving || catsLoading}>
            {saving ? "Guardando..." : "Guardar receta"}
          </button>
          <Link to="/medico/citas" style={{ marginLeft: 12 }}>
            Cancelar
          </Link>
        </div>
      </form>

      {ok && <p style={{ color: "green" }}>{ok}</p>}
      {err && <p style={{ color: "red" }}>{err}</p>}
    </div>
  );
}
