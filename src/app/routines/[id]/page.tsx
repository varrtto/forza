"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RoutineWithStudent } from "@/types";
import { ArrowLeft, Calendar, FileText, Pencil } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { use, useCallback, useEffect, useState } from "react";

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
      // Fetch user profile to get avatar URL for watermark
      let avatarUrl;
      try {
        const profileResponse = await fetch("/api/user/profile");
        if (profileResponse.ok) {
        const profileData = await profileResponse.json();
          avatarUrl = profileData.user.avatar_url;
        }
      } catch (profileError) {
        console.warn("Could not fetch user profile for watermark:", profileError);
      }

  // Import generatePDF dynamically
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center justify-between mb-6 gap-4">
          <p className="text-xl font-bold">Rutina de</p>
          <p className="text-xl font-bold">{routine.students.name}</p>
          <div className="flex md:items-center justify-between md:justify-center md:gap-4 w-full">
            <Button
              onClick={() => router.push(`/students/${routine.students.id}`)}
              variant="outline"
              size="sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <Button
              onClick={() => router.push(`/routines/${resolvedParams.id}/edit`)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Pencil className="h-4 w-4" />
              Editar
            </Button>
            <Button
              onClick={handleGeneratePDF}
              variant="outline"
              className="flex items-center gap-2"
              disabled={isGenerating}
            >
              <FileText className="h-4 w-4" />
              {isGenerating ? "Generando..." : "Generar PDF"}
            </Button>
          </div>
          <div className="flex gap-2"></div>
        </div>

        {/* Routine Info */}
        <Card>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Creada:</p>
                <p className="font-medium">
                  {new Date(routine.created_at).toLocaleDateString()}
                </p>
              </div>

              {routine.updated_at && (
                <div>
                  <p className="text-muted-foreground">Última actualización:</p>
                  <p className="font-medium">
                    {new Date(routine.updated_at).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Routine Details */}
        <div className="space-y-6">
          {routine.routine_data.days?.map((day, dayIndex) => (
            <Card key={day.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Día {dayIndex + 1}: {day.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {day.muscleGroups.map((muscleGroup) => (
                    <div key={muscleGroup.id} className="space-y-4">
                      <h3 className="text-lg font-semibold text-primary">
                        {muscleGroup.name}
                      </h3>
                      <div className="space-y-3">
                        {muscleGroup.exercises.map((exercise) => (
                          <div
                            key={exercise.id}
                            className="border rounded-lg p-4 bg-muted/30"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium">{exercise.name}</h4>
                              <span className="text-sm text-muted-foreground">
                                {exercise.series} serie(s)
                              </span>
                            </div>

                            {/* Sets Table */}
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="border-b">
                                    <th className="text-left py-2">Serie</th>
                                    <th className="text-left py-2">Reps</th>
                                    <th className="text-left py-2">Peso</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {Array.from(
                                    { length: exercise.series },
                                    (_, i) => (
                                      <tr key={i} className="border-b">
                                        <td className="py-2">{i + 1}</td>
                                        <td className="py-2">
                                          {exercise.reps[i] || 0}
                                        </td>
                                        <td className="py-2">
                                          {exercise.weight[i] || 0} kg
                                        </td>
                                      </tr>
                                    )
                                  )}
                                </tbody>
                              </table>
                            </div>

                            {/* Exercise Details */}
                            {exercise.details && (
                              <div className="mt-3 pt-3 border-t">
                                <p className="text-sm text-muted-foreground">
                                  <strong>Detalles:</strong> {exercise.details}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
