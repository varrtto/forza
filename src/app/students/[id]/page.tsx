"use client";

import { StudentWithRoutines } from "@/types";
import { Pencil, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useCallback, useEffect, useState } from "react";

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function dayCountLabel(count: number) {
  if (count === 1) return "1 día";
  return `${count} días`;
}

export default function StudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [student, setStudent] = useState<StudentWithRoutines | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const resolvedParams = use(params);

  const fetchStudent = useCallback(async () => {
    try {
      const response = await fetch(`/api/students/${resolvedParams.id}`);
      const data = await response.json();

      if (response.ok) {
        setStudent(data.student);
      } else {
        setError(data.error || "Error al cargar el estudiante");
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

    fetchStudent();
  }, [session, router, fetchStudent]);

  const handleDeleteStudent = async () => {
    if (
      !confirm(
        "¿Estás seguro de que quieres eliminar este estudiante? Esta acción no se puede deshacer."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/students/${resolvedParams.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/dashboard");
      } else {
        const data = await response.json();
        setError(data.error || "Error al eliminar el estudiante");
      }
    } catch {
      setError("Error de conexión. Intenta nuevamente.");
    }
  };

  const handleDeleteRoutine = async (routineId: string) => {
    if (
      !confirm(
        "¿Estás seguro de que quieres eliminar esta rutina? Esta acción no se puede deshacer."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/routines/${routineId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchStudent();
      } else {
        const data = await response.json();
        setError(data.error || "Error al eliminar la rutina");
      }
    } catch {
      setError("Error de conexión. Intenta nuevamente.");
    }
  };

  if (loading) {
    return (
      <div className="gym-floor min-h-[calc(100vh-72px)]">
        <div className="mx-auto w-full max-w-5xl px-4 py-10 md:px-8 md:py-14">
          <p className="text-ink/70">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error && !student) {
    return (
      <div className="gym-floor min-h-[calc(100vh-72px)]">
        <div className="mx-auto w-full max-w-5xl px-4 py-10 md:px-8 md:py-14">
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

  if (!student) {
    return (
      <div className="gym-floor min-h-[calc(100vh-72px)]">
        <div className="mx-auto w-full max-w-5xl px-4 py-10 md:px-8 md:py-14">
          <h1 className="font-display text-5xl tracking-tight">
            Alumno no encontrado
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

  const stats = [
    { label: "Edad", value: `${student.age}` },
    { label: "cm", value: `${student.height}` },
    { label: "kg", value: `${student.weight}` },
    { label: "Género", value: student.gender },
  ];

  const contact = [student.email, student.phone].filter(Boolean).join("  ");
  const routinesCount = student.routines.length;
  const routinesLabel =
    routinesCount === 1 ? "1 rutina" : `${routinesCount} rutinas`;

  return (
    <div className="gym-floor min-h-[calc(100vh-72px)]">
      <div className="mx-auto w-full max-w-5xl px-4 py-10 md:px-8 md:py-14">
        <div className="flex items-start gap-4 md:gap-6">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center bg-ink font-display text-2xl text-floor md:h-20 md:w-20 md:text-3xl dark:bg-tape dark:text-on-tape">
            {initials(student.name)}
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-5xl tracking-tight md:text-7xl">
              {student.name}
            </h1>
            {contact && (
              <p className="mt-3 truncate text-ink/60">{contact}</p>
            )}
          </div>
        </div>

        <dl className="gym-rail mt-8 grid grid-cols-2 md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="border-floor/15 px-5 py-4 not-first:border-l max-md:[&:nth-child(odd)]:border-l-0 max-md:[&:nth-child(n+3)]:border-t"
            >
              <dt className="text-sm text-current/55">{stat.label}</dt>
              <dd className="mt-1 font-display text-3xl leading-none tracking-tight">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 flex flex-wrap items-center gap-5">
          <Link
            href={`/students/${resolvedParams.id}/edit`}
            className="font-display text-base text-ink underline decoration-tape decoration-2 underline-offset-4"
          >
            Editar ficha
          </Link>
          <button
            type="button"
            onClick={handleDeleteStudent}
            className="cursor-pointer font-display text-base text-ink/45 transition-colors hover:text-destructive"
          >
            Eliminar alumno
          </button>
        </div>

        {error && <p className="mt-6 text-sm text-destructive">{error}</p>}

        <section className="mt-16">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-display text-4xl tracking-tight md:text-5xl">
                Rutinas
              </h2>
              <p className="mt-2 text-ink/65">{routinesLabel}</p>
            </div>
            {routinesCount > 0 && (
              <Link
                href={`/add-routine?studentId=${student.id}`}
                className="inline-flex h-12 shrink-0 items-center justify-center bg-tape px-5 font-display text-lg tracking-wide text-on-tape transition-colors hover:bg-tape/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tape"
              >
                Nueva rutina
              </Link>
            )}
          </div>

          {routinesCount === 0 ? (
            <div className="mt-8">
              <p className="max-w-md text-lg text-ink/70">
                Todavía no hay una rutina para este alumno.
              </p>
              <Link
                href={`/add-routine?studentId=${student.id}`}
                className="mt-6 inline-flex h-12 items-center bg-tape px-5 font-display text-lg tracking-wide text-on-tape transition-colors hover:bg-tape/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tape"
              >
                Armar primera rutina
              </Link>
            </div>
          ) : (
            <ul className="mt-6">
              {student.routines.map((routine) => {
                const days = routine.routine_data?.days?.length ?? 0;
                return (
                  <li
                    key={routine.id}
                    className="group relative border-b border-ink/15"
                  >
                    <Link
                      href={`/routines/${routine.id}`}
                      className="block py-5 pr-24 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tape"
                    >
                      <span className="block font-display text-2xl leading-none tracking-tight md:text-3xl">
                        {routine.name}
                      </span>
                      <span className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink/65">
                        <span>{formatDate(routine.created_at)}</span>
                        {days > 0 && <span>{dayCountLabel(days)}</span>}
                      </span>
                    </Link>
                    <div className="absolute top-5 right-0 flex items-center gap-1">
                      <Link
                        href={`/routines/${routine.id}/edit`}
                        aria-label={`Editar ${routine.name}`}
                        className="flex h-9 w-9 items-center justify-center text-ink/40 transition-colors hover:text-ink"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDeleteRoutine(routine.id)}
                        aria-label={`Eliminar ${routine.name}`}
                        className="flex h-9 w-9 cursor-pointer items-center justify-center text-ink/40 transition-colors hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
