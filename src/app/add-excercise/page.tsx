import { AddExerciseForm } from "@/features/addExerciseForm";
import Link from "next/link";

const AddExcercisePage = () => (
  <div className="gym-floor min-h-[calc(100vh-72px)]">
    <div className="mx-auto w-full max-w-xl px-4 py-10 md:px-8 md:py-14">
      <Link
        href="/exercises"
        className="font-display text-base text-ink/65 underline decoration-tape decoration-2 underline-offset-4 transition-colors hover:text-ink"
      >
        Ver ejercicios
      </Link>
      <h1 className="mt-6 font-display text-5xl tracking-tight md:text-7xl">
        Agregar ejercicio
      </h1>
      <p className="mt-3 max-w-md text-lg text-ink/70">
        Un movimiento de tu gimnasio. Después lo elegís al armar una rutina.
      </p>
      <div className="mt-10">
        <AddExerciseForm />
      </div>
    </div>
  </div>
);

export default AddExcercisePage;
