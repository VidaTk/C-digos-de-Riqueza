import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Lora } from "next/font/google";
import Script from "next/script";
import PixelEvents from "@/components/PixelEvents";
import "./globals.css";

const heading = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const body = Lora({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.yosoyliderprofesional.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Webinar Gratuito: Cómo Construir un Equipo Que No Dependa de Ti | Yo Soy Líder Profesional",
  description:
    "En vivo y gratis: el sistema de 25 años para profesionalizar tu negocio de redes de mercadeo. Regístrate al webinar del 20 de agosto, 7:00 pm (CDMX).",
  openGraph: {
    title: "Cómo Construir un Equipo Que No Dependa de Ti — Webinar Gratuito",
    description:
      "En vivo. Gratis. Con estructura lista para implementar. 20 de agosto, 7:00 pm (CDMX).",
    url: `${siteUrl}/webinar`,
    siteName: "Yo Soy Líder Profesional",
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cómo Construir un Equipo Que No Dependa de Ti — Webinar Gratuito",
    description:
      "En vivo. Gratis. Con estructura lista para implementar. 20 de agosto, 7:00 pm (CDMX).",
  },
};

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-MX" className={`${heading.variable} ${body.variable}`}>
      <body className="font-body">
        {PIXEL_ID && (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${PIXEL_ID}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}
        <PixelEvents />
        {children}
      </body>
    </html>
  );
}
