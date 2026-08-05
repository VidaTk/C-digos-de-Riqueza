// Local dev: "/api" pasa por el proxy de Vite (ver vite.config.ts) hacia
// localhost:4000. En Vercel, VITE_API_BASE_URL apunta directo al dominio
// del backend desplegado (ej. https://codigos-riqueza-api.vercel.app).
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

function getToken(): string | null {
  return localStorage.getItem("token");
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem("token", token);
  else localStorage.removeItem("token");
}

export function getRole(): string | null {
  return localStorage.getItem("role");
}

export function setRole(role: string | null) {
  if (role) localStorage.setItem("role", role);
  else localStorage.removeItem("role");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const message = body?.error ? JSON.stringify(body.error) : `Error ${res.status}`;
    throw new Error(message);
  }
  return body as T;
}

export interface RegisterInput {
  name: string;
  email: string;
  phone: string;
  estadoMx: string;
  curp: string;
  bankName: string;
  clabe: string;
  password: string;
  referredByPromoterCode?: string;
}

export interface AuthResponse {
  token: string;
  user: { id: string; name: string; email: string; promoterCode: string; role?: string };
}

export function register(input: RegisterInput) {
  return request<AuthResponse>("/auth/register", { method: "POST", body: JSON.stringify(input) });
}

export function login(email: string, password: string) {
  return request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export interface DashboardData {
  profile: {
    name: string;
    email: string;
    promoterCode: string;
    promoterLink: string;
    rank: string;
    xp: number;
    membershipStatus: string;
  };
  commissions: { thisMonth: number; lastMonth: number; allTime: number };
  network: { totalDirectReferrals: number };
  salesByProduct: Record<string, { count: number; amount: number }>;
  level2Sales: {
    buyerName: string;
    productName: string;
    soldBy: string;
    saleDate: string;
    myCommission: number;
    commissionStatus: string;
  }[];
  recentTransactions: {
    date: string;
    product: string;
    grossAmount: number;
    myCommission: number;
    status: string;
    commissionStatus: string;
  }[];
}

export function getDashboard() {
  return request<DashboardData>("/dashboard/me");
}

export interface CreateSaleInput {
  productCode: "libro" | "curso" | "curso_con_descuento" | "asesoria";
  buyerName: string;
  buyerEmail?: string;
  buyerPhone?: string;
  promoterEmail: string;
  saleDate: string;
  grossAmount: number;
  notes?: string;
}

export interface SaleResult {
  id: string;
  commissionL1PctApplied: string;
  commissionL1Amount: string;
  commissionL2Amount: string | null;
  commissionReleaseDate: string;
}

export function createSale(input: CreateSaleInput) {
  return request<SaleResult>("/sales", { method: "POST", body: JSON.stringify(input) });
}
