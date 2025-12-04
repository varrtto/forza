import { useEffect, useState, useCallback } from "react";
import { EXERCISES_BY_MUSCLE_GROUP } from "@/features/addRoutineForm/addRoutineForm.constants";

interface UserExercise {
  id: string;
  user_id: string;
  muscle_group: string;
  name: string;
  created_at: string;
  updated_at: string;
}

// Shared cache to prevent duplicate API calls across component instances
let exercisesCache: UserExercise[] | null = null;
let isLoadingCache = false;
let fetchPromise: Promise<UserExercise[]> | null = null;

export const useExercises = () => {
  const [customExercises, setCustomExercises] = useState<UserExercise[]>(
    exercisesCache || []
  );
  const [isLoading, setIsLoading] = useState(!exercisesCache);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomExercises = useCallback(async () => {
    // If already loading, wait for existing promise
    if (fetchPromise) {
      try {
        const data = await fetchPromise;
        setCustomExercises(data);
        setIsLoading(false);
        return;
      } catch (err) {
        // Continue to fetch on error
      }
    }

    // If cache exists, use it
    if (exercisesCache) {
      setCustomExercises(exercisesCache);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      isLoadingCache = true;

      // Create shared promise for concurrent calls
      fetchPromise = fetch("/api/exercises")
        .then(async (response) => {
          if (!response.ok) {
            const data = await response.json();
            throw new Error(
              data.error || "Error al cargar ejercicios personalizados"
            );
          }
          const data = await response.json();
          const exercises = data.exercises || [];
          exercisesCache = exercises;
          return exercises;
        })
        .finally(() => {
          isLoadingCache = false;
          fetchPromise = null;
        });

      const exercises = await fetchPromise;
      setCustomExercises(exercises);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error de conexión");
      // Don't block the UI if custom exercises fail to load
      setCustomExercises([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomExercises();
  }, [fetchCustomExercises]);

  // Get exercises for a specific muscle group, merging default and custom
  const getExercisesForMuscleGroup = (muscleGroupName: string): string[] => {
    const defaultExercises =
      EXERCISES_BY_MUSCLE_GROUP[
        muscleGroupName as keyof typeof EXERCISES_BY_MUSCLE_GROUP
      ] || [];

    const customExercisesForGroup = customExercises
      .filter((ex) => ex.muscle_group === muscleGroupName)
      .map((ex) => ex.name);

    // Merge and remove duplicates, keeping custom exercises first
    const merged = [
      ...new Set([...customExercisesForGroup, ...defaultExercises]),
    ];

    return merged;
  };

  const refetch = useCallback(() => {
    exercisesCache = null;
    fetchPromise = null;
    fetchCustomExercises();
  }, [fetchCustomExercises]);

  return {
    customExercises,
    isLoading,
    error,
    getExercisesForMuscleGroup,
    refetch,
  };
};

