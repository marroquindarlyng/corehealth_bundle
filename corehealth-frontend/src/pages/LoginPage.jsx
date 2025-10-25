import React, { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/LoginPage.css"; // opcional para estilos extra

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
      login(data);
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
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card shadow p-4"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <div className="text-center mb-3">
          <i className="fa-solid fa-user-doctor fa-2x text-primary"></i>
          <h3 className="mt-2" style={{ fontFamily: "Poppins, sans-serif" }}>
            Iniciar Sesión
          </h3>
        </div>

        <form onSubmit={onSubmit} noValidate>
          {/* Email/Usuario */}
          <div className="mb-3">
            <label className="form-label">Email o Usuario</label>
            <input
              type="text"
              className="form-control"
              placeholder="ejemplo@correo.com"
              value={emailOrUsuario}
              onChange={(e) => setU(e.target.value)}
              required
            />
            {!emailOrUsuario && (
              <small className="text-muted">Ingresa tu correo o usuario</small>
            )}
          </div>

          {/* Contraseña */}
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              placeholder="********"
              value={password}
              onChange={(e) => setP(e.target.value)}
              required
              minLength={6}
            />
            {password && password.length < 6 && (
              <small className="text-danger">
                La contraseña debe tener al menos 6 caracteres
              </small>
            )}
          </div>

          {/* Botón */}
          <div className="d-grid">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </button>
          </div>
        </form>

        {/* Error */}
        {err && <div className="alert alert-danger mt-3">{err}</div>}
      </div>
    </div>
  );
}
