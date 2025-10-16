import { BenefitsSection } from "@/components/landing/BenefitsSection";
import { CTASection } from "@/components/landing/CTASection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { Footer } from "@/components/landing/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { getServerSession } from "next-auth";

export default async function LandingPage() {
  const session = await getServerSession();
  const isAuthenticated = !!session;

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection isAuthenticated={isAuthenticated} />
      <FeaturesSection />
      <HowItWorksSection />
      <BenefitsSection />
      <CTASection isAuthenticated={isAuthenticated} />
      <Footer />
    </div>
  );
}
