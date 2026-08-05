import { useEffect, useState } from "react";
import { DashboardData, getDashboard } from "../api";

const mxn = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" });

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch((err) => setError((err as Error).message));
  }, []);

  if (error) return <div className="card error">Error: {error}</div>;
  if (!data) return <div className="card">Cargando...</div>;

  function copyLink() {
    navigator.clipboard.writeText(data!.profile.promoterLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="dashboard">
      <div className="card">
        <h1>Hola, {data.profile.name}</h1>
        <div className="promoter-link">
          <code>{data.profile.promoterLink}</code>
          <button onClick={copyLink}>{copied ? "¡Copiado!" : "Copiar enlace"}</button>
        </div>
        <p className="hint">
          Rango: <strong>{data.profile.rank}</strong> · XP: {data.profile.xp} · Membresía:{" "}
          <strong>{data.profile.membershipStatus}</strong>
        </p>
      </div>

      <div className="grid-3">
        <StatCard label="Comisiones este mes" value={mxn.format(data.commissions.thisMonth)} />
        <StatCard label="Mes anterior" value={mxn.format(data.commissions.lastMonth)} />
        <StatCard label="Histórico total" value={mxn.format(data.commissions.allTime)} />
      </div>

      <div className="grid-2">
        <div className="card">
          <h2>Mi red (nivel 1)</h2>
          <p>{data.network.totalDirectReferrals} personas referidas directamente</p>
        </div>
        <div className="card">
          <h2>Mis ventas por producto</h2>
          {Object.keys(data.salesByProduct).length === 0 && <p className="hint">Sin ventas todavía</p>}
          <ul className="plain-list">
            {Object.entries(data.salesByProduct).map(([product, stats]) => (
              <li key={product}>
                {product}: {stats.count} ({mxn.format(stats.amount)})
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card">
        <h2>Comisiones de 2do nivel (mi red)</h2>
        {data.level2Sales.length === 0 && <p className="hint">Sin comisiones de 2do nivel todavía</p>}
        {data.level2Sales.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Comprador</th>
                <th>Producto</th>
                <th>Vendido por</th>
                <th>Fecha</th>
                <th>Mi comisión</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {data.level2Sales.map((s, i) => (
                <tr key={i}>
                  <td>{s.buyerName}</td>
                  <td>{s.productName}</td>
                  <td>{s.soldBy}</td>
                  <td>{new Date(s.saleDate).toLocaleDateString("es-MX")}</td>
                  <td>{mxn.format(s.myCommission)}</td>
                  <td>{s.commissionStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card">
        <h2>Últimas transacciones</h2>
        {data.recentTransactions.length === 0 && <p className="hint">Sin transacciones todavía</p>}
        {data.recentTransactions.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Producto</th>
                <th>Monto bruto</th>
                <th>Mi comisión</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {data.recentTransactions.map((t, i) => (
                <tr key={i}>
                  <td>{new Date(t.date).toLocaleDateString("es-MX")}</td>
                  <td>{t.product}</td>
                  <td>{mxn.format(t.grossAmount)}</td>
                  <td>{mxn.format(t.myCommission)}</td>
                  <td>{t.commissionStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="card stat-card">
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
    </div>
  );
}
