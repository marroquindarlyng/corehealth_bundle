import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function PacienteCitaNueva() {
  const nav = useNavigate();

  const [especialidades, setEspecialidades] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [ok, setOk] = useState(null);

  const [form, setForm] = useState({
    especialidad_id: "",
    medico_id: "",
    fecha: "",
    hora: "",
  });

  // Cargar catálogos mínimos
  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setErr(null);
      try {
        const [espRes, medRes] = await Promise.all([
          api.get("/especialidades"), // ya lo tienes implementado
          api.get("/medicos"), // listado de médicos activos
        ]);
        if (!mounted) return;
        setEspecialidades(espRes.data || []);
        setMedicos(medRes.data || []);
      } catch (e) {
        if (!mounted) return;
        setErr(e?.message || "No se pudieron cargar catálogos");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  // Filtra médicos por especialidad si se seleccionó
  const medicosFiltrados = useMemo(() => {
    const esp = Number(form.especialidad_id || 0);
    if (!esp) return medicos;
    return (medicos || []).filter((m) => Number(m.especialidad_id) === esp);
  }, [form.especialidad_id, medicos]);

  function up(k, v) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr(null);
    setOk(null);

    const payload = {
      medico_id: Number(form.medico_id),
      especialidad_id: Number(form.especialidad_id),
      consulta_id: 1, // por ahora fijo (lo podemos parametrizar luego)
      evento_id: 1, // por ahora fijo (lo podemos parametrizar luego)
      fecha: String(form.fecha || "").trim(), // YYYY-MM-DD
      hora: String(form.hora || "").trim(), // HH:MM o HH:MM:SS
    };

    // Validación mínima en cliente
    if (
      !payload.medico_id ||
      !payload.especialidad_id ||
      !payload.fecha ||
      !payload.hora
    ) {
      setErr("Completa todos los campos (especialidad, médico, fecha, hora).");
      return;
    }

    try {
      const { data } = await api.post("/citas", payload);
      setOk(`Cita creada (id ${data?.id})`);
      // Navegar tras 1.2s a donde prefieras (más adelante haremos "Mis citas")
      setTimeout(() => nav("/"), 1200);
    } catch (e) {
      setErr(
        e?.response?.data?.error || e?.message || "No se pudo crear la cita"
      );
    }
  }

  return (
    <div style={{ padding: 16, maxWidth: 640 }}>
      <h2>Nueva Cita</h2>

      {loading && <p>Cargando catálogos…</p>}
      {err && <p style={{ color: "red" }}>{err}</p>}
      {ok && <p style={{ color: "green" }}>{ok}</p>}

      {!loading && (
        <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
          <label>
            Especialidad
            <select
              required
              value={form.especialidad_id}
              onChange={(e) => up("especialidad_id", e.target.value)}
            >
              <option value="">-- Selecciona --</option>
              {especialidades.map((esp) => (
                <option key={esp.id} value={String(esp.id)}>
                  {esp.nombre || `#${esp.id}`}
                </option>
              ))}
            </select>
          </label>

          <label>
            Médico
            <select
              required
              value={form.medico_id}
              onChange={(e) => up("medico_id", e.target.value)}
              disabled={!form.especialidad_id}
            >
              <option value="">-- Selecciona --</option>
              {medicosFiltrados.map((m) => (
                <option key={m.id} value={String(m.id)}>
                  {m.nombre} {m.colegiado ? `(${m.colegiado})` : ""}
                </option>
              ))}
            </select>
          </label>

          <label>
            Fecha
            <input
              required
              type="date"
              value={form.fecha}
              onChange={(e) => up("fecha", e.target.value)}
            />
          </label>

          <label>
            Hora
            <input
              required
              type="time"
              step="60" // minutos
              value={form.hora}
              onChange={(e) => up("hora", e.target.value)}
            />
          </label>

          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button type="submit">Reservar</button>
            <Link to="/">Cancelar</Link>
          </div>
        </form>
      )}
    </div>
  );
}
