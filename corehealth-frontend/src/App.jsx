// src/App.jsx
import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

// Comunes
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// Médico
import MedicoDashboard from "./pages/MedicoDashboard";
import MedicoCitas from "./pages/MedicoCitas";
import MedicoRecetaNueva from "./pages/MedicoRecetaNueva";

// Paciente (solo lo que ya implementamos)
import PacienteCitaNueva from "./pages/PacienteCitaNueva";

function Home() {
  return <div style={{ padding: 16 }}>Home</div>;
}

export default function App() {
  const { user, logout } = useAuth();

  return (
    <div>
      <nav
        style={{
          display: "flex",
          gap: 12,
          padding: 12,
          borderBottom: "1px solid #ddd",
          alignItems: "center",
        }}
      >
        <Link to="/">Home</Link>
        {!user && <Link to="/login">Login</Link>}
        {!user && <Link to="/register">Registrarse</Link>}

        {/* Menú de MÉDICO */}
        {user?.rol === "medico" && (
          <>
            <Link to="/medico">Panel Médico</Link>
            <Link to="/medico/citas">Agenda</Link>
          </>
        )}

        {/* Menú de PACIENTE (solo agendar por ahora) */}
        {user?.rol === "paciente" && (
          <>
            <Link to="/paciente/citas/nueva">Agendar Cita</Link>
          </>
        )}

        {user && (
          <button onClick={logout} style={{ marginLeft: "auto" }}>
            Salir
          </button>
        )}
      </nav>

      <Routes>
        {/* Públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Rutas MÉDICO */}
        <Route
          path="/medico"
          element={
            <ProtectedRoute requireRole="medico">
              <MedicoDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/medico/citas"
          element={
            <ProtectedRoute requireRole="medico">
              <MedicoCitas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/medico/receta/nueva/:citaId"
          element={
            <ProtectedRoute requireRole="medico">
              <MedicoRecetaNueva />
            </ProtectedRoute>
          }
        />

        {/* Rutas PACIENTE (por ahora solo “Nueva cita”) */}
        <Route
          path="/paciente/citas/nueva"
          element={
            <ProtectedRoute requireRole="paciente">
              <PacienteCitaNueva />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}
