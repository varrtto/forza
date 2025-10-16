"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface HeroSectionProps {
  isAuthenticated: boolean;
}

export function HeroSection({ isAuthenticated }: HeroSectionProps) {
  const router = useRouter();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      router.push("/auth/signin");
    }
  };

  return (
    <section className="relative px-4 py-20 md:py-32 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero.jpg"
          alt="Hero background"
          fill
          className="object-cover"
          priority
          quality={85}
          
        />
      </div>
      
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80 z-0" />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
            Gestiona tu gimnasio con{" "}
            <span className="text-yellow-500">Forza</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto">
            La plataforma completa para entrenadores personales. Crea rutinas,
            gestiona clases y genera rutinas profesionales en segundos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button 
              size="lg" 
              onClick={handleGetStarted} 
              className="text-lg px-8 bg-white text-black hover:bg-gray-100"
            >
              {isAuthenticated ? "Ir al Dashboard" : "Comenzar Ahora"}
            </Button>
            {!isAuthenticated && (
              <Button
                size="lg"
                variant="outline"
                asChild
                className="text-lg px-8 border-2 border-white bg-transparent !text-white hover:bg-white hover:!text-black transition-colors"
              >
                <Link href="/auth/signup">Crear Cuenta</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
