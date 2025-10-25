import React from "react";
import "./home.css";

export default function HomePage() {
  return (
    <div className="home-hero">
      {/* Icono Home */}
      <a
        href="/"
        className="home-icon"
        aria-label="Volver al inicio"
        title="Inicio"
      >
        <i className="fas fa-home" aria-hidden="true"></i>
      </a>

      {/* Icono Ayuda */}
      <a
        href="/ayuda"
        className="help-icon"
        aria-label="Ayuda e información"
        title="Ayuda"
      >
        <i className="fas fa-question-circle" aria-hidden="true"></i>
      </a>

      {/* Logo y textos */}
      <img src="/img/logob.png" alt="COREHEALTH" className="logo" />
      <h1>¡TU SALUD ES IMPORTANTE!</h1>
      <p>Selecciona tu perfil para continuar</p>

      {/* Botones */}
      <div className="buttons-container">
        <a href="/loby-paciente" className="btn btn-custom">
          <i className="fas fa-user" aria-hidden="true"></i>
          <span>Paciente</span>
        </a>
        <a href="/loby-doctor" className="btn btn-custom">
          <i className="fas fa-user-md" aria-hidden="true"></i>
          <span>Doctor</span>
        </a>
      </div>
    </div>
  );
}
