import React, { createContext, useContext, useEffect, useState } from "react";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const rol = localStorage.getItem("rol");
    const id = localStorage.getItem("uid");
    return token ? { token, rol, id } : null;
  });

  function login({ token, rol, id }) {
    localStorage.setItem("token", token);
    localStorage.setItem("rol", rol);
    localStorage.setItem("uid", String(id));
    setUser({ token, rol, id });
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");
    localStorage.removeItem("uid");
    setUser(null);
  }

  return (
    <AuthCtx.Provider value={{ user, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  return useContext(AuthCtx);
}
