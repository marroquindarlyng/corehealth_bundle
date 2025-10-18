import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function MedicoDashboard() {
  const { user } = useAuth();

  return (
    <div style={{ padding: 16 }}>
      <h2>Panel del Médico</h2>
      <p>Bienvenido, médico {user?.id}</p>

      <p>Aquí puedes gestionar tus pacientes y citas.</p>
      <ul>
        <li>
          <Link to="/medico/citas">Agenda de citas</Link>
        </li>
        <li>
          {/* La receta se emite desde una cita concreta */}
          <span>
            Emitir receta (ve a <Link to="/medico/citas">Agenda</Link> y elige
            “Emitir receta” en la fila de una cita)
          </span>
        </li>
      </ul>
    </div>
  );
}
