"use client";

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
    <div className="mt-10 flex flex-wrap items-center gap-5">
      <button
        type="button"
        onClick={handleGetStarted}
        className="inline-flex h-12 cursor-pointer items-center bg-tape px-5 font-display text-lg tracking-wide text-on-tape transition-colors hover:bg-tape/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tape"
      >
        {isAuthenticated ? "Ir a alumnos" : "Empezar"}
      </button>
      {!isAuthenticated && (
        <Link
          href="/auth/signup"
          className="font-display text-lg text-floor underline decoration-tape decoration-2 underline-offset-4"
        >
          Crear cuenta
        </Link>
      )}
    </div>
  );
}
