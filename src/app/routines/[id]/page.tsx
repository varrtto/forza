"use client";

import { RoutineWithStudent } from "@/types";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useCallback, useEffect, useState } from "react";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function seriesLabel(count: number) {
  return count === 1 ? "1 serie" : `${count} series`;
}

function dayCountLabel(count: number) {
  return count === 1 ? "1 día" : `${count} días`;
}

function routineTypeLabel(type?: string, isFullBody?: boolean) {
  if (type === "pushPullLegs") return "Empuje / tirón / piernas";
  if (type === "fullBody" || isFullBody) return "Full body";
  if (type === "regular") return "Regular";
  return null;
}

export default function RoutineDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [routine, setRoutine] = useState<RoutineWithStudent | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
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

  const handleGeneratePDF = async () => {
    if (!routine) return;

    setIsGenerating(true);
    setError("");
    try {
      let avatarUrl;
      try {
        const profileResponse = await fetch("/api/user/profile");
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          avatarUrl = profileData.user.avatar_url;
        }
      } catch (profileError) {
        console.warn(
          "Could not fetch user profile for watermark:",
          profileError
        );
      }

      const { generatePDF } = await import("@/utils/generatePDF");
      await generatePDF(routine.routine_data, avatarUrl);
    } catch {
      setError("Error al generar el PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="gym-floor min-h-[calc(100vh-72px)]">
        <div className="mx-auto w-full max-w-3xl px-4 py-10 md:px-8 md:py-14">
          <p className="text-ink/70">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error && !routine) {
    return (
      <div className="gym-floor min-h-[calc(100vh-72px)]">
        <div className="mx-auto w-full max-w-3xl px-4 py-10 md:px-8 md:py-14">
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
        <div className="mx-auto w-full max-w-3xl px-4 py-10 md:px-8 md:py-14">
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

  const days = routine.routine_data?.days ?? [];
  const typeLabel = routineTypeLabel(
    routine.routine_data?.type,
    routine.routine_data?.isFullBody
  );
  const stats = [
    { label: "Alumno", value: routine.students.name },
    { label: "Días", value: String(days.length) },
    { label: "Creada", value: formatDate(routine.created_at) },
    routine.updated_at
      ? { label: "Actualizada", value: formatDate(routine.updated_at) }
      : null,
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="gym-floor min-h-[calc(100vh-72px)]">
      <div className="mx-auto w-full max-w-3xl px-4 py-10 md:px-8 md:py-14">
        <Link
          href={`/students/${routine.students.id}`}
          className="font-display text-base text-ink/65 underline decoration-tape decoration-2 underline-offset-4 transition-colors hover:text-ink"
        >
          {routine.students.name}
        </Link>
        <h1 className="mt-4 font-display text-5xl tracking-tight md:text-7xl">
          {routine.name || routine.routine_data?.name || "Rutina"}
        </h1>
        <p className="mt-3 flex flex-wrap gap-x-4 text-ink/65">
          {typeLabel && <span>{typeLabel}</span>}
          <span>{dayCountLabel(days.length)}</span>
        </p>

        <dl
          className={`gym-rail mt-8 grid ${
            stats.length === 4 ? "grid-cols-2 md:grid-cols-4" : "grid-cols-3"
          }`}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="border-floor/15 px-5 py-4 not-first:border-l max-md:[&:nth-child(odd)]:border-l-0 max-md:[&:nth-child(n+3)]:border-t"
            >
              <dt className="text-sm text-current/55">{stat.label}</dt>
              <dd className="mt-1 truncate font-display text-xl leading-none tracking-tight">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 flex flex-wrap items-center gap-5">
          <button
            type="button"
            onClick={handleGeneratePDF}
            disabled={isGenerating}
            className="inline-flex h-12 cursor-pointer items-center bg-tape px-5 font-display text-lg tracking-wide text-on-tape transition-colors hover:bg-tape/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tape disabled:opacity-50"
          >
            {isGenerating ? "Generando..." : "Generar PDF"}
          </button>
          <Link
            href={`/routines/${resolvedParams.id}/edit`}
            className="font-display text-base text-ink underline decoration-tape decoration-2 underline-offset-4"
          >
            Editar rutina
          </Link>
        </div>

        {error && <p className="mt-6 text-sm text-destructive">{error}</p>}

        {days.length === 0 ? (
          <p className="mt-16 max-w-md text-lg text-ink/70">
            Esta rutina todavía no tiene días.
          </p>
        ) : (
          <div className="mt-16 flex flex-col gap-14">
            {days.map((day) => (
              <section key={day.id}>
                <h2 className="border-b border-tape pb-2 font-display text-3xl tracking-tight md:text-4xl">
                  {day.name}
                </h2>
                {day.muscleGroups.length === 0 ? (
                  <p className="mt-4 text-ink/55">Sin grupos en este día.</p>
                ) : (
                  <div className="mt-6 flex flex-col gap-8">
                    {day.muscleGroups.map((muscleGroup) => (
                      <div key={muscleGroup.id}>
                        <h3 className="font-display text-xl tracking-tight">
                          {muscleGroup.name}
                        </h3>
                        {muscleGroup.exercises.length === 0 ? (
                          <p className="mt-2 text-sm text-ink/55">
                            Sin ejercicios.
                          </p>
                        ) : (
                          <ul className="mt-2">
                            {muscleGroup.exercises.map((exercise) => (
                              <li
                                key={exercise.id}
                                className="border-b border-ink/15 py-4"
                              >
                                <div className="flex items-baseline justify-between gap-4">
                                  <p className="font-display text-lg tracking-tight">
                                    {exercise.name || "Sin nombre"}
                                  </p>
                                  <p className="shrink-0 text-sm text-ink/55">
                                    {seriesLabel(exercise.series)}
                                  </p>
                                </div>
                                <ol className="mt-3 space-y-1 text-sm text-ink/70">
                                  {Array.from(
                                    { length: exercise.series },
                                    (_, i) => (
                                      <li key={i}>
                                        Serie {i + 1}: {exercise.reps[i] || 0}{" "}
                                        reps · {exercise.weight[i] || 0} kg
                                      </li>
                                    )
                                  )}
                                </ol>
                                {exercise.details && (
                                  <p className="mt-3 text-sm text-ink/55">
                                    {exercise.details}
                                  </p>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
