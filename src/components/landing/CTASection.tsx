"use client";

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
      router.push("/auth/signup");
    }
  };

  return (
    <section className="gym-rail px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto w-full max-w-5xl">
        <h2 className="max-w-xl font-display text-4xl tracking-tight md:text-6xl">
          Empezá con tu primer alumno.
        </h2>
        <p className="mt-4 max-w-md text-lg text-current/70">
          Creá la cuenta, cargá la ficha y armá la semana.
        </p>
        <button
          type="button"
          onClick={handleGetStarted}
          className="mt-10 inline-flex h-12 cursor-pointer items-center bg-tape px-5 font-display text-lg tracking-wide text-on-tape transition-colors hover:bg-tape/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tape"
        >
          {isAuthenticated ? "Ir a alumnos" : "Crear cuenta"}
        </button>
      </div>
    </section>
  );
}
