import type { Metadata } from "next";
import WebinarLandingPage from "@/components/webinar/WebinarLandingPage";

export const metadata: Metadata = {
  title: "Webinar Gratuito: Cómo Construir un Equipo Que No Dependa de Ti",
  description:
    "En vivo y gratis: el sistema de 25 años para profesionalizar tu negocio de redes de mercadeo. 20 de agosto, 7:00 pm (CDMX).",
};

export default function WebinarEspecialPage() {
  return <WebinarLandingPage />;
}
