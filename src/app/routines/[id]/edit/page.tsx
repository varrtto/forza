"use client";

import { AddRoutineForm } from "@/features/addRoutineForm";
import { RoutineWithStudent } from "@/types";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useCallback, useEffect, useState } from "react";

export default function EditRoutinePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [routine, setRoutine] = useState<RoutineWithStudent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const resolvedParams = use(params);

  const fetchRoutine = useCallback(async () => {
    try {
      const response = await fetch(`/api/routines/${resolvedParams.id}`);
      const data = await response.json();

      if (response.ok) {
        setRoutine(data.routine);
      } else {
        setError(data.error || "Error al cargar la rutina");
      }
    } catch {
      setError("Error de conexión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }, [resolvedParams.id]);

  useEffect(() => {
    if (!session?.user?.id) {
      router.push("/auth/signin");
      return;
    }

    fetchRoutine();
  }, [session, router, fetchRoutine]);

  if (loading) {
    return (
      <div className="gym-floor min-h-[calc(100vh-72px)]">
        <div className="mx-auto w-full max-w-2xl px-4 py-10 md:px-8 md:py-14">
          <p className="text-ink/70">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="gym-floor min-h-[calc(100vh-72px)]">
        <div className="mx-auto w-full max-w-2xl px-4 py-10 md:px-8 md:py-14">
          <p className="text-lg text-destructive">{error}</p>
          <Link
            href="/dashboard"
            className="mt-6 inline-block font-display text-lg text-ink underline decoration-tape decoration-2 underline-offset-4"
          >
            Ir a alumnos
          </Link>
        </div>
      </div>
    );
  }

  if (!routine) {
    return (
      <div className="gym-floor min-h-[calc(100vh-72px)]">
        <div className="mx-auto w-full max-w-2xl px-4 py-10 md:px-8 md:py-14">
          <h1 className="font-display text-5xl tracking-tight">
            Rutina no encontrada
          </h1>
          <Link
            href="/dashboard"
            className="mt-6 inline-block font-display text-lg text-ink underline decoration-tape decoration-2 underline-offset-4"
          >
            Ir a alumnos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="gym-floor min-h-[calc(100vh-72px)]">
      <div className="mx-auto w-full max-w-2xl px-4 py-10 md:px-8 md:py-14">
        <Link
          href={`/routines/${resolvedParams.id}`}
          className="font-display text-base text-ink/65 underline decoration-tape decoration-2 underline-offset-4 transition-colors hover:text-ink"
        >
          Cancelar
        </Link>
        <h1 className="mt-6 font-display text-5xl tracking-tight md:text-7xl">
          Editar rutina
        </h1>
        <p className="mt-3 max-w-md text-lg text-ink/70">
          {routine.students.name}
        </p>
        <div className="mt-10">
          <AddRoutineForm
            existingRoutine={routine.routine_data}
            routineId={resolvedParams.id}
          />
        </div>
      </div>
    </div>
  );
}
