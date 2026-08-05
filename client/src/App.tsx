import { useEffect, useState } from "react";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { getRole, setRole as persistRole, setToken } from "./api";

export default function App() {
  const [token, setTokenState] = useState<string | null>(() => localStorage.getItem("token"));
  const [role, setRoleState] = useState<string | null>(() => getRole());

  useEffect(() => {
    setToken(token);
  }, [token]);

  function handleAuth(newToken: string) {
    setTokenState(newToken);
    setRoleState(getRole());
  }

  function handleLogout() {
    setTokenState(null);
    persistRole(null);
    setRoleState(null);
  }

  return (
    <div className="app">
      <header className="topbar">
        <span className="brand">Códigos de Riqueza</span>
        {token && (
          <nav style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <Link to="/dashboard" className="link-button" style={{ textDecoration: "underline" }}>
              Mi dashboard
            </Link>
            {role === "admin" && (
              <Link to="/admin" className="link-button" style={{ textDecoration: "underline" }}>
                Cargar venta
              </Link>
            )}
            <button className="link-button" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </nav>
        )}
      </header>
      <main>
        <Routes>
          <Route
            path="/"
            element={token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
          />
          <Route path="/registro" element={<Register onAuth={handleAuth} />} />
          <Route path="/login" element={<Login onAuth={handleAuth} />} />
          <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" replace />} />
          <Route
            path="/admin"
            element={token && role === "admin" ? <Admin /> : <Navigate to="/dashboard" replace />}
          />
        </Routes>
      </main>
    </div>
  );
}
