import { FormEvent, useState } from "react";
import { createSale } from "../api";

const PRODUCTS = [
  { code: "libro", label: "Libro físico ($349)" },
  { code: "curso", label: "Curso digital ($2,349)" },
  { code: "curso_con_descuento", label: "Curso digital con descuento ($1,999 — ya compró el libro)" },
  { code: "asesoria", label: "Asesoría (monto variable)" },
] as const;

const today = new Date().toISOString().slice(0, 10);

export default function Admin() {
  const [form, setForm] = useState({
    productCode: "libro" as (typeof PRODUCTS)[number]["code"],
    buyerName: "",
    buyerEmail: "",
    buyerPhone: "",
    promoterEmail: "",
    saleDate: today,
    grossAmount: "",
    notes: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update<K extends keyof typeof form>(field: K) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const sale = await createSale({
        productCode: form.productCode,
        buyerName: form.buyerName,
        buyerEmail: form.buyerEmail || undefined,
        buyerPhone: form.buyerPhone || undefined,
        promoterEmail: form.promoterEmail,
        saleDate: form.saleDate,
        grossAmount: Number(form.grossAmount),
        notes: form.notes || undefined,
      });
      setSuccess(
        `Venta registrada. Comisión nivel 1: ${sale.commissionL1PctApplied}% ($${sale.commissionL1Amount})` +
          (sale.commissionL2Amount ? ` · Comisión nivel 2: $${sale.commissionL2Amount}` : "") +
          ` · Se libera el ${new Date(sale.commissionReleaseDate).toLocaleDateString("es-MX")}.`,
      );
      setForm((f) => ({ ...f, buyerName: "", buyerEmail: "", buyerPhone: "", grossAmount: "", notes: "" }));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h1>Cargar venta (admin)</h1>
      <p className="hint">
        Registra una venta hecha fuera de la plataforma. El sistema calcula automáticamente la
        comisión de 1er y 2do nivel según quién vendió.
      </p>
      <form onSubmit={handleSubmit} className="form">
        <label>
          Producto
          <select value={form.productCode} onChange={update("productCode")}>
            {PRODUCTS.map((p) => (
              <option key={p.code} value={p.code}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Nombre del comprador
          <input required value={form.buyerName} onChange={update("buyerName")} />
        </label>
        <label>
          Email del comprador (opcional)
          <input type="email" value={form.buyerEmail} onChange={update("buyerEmail")} />
        </label>
        <label>
          Teléfono del comprador (opcional)
          <input value={form.buyerPhone} onChange={update("buyerPhone")} />
        </label>
        <label>
          Email del promotor (quién hizo la venta)
          <input required type="email" value={form.promoterEmail} onChange={update("promoterEmail")} />
        </label>
        <label>
          Fecha de la venta
          <input required type="date" value={form.saleDate} onChange={update("saleDate")} />
        </label>
        <label>
          Monto bruto (MXN)
          <input required type="number" min="0" step="0.01" value={form.grossAmount} onChange={update("grossAmount")} />
        </label>
        <label>
          Notas (opcional)
          <textarea value={form.notes} onChange={update("notes")} rows={2} />
        </label>
        {error && <p className="error">{error}</p>}
        {success && <p className="hint" style={{ color: "#1a7f37" }}>{success}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Guardando..." : "Registrar venta"}
        </button>
      </form>
    </div>
  );
}
