import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function PacienteDashboard() {
  const [me, setMe] = useState(null);
  const [citas, setCitas] = useState([]);
  const [recetas, setRecetas] = useState([]);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [a, b, c] = await Promise.all([
          api.get("/pacientes/me"),
          api.get("/pacientes/me/citas"),
          api.get("/pacientes/me/recetas"),
        ]);
        if (!mounted) return;
        setMe(a.data ?? null);
        setCitas(b.data ?? []);
        setRecetas(c.data ?? []);
      } catch (e) {
        setErr(e?.message || "No se pudo cargar el panel");
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const proxima = [...citas].sort((x, y) =>
    (x.fecha + x.hora).localeCompare(y.fecha + y.hora)
  )[0];

  const ultimaReceta = [...recetas].sort((a, b) =>
    String(b.creado_en).localeCompare(String(a.creado_en))
  )[0];

  return (
    <div style={{ padding: 16 }}>
      <h2>Panel del Paciente</h2>
      {err && <p style={{ color: "red" }}>{err}</p>}

      {me && (
        <p>
          Bienvenido,{" "}
          <b>
            {me.nombre} {me.apellido}
          </b>
        </p>
      )}

      <div style={{ marginTop: 12 }}>
        <h3>Próxima cita</h3>
        {!proxima ? (
          <p>
            No tienes citas próximas.{" "}
            <Link to="/paciente/citas/nueva">Agendar cita</Link>
          </p>
        ) : (
          <ul>
            <li>Fecha: {proxima.fecha}</li>
            <li>Hora: {proxima.hora}</li>
            <li>Médico: {proxima.medico}</li>
            <li>
              {proxima.tiene_receta ? (
                <Link to={`/paciente/receta/cita/${proxima.id}`}>
                  Ver receta
                </Link>
              ) : (
                "Sin receta"
              )}
            </li>
          </ul>
        )}
      </div>

      <div style={{ marginTop: 12 }}>
        <h3>Última receta</h3>
        {!ultimaReceta ? (
          <p>Aún no tienes recetas.</p>
        ) : (
          <p>
            Cita #{ultimaReceta.cita_id} —{" "}
            <Link to={`/paciente/receta/cita/${ultimaReceta.cita_id}`}>
              Ver
            </Link>
          </p>
        )}
      </div>

      <div style={{ marginTop: 16 }}>
        <Link to="/paciente/citas" style={{ marginRight: 12 }}>
          Mis Citas
        </Link>
        <Link to="/paciente/recetas" style={{ marginRight: 12 }}>
          Mis Recetas
        </Link>
        <Link to="/paciente/perfil">Mi Perfil</Link>
      </div>
    </div>
  );
}
