"use client";

import { AddStudentForm } from "@/features/addStudentForm";
import type { Student } from "@/types";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useCallback, useEffect, useState } from "react";

export default function EditStudentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
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

  if (loading) {
    return (
      <div className="gym-floor min-h-[calc(100vh-72px)]">
        <div className="mx-auto w-full max-w-xl px-4 py-10 md:px-8 md:py-14">
          <p className="text-ink/70">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="gym-floor min-h-[calc(100vh-72px)]">
        <div className="mx-auto w-full max-w-xl px-4 py-10 md:px-8 md:py-14">
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
        <div className="mx-auto w-full max-w-xl px-4 py-10 md:px-8 md:py-14">
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

  return (
    <div className="gym-floor min-h-[calc(100vh-72px)]">
      <div className="mx-auto w-full max-w-xl px-4 py-10 md:px-8 md:py-14">
        <Link
          href={`/students/${resolvedParams.id}`}
          className="font-display text-base text-ink/65 underline decoration-tape decoration-2 underline-offset-4 transition-colors hover:text-ink"
        >
          Volver a la ficha
        </Link>
        <h1 className="mt-6 font-display text-5xl tracking-tight md:text-7xl">
          Editar alumno
        </h1>
        <p className="mt-3 max-w-md text-lg text-ink/70">{student.name}</p>
        <div className="mt-10">
          <AddStudentForm
            existingStudent={student}
            studentId={resolvedParams.id}
          />
        </div>
      </div>
    </div>
  );
}
