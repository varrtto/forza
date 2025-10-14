"use client";

import { Button } from "@/components/ui/button";
import { AddRoutineForm } from "@/features/addRoutineForm";
import { RoutineWithStudent } from "@/types";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
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
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando rutina...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => router.push("/")} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  if (!routine) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Rutina no encontrada</p>
          <Button onClick={() => router.push("/")} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans min-h-screen items-center justify-items-center pt-10 px-4 md:px-0">
      <div className="w-full max-w-xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            onClick={() => router.push(`/routines/${resolvedParams.id}`)}
            variant="outline"
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Editar Rutina</h1>
            <p className="text-muted-foreground text-sm">
              {routine.name} - {routine.students.name}
            </p>
          </div>
        </div>

        {/* Edit Form */}
        <AddRoutineForm
          existingRoutine={routine.routine_data}
          routineId={resolvedParams.id}
        />
      </div>
    </div>
  );
}
