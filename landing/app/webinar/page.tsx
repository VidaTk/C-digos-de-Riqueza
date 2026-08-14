import type { Metadata } from "next";
import Hero from "@/components/webinar/Hero";
import ProblemSection from "@/components/webinar/ProblemSection";
import RootCauses from "@/components/webinar/RootCauses";
import SolutionTeaser from "@/components/webinar/SolutionTeaser";
import ResultsSection from "@/components/webinar/ResultsSection";
import BenefitsList from "@/components/webinar/BenefitsList";
import OfferSection from "@/components/webinar/OfferSection";
import UrgencyBar from "@/components/webinar/UrgencyBar";
import FaqAccordion from "@/components/webinar/FaqAccordion";
import AboutSection from "@/components/webinar/AboutSection";
import FinalCta from "@/components/webinar/FinalCta";
import RegisterFormSection from "@/components/webinar/RegisterFormSection";

export const metadata: Metadata = {
  title: "Webinar Gratuito: Cómo Construir un Equipo Que No Dependa de Ti",
  description:
    "En vivo y gratis: el sistema de 25 años para profesionalizar tu negocio de redes de mercadeo. 20 de agosto, 7:00 pm (CDMX).",
};

export default function WebinarPage() {
  return (
    <main>
      <Hero />

      <RegisterFormSection id="registro" ubicacion="hero" />

      <ProblemSection />

      <RegisterFormSection
        ubicacion="problema"
        titulo="Regístrate antes de que se acaben los lugares"
        className="bg-navy/[0.03] px-6 py-16 sm:py-20"
      />

      <RootCauses />
      <SolutionTeaser />
      <ResultsSection />
      <BenefitsList />
      <OfferSection />
      <UrgencyBar />
      <FaqAccordion />
      <AboutSection />

      <RegisterFormSection
        ubicacion="final"
        titulo="Última oportunidad — regístrate gratis"
      />

      <FinalCta />
    </main>
  );
}
