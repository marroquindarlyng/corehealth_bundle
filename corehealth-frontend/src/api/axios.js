// src/api/axios.js
import axios from "axios";

// Usa .env si existe; fallback a 127.0.0.1 para evitar líos con "localhost"
const baseURL = (
  import.meta.env.VITE_API_URL ?? "http://127.0.0.1:3001/api"
).replace(/\/$/, "");

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Adjunta el JWT si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Manejo unificado de errores + auto-logout si 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response) {
      // Si el token expiró o es inválido, limpiar sesión
      if (err.response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        // Notifica a la app (ej. AuthContext puede escuchar este evento)
        window.dispatchEvent(new Event("auth:logout"));
      }
      // Usa el mensaje del backend si viene
      err.message = err.response.data?.error || err.message;
    } else if (err.request) {
      // No se pudo contactar a la API
      err.message = "No se pudo conectar con la API";
    }
    return Promise.reject(err);
  }
);

export default api;
