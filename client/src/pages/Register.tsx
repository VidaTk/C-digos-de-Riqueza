import { FormEvent, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { register, setToken } from "../api";

interface Props {
  onAuth: (token: string) => void;
}

export default function Register({ onAuth }: Props) {
  const [searchParams] = useSearchParams();
  const referredByPromoterCode = searchParams.get("p") ?? undefined;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    estadoMx: "",
    curp: "",
    bankName: "",
    clabe: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await register({ ...form, referredByPromoterCode });
      setToken(result.token);
      onAuth(result.token);
      navigate("/dashboard");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h1>Crear cuenta de aprendiz</h1>
      {referredByPromoterCode && (
        <p className="hint">Te está invitando: <strong>{referredByPromoterCode}</strong></p>
      )}
      <form onSubmit={handleSubmit} className="form">
        <label>
          Nombre completo
          <input required value={form.name} onChange={update("name")} />
        </label>
        <label>
          Email
          <input required type="email" value={form.email} onChange={update("email")} />
        </label>
        <label>
          Teléfono
          <input required value={form.phone} onChange={update("phone")} />
        </label>
        <label>
          Estado
          <input required value={form.estadoMx} onChange={update("estadoMx")} />
        </label>
        <label>
          CURP
          <input required maxLength={18} value={form.curp} onChange={update("curp")} />
        </label>
        <label>
          Banco
          <input required value={form.bankName} onChange={update("bankName")} />
        </label>
        <label>
          CLABE
          <input required maxLength={18} value={form.clabe} onChange={update("clabe")} />
        </label>
        <label>
          Contraseña
          <input required type="password" minLength={8} value={form.password} onChange={update("password")} />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Creando cuenta..." : "Crear cuenta"}
        </button>
      </form>
      <p className="hint">
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </div>
  );
}
