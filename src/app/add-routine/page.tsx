"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { AddRoutineForm } from "../../features/addRoutineForm";

function AddRoutineContent() {
  const searchParams = useSearchParams();
  const studentId = searchParams.get("studentId");

  return (
    <div className="gym-floor min-h-[calc(100vh-72px)]">
      <div className="mx-auto w-full max-w-2xl px-4 py-10 md:px-8 md:py-14">
        {studentId && (
          <Link
            href={`/students/${studentId}`}
            className="font-display text-base text-ink/65 underline decoration-tape decoration-2 underline-offset-4 transition-colors hover:text-ink"
          >
            Volver a la ficha
          </Link>
        )}
        <h1
          className={`font-display text-5xl tracking-tight md:text-7xl ${
            studentId ? "mt-6" : ""
          }`}
        >
          Nueva rutina
        </h1>
        <p className="mt-3 max-w-md text-lg text-ink/70">
          Elegí el tipo, sumá los días y cargá los ejercicios.
        </p>
        <div className="mt-10">
          <AddRoutineForm preSelectedStudentId={studentId} />
        </div>
      </div>
    </div>
  );
}

export default function AddRoutine() {
  return (
    <Suspense
      fallback={<p className="gym-floor p-10 text-ink/70">Cargando...</p>}
    >
      <AddRoutineContent />
    </Suspense>
  );
}
