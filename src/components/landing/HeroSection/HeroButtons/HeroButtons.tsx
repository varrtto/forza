"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface HeroButtonsProps {
  isAuthenticated: boolean;
}

export function HeroButtons({ isAuthenticated }: HeroButtonsProps) {
  const router = useRouter();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      router.push("/auth/signin");
    }
  };
  return (
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
  );
}
