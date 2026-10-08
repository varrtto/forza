import { AddStudentForm } from "@/features/addStudentForm";
import Link from "next/link";

export default function AddStudent() {
  return (
    <div className="gym-floor min-h-[calc(100vh-72px)]">
      <div className="mx-auto w-full max-w-xl px-4 py-10 md:px-8 md:py-14">
        <Link
          href="/dashboard"
          className="font-display text-base text-ink/65 underline decoration-tape decoration-2 underline-offset-4 transition-colors hover:text-ink"
        >
          Volver a alumnos
        </Link>
        <h1 className="mt-6 font-display text-5xl tracking-tight md:text-7xl">
          Agregar alumno
        </h1>
        <p className="mt-3 max-w-md text-lg text-ink/70">
          Nombre, medidas y contacto. Con eso alcanza para armar la ficha.
        </p>
        <div className="mt-10">
          <AddStudentForm />
        </div>
      </div>
    </div>
  );
}
