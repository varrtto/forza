import { CustomExercisesList } from "@/features/customExercises";
import Link from "next/link";

export default function ExercisesPage() {
  return (
    <div className="gym-floor min-h-[calc(100vh-72px)]">
      <div className="mx-auto w-full max-w-xl px-4 py-10 md:px-8 md:py-14">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-display text-5xl tracking-tight md:text-7xl">
              Ejercicios
            </h1>
            <p className="mt-3 max-w-md text-lg text-ink/70">
              Los que agregás vos, aparte de la biblioteca.
            </p>
          </div>
          <Link
            href="/add-excercise"
            className="inline-flex h-12 shrink-0 items-center justify-center bg-tape px-5 font-display text-lg tracking-wide text-on-tape transition-colors hover:bg-tape/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tape"
          >
            Agregar
          </Link>
        </div>
        <CustomExercisesList />
      </div>
    </div>
  );
}
