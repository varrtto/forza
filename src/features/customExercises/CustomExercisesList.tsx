"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useState } from "react";

export interface UserExercise {
  id: string;
  user_id: string;
  muscle_group: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export async function fetchCustomExercises(): Promise<UserExercise[]> {
  const response = await fetch("/api/exercises");
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Error al cargar ejercicios");
  }

  return data.exercises || [];
}

export const CustomExercisesList = () => {
  const queryClient = useQueryClient();
  const [actionError, setActionError] = useState<string | null>(null);

  const {
    data: exercises = [],
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: ["exercises"],
    queryFn: fetchCustomExercises,
  });

  const deleteExerciseMutation = useMutation({
    mutationFn: async (exerciseId: string) => {
      const response = await fetch(`/api/exercises/${exerciseId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al eliminar ejercicio");
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["exercises"] });
    },
    onError: (err) => {
      setActionError(err instanceof Error ? err.message : "Error de conexión");
    },
  });

  const handleDelete = (exerciseId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este ejercicio?")) {
      return;
    }

    setActionError(null);
    deleteExerciseMutation.mutate(exerciseId);
  };

  const errorMessage =
    actionError ?? (queryError instanceof Error ? queryError.message : null);

  const exercisesByMuscleGroup = exercises.reduce(
    (acc, exercise) => {
      if (!acc[exercise.muscle_group]) {
        acc[exercise.muscle_group] = [];
      }
      acc[exercise.muscle_group].push(exercise);
      return acc;
    },
    {} as Record<string, UserExercise[]>
  );

  const countLabel =
    exercises.length === 1
      ? "1 ejercicio"
      : `${exercises.length} ejercicios`;

  if (isLoading) {
    return <p className="mt-10 text-ink/70">Cargando...</p>;
  }

  if (errorMessage) {
    return <p className="mt-10 text-sm text-destructive">{errorMessage}</p>;
  }

  if (exercises.length === 0) {
    return (
      <p className="mt-8 max-w-md text-lg text-ink/70">
        Todavía no agregaste ejercicios propios. La biblioteca cubre lo básico;
        acá van los de tu gimnasio.
      </p>
    );
  }

  return (
    <div className="mt-10">
      <p className="text-ink/65">{countLabel}</p>
      <div className="mt-8 flex flex-col gap-12">
        {Object.entries(exercisesByMuscleGroup).map(
          ([muscleGroup, groupExercises]) => (
            <section key={muscleGroup}>
              <h2 className="border-b-2 border-tape pb-2 font-display text-3xl tracking-tight">
                {muscleGroup}
              </h2>
              <ul>
                {groupExercises.map((exercise) => (
                  <li
                    key={exercise.id}
                    className="flex items-center gap-3 border-b border-ink/10 py-3"
                  >
                    <span className="min-w-0 flex-1 text-lg text-ink/80">
                      {exercise.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDelete(exercise.id)}
                      disabled={deleteExerciseMutation.isPending}
                      aria-label={`Eliminar ${exercise.name}`}
                      className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center text-ink/40 transition-colors hover:text-destructive focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tape disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )
        )}
      </div>
    </div>
  );
};
