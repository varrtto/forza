"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface CTASectionProps {
  isAuthenticated: boolean;
}

export function CTASection({ isAuthenticated }: CTASectionProps) {
  const router = useRouter();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      router.push("/auth/signin");
    }
  };

  return (
    <section className="px-4 py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto max-w-4xl text-center space-y-6">
        <h2 className="text-3xl md:text-4xl font-bold">
          ¿Listo para simplificar tu trabajo?
        </h2>
        <p className="text-xl opacity-90">
          Únete a los entrenadores que ya están ahorrando tiempo con Forza
        </p>
        <div className="pt-4">
          <Button 
            size="lg" 
            variant="secondary" 
            onClick={handleGetStarted}
            className="text-lg px-8"
          >
            {isAuthenticated ? "Ir al Dashboard" : "Comenzar Gratis"}
          </Button>
        </div>
      </div>
    </section>
  );
}
