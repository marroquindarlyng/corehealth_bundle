import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function PacientePerfil() {
  const [f, setF] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    direccion: "",
    fecha_nacimiento: "",
  });
  const [ok, setOk] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    api
      .get("/pacientes/me")
      .then(({ data }) =>
        setF({
          nombre: data?.nombre || "",
          apellido: data?.apellido || "",
          telefono: data?.telefono || "",
          direccion: data?.direccion || "",
          fecha_nacimiento: data?.fecha_nacimiento || "",
        })
      )
      .catch(() => {});
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setOk(null);
    setErr(null);
    try {
      await api.put("/pacientes/me", f);
      setOk("Guardado");
    } catch (e) {
      setErr(e?.message || "No se pudo guardar");
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <h2>Mi Perfil</h2>
      <form
        onSubmit={onSubmit}
        style={{ display: "grid", gap: 8, maxWidth: 420 }}
      >
        <input
          placeholder="Nombre"
          value={f.nombre}
          onChange={(e) => setF({ ...f, nombre: e.target.value })}
        />
        <input
          placeholder="Apellido"
          value={f.apellido}
          onChange={(e) => setF({ ...f, apellido: e.target.value })}
        />
        <input
          placeholder="Teléfono"
          value={f.telefono}
          onChange={(e) => setF({ ...f, telefono: e.target.value })}
        />
        <input
          placeholder="Dirección"
          value={f.direccion}
          onChange={(e) => setF({ ...f, direccion: e.target.value })}
        />
        <input
          type="date"
          value={f.fecha_nacimiento || ""}
          onChange={(e) => setF({ ...f, fecha_nacimiento: e.target.value })}
        />
        <button>Guardar</button>
      </form>
      {ok && <p style={{ color: "green" }}>{ok}</p>}
      {err && <p style={{ color: "red" }}>{err}</p>}
    </div>
  );
}
