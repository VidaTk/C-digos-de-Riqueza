"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!response.ok) {
        setError("Contraseña incorrecta. Intenta de nuevo.");
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setError("Algo salió mal. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <label htmlFor="password" className="login-label">
        Contraseña de acceso
      </label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        className="login-input"
        required
        autoFocus
      />
      {error && <p className="login-error">{error}</p>}
      <button type="submit" className="login-button" disabled={isSubmitting}>
        {isSubmitting ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
