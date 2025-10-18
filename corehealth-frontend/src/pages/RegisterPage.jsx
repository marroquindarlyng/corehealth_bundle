import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function RegisterPage() {
  const [perfil, setPerfil] = useState("paciente"); // 'paciente' | 'medico'
  const [especialidades, setEspecialidades] = useState([]);

  // Formularios separados
  const [pac, setPac] = useState({
    nombre: "",
    apellido: "",
    email: "",
    usuario: "",
    password: "",
    telefono: "",
    direccion: "",
    fecha_nacimiento: "",
    dpi: "",
  });
  const [doc, setDoc] = useState({
    nombre: "",
    email: "",
    usuario: "",
    password: "",
    colegiado: "",
    especialidad_id: "",
    telefono: "",
  });

  const [ok, setOk] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  // Carga catálogo de especialidades cuando el perfil sea médico
  useEffect(() => {
    if (perfil === "medico") {
      api
        .get("/especialidades")
        .then((r) => setEspecialidades(r.data || []))
        .catch(() => setEspecialidades([]));
    }
  }, [perfil]);

  async function onSubmit(e) {
    e.preventDefault();
    setOk(null);
    setErr(null);
    setLoading(true);
    try {
      if (perfil === "paciente") {
        const payload = {
          ...pac,
          email: pac.email.trim().toLowerCase(),
        };
        const { data } = await api.post("/auth/register", payload);
        setOk("Paciente creado: id " + data.id);
        setPac({
          nombre: "",
          apellido: "",
          email: "",
          usuario: "",
          password: "",
          telefono: "",
          direccion: "",
          fecha_nacimiento: "",
          dpi: "",
        });
      } else {
        const payload = {
          ...doc,
          email: doc.email.trim().toLowerCase(),
          especialidad_id: Number(doc.especialidad_id),
        };
        const { data } = await api.post("/auth/register-medico", payload);
        setOk("Médico creado: id " + data.id);
        setDoc({
          nombre: "",
          email: "",
          usuario: "",
          password: "",
          colegiado: "",
          especialidad_id: "",
          telefono: "",
        });
      }
    } catch (e) {
      const msg = e?.response?.data?.error || e.message || "Error registrando";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <h2>Registro</h2>

      {/* Selector de perfil */}
      <div style={{ marginBottom: 12 }}>
        <label style={{ marginRight: 12 }}>
          <input
            type="radio"
            checked={perfil === "paciente"}
            onChange={() => setPerfil("paciente")}
          />{" "}
          Paciente
        </label>
        <label>
          <input
            type="radio"
            checked={perfil === "medico"}
            onChange={() => setPerfil("medico")}
          />{" "}
          Doctor
        </label>
      </div>

      <form
        onSubmit={onSubmit}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(220px, 1fr))",
          gap: 10,
          maxWidth: 1100,
        }}
      >
        {perfil === "paciente" ? (
          <>
            <input
              placeholder="Nombre *"
              value={pac.nombre}
              onChange={(e) => setPac({ ...pac, nombre: e.target.value })}
              required
            />
            <input
              placeholder="Apellido *"
              value={pac.apellido}
              onChange={(e) => setPac({ ...pac, apellido: e.target.value })}
              required
            />
            <input
              placeholder="Email *"
              type="email"
              value={pac.email}
              onChange={(e) => setPac({ ...pac, email: e.target.value })}
              required
            />
            <input
              placeholder="Usuario *"
              value={pac.usuario}
              onChange={(e) => setPac({ ...pac, usuario: e.target.value })}
              required
            />
            <input
              placeholder="Contraseña * (mín. 4)"
              type="password"
              minLength={4}
              value={pac.password}
              onChange={(e) => setPac({ ...pac, password: e.target.value })}
              required
            />
            <input
              placeholder="Teléfono"
              value={pac.telefono}
              onChange={(e) => setPac({ ...pac, telefono: e.target.value })}
            />
            <input
              placeholder="Dirección"
              value={pac.direccion}
              onChange={(e) => setPac({ ...pac, direccion: e.target.value })}
            />
            <input
              type="date"
              placeholder="Fecha nacimiento"
              value={pac.fecha_nacimiento}
              onChange={(e) =>
                setPac({ ...pac, fecha_nacimiento: e.target.value })
              }
            />
            <input
              placeholder="DPI"
              value={pac.dpi}
              onChange={(e) => setPac({ ...pac, dpi: e.target.value })}
            />
          </>
        ) : (
          <>
            <input
              placeholder="Nombre *"
              value={doc.nombre}
              onChange={(e) => setDoc({ ...doc, nombre: e.target.value })}
              required
            />
            <input
              placeholder="Email *"
              type="email"
              value={doc.email}
              onChange={(e) => setDoc({ ...doc, email: e.target.value })}
              required
            />
            <input
              placeholder="Usuario *"
              value={doc.usuario}
              onChange={(e) => setDoc({ ...doc, usuario: e.target.value })}
              required
            />
            <input
              placeholder="Contraseña * (mín. 4)"
              type="password"
              minLength={4}
              value={doc.password}
              onChange={(e) => setDoc({ ...doc, password: e.target.value })}
              required
            />
            <input
              placeholder="Colegiado *"
              value={doc.colegiado}
              onChange={(e) => setDoc({ ...doc, colegiado: e.target.value })}
              required
            />
            <select
              value={doc.especialidad_id}
              onChange={(e) =>
                setDoc({ ...doc, especialidad_id: e.target.value })
              }
              required
            >
              <option value="">-- Especialidad --</option>
              {especialidades.map((sp) => (
                <option key={sp.id} value={sp.id}>
                  {sp.nombre || `#${sp.id}`}{" "}
                  {/* por si tu tabla no tiene 'nombre' */}
                </option>
              ))}
            </select>
            <input
              placeholder="Teléfono"
              value={doc.telefono}
              onChange={(e) => setDoc({ ...doc, telefono: e.target.value })}
            />
          </>
        )}

        <div style={{ gridColumn: "1 / -1", textAlign: "right" }}>
          <button type="submit" disabled={loading}>
            {loading ? "Creando..." : "Crear"}
          </button>
        </div>
      </form>

      {ok && <p>{ok}</p>}
      {err && <p style={{ color: "red" }}>{err}</p>}
    </div>
  );
}
