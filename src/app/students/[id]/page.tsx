"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentWithRoutines } from "@/types";
import {
  ArrowLeft,
  Calendar,
  Mail,
  Pencil,
  Phone,
  Plus,
  Ruler,
  Scale,
  Trash2,
  User,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { use, useCallback, useEffect, useState } from "react";

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
        router.push("/");
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
        // Refresh the student data to update the routines list
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
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando estudiante...</p>
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

  if (!student) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Estudiante no encontrado</p>
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.push("/")}
              variant="outline"
              size="sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <h1 className="text-3xl font-bold">{student.name}</h1>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => router.push(`/students/${resolvedParams.id}/edit`)}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Pencil className="h-4 w-4" />
              Editar
            </Button>
            <Button
              onClick={handleDeleteStudent}
              variant="destructive"
              size="sm"
            >
              Eliminar Estudiante
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Información Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Edad</p>
                  <p className="font-medium">{student.age} años</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Género</p>
                  <p className="font-medium">{student.gender}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Altura</p>
                  <p className="font-medium flex items-center gap-1">
                    <Ruler className="h-4 w-4" />
                    {student.height} cm
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Peso</p>
                  <p className="font-medium flex items-center gap-1">
                    <Scale className="h-4 w-4" />
                    {student.weight} kg
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          {(student.email.length > 0 || student.phone.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Información de Contacto
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {student.email && (
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{student.email}</p>
                  </div>
                )}
                {student.phone && (
                  <div>
                    <p className="text-sm text-muted-foreground">Teléfono</p>
                    <p className="font-medium flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {student.phone}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Routines Section */}
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Rutinas ({student.routines.length})
              </CardTitle>
              {student.routines.length > 0 && (
                <Button
                  onClick={() =>
                    router.push(`/add-routine?studentId=${student.id}`)
                  }
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Nueva Rutina
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {student.routines.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Este estudiante no tiene rutinas creadas
                </p>
                <Button
                  onClick={() =>
                    router.push(`/add-routine?studentId=${student.id}`)
                  }
                  variant="outline"
                >
                  Crear Primera Rutina
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {student.routines.map((routine) => (
                  <div
                    key={routine.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{routine.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Creada:{" "}
                          {new Date(routine.created_at).toLocaleDateString()}
                        </p>
                        {routine.routine_data?.days && (
                          <p className="text-sm text-muted-foreground">
                            {routine.routine_data.days.length} día(s) de
                            entrenamiento
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => router.push(`/routines/${routine.id}`)}
                          variant="outline"
                          size="sm"
                        >
                          Ver Rutina
                        </Button>
                        <Button
                          onClick={() =>
                            router.push(`/routines/${routine.id}/edit`)
                          }
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <Pencil className="h-4 w-4" />
                          Editar
                        </Button>
                        <Button
                          onClick={() => handleDeleteRoutine(routine.id)}
                          variant="destructive"
                          size="sm"
                          className="flex items-center gap-1"
                        >
                          <Trash2 className="h-4 w-4" />
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
