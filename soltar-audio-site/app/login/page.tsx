import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/LoginForm";
import { SESSION_COOKIE_NAME } from "@/lib/env";
import { isSessionTokenValid } from "@/lib/session";

export default async function LoginPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (await isSessionTokenValid(token)) {
    redirect("/");
  }

  return (
    <main className="login-page">
      <div className="login-card">
        <h1 className="login-title">Soltar</h1>
        <p className="login-subtitle">Un espacio para acompañar tu proceso de duelo.</p>
        <LoginForm />
        <p className="login-footer">No Estás Rota, Estás en Duelo — Ely González</p>
      </div>
    </main>
  );
}
