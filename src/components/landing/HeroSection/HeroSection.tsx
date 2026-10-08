import Image from "next/image";
import { HeroButtons } from "./HeroButtons/HeroButtons";

interface HeroSectionProps {
  isAuthenticated: boolean;
}

export function HeroSection({ isAuthenticated }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden px-4 py-16 md:px-8 md:py-28">
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero.webp"
          alt=""
          fill
          className="object-cover"
          priority
          quality={85}
          sizes="100vw"
        />
      </div>
      <div className="absolute inset-0 z-0 bg-ink/75" />

      <div className="relative z-10 mx-auto w-full max-w-5xl">
        <h1 className="max-w-3xl font-display text-5xl tracking-tight text-floor md:text-8xl">
          Alumnos y rutinas, listas para el piso.
        </h1>
        <p className="mt-6 max-w-md text-lg text-floor/80 md:text-xl">
          Anotá al alumno, armá la semana y descargá el PDF. Sin planillas.
        </p>
        <HeroButtons isAuthenticated={isAuthenticated} />
      </div>
    </section>
  );
}
