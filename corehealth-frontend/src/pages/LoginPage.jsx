import React, { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [emailOrUsuario, setU] = useState("");
  const [password, setP] = useState("");
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", {
        emailOrUsuario,
        password,
      });
      // data: { token, rol, id }
      login(data);
      // envia a dashboard de medico o home
      if (data.rol === "medico") nav("/medico", { replace: true });
      else nav("/", { replace: true });
    } catch (e) {
      setErr(
        e?.response?.data?.error || e.message || "Error al iniciar sesión"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <h2>Login</h2>
      <form
        onSubmit={onSubmit}
        style={{ display: "grid", gap: 10, maxWidth: 380 }}
      >
        <input
          placeholder="Email o Usuario"
          value={emailOrUsuario}
          onChange={(e) => setU(e.target.value)}
        />
        <input
          placeholder="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setP(e.target.value)}
        />
        <button disabled={loading}>{loading ? "Entrando..." : "Entrar"}</button>
      </form>
      {err && <p style={{ color: "red" }}>{err}</p>}
    </div>
  );
}
