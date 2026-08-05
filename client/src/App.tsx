import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { setToken } from "./api";

export default function App() {
  const [token, setTokenState] = useState<string | null>(() => localStorage.getItem("token"));

  useEffect(() => {
    setToken(token);
  }, [token]);

  return (
    <div className="app">
      <header className="topbar">
        <span className="brand">Códigos de Riqueza</span>
        {token && (
          <button className="link-button" onClick={() => setTokenState(null)}>
            Cerrar sesión
          </button>
        )}
      </header>
      <main>
        <Routes>
          <Route
            path="/"
            element={token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
          />
          <Route path="/registro" element={<Register onAuth={setTokenState} />} />
          <Route path="/login" element={<Login onAuth={setTokenState} />} />
          <Route
            path="/dashboard"
            element={token ? <Dashboard /> : <Navigate to="/login" replace />}
          />
        </Routes>
      </main>
    </div>
  );
}
