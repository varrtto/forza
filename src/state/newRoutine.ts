import { Day, Exercise, Routine, RoutineType } from "@/types";
import { create } from "zustand";

export interface RoutineStore {
  routine: Routine;
  updateAlumnoName: (name: string) => void;
  updateSelectedStudent: (studentId: string) => void;
  setRoutineType: (type: RoutineType) => void;
  resetRoutine: () => void;
  loadRoutine: (routine: Routine) => void;
  addDay: (day: Day) => void;
  removeDay: (id: string) => void;
  addMuscleGroup: (dayId: string, muscleGroupName: string) => void;
  removeMuscleGroup: (dayId: string, muscleGroupId: string) => void;
  addExercise: (dayId: string, muscleGroupId: string) => void;
  removeExercise: (
    dayId: string,
    muscleGroupId: string,
    exerciseId: string
  ) => void;
  updateExercise: (
    dayId: string,
    muscleGroupId: string,
    exerciseId: string,
    field: keyof Exercise,
    exerciseName: string,
    value: string | number
  ) => void;
  addSet: (dayId: string, muscleGroupId: string, exerciseId: string) => void;
  removeSet: (
    dayId: string,
    muscleGroupId: string,
    exerciseId: string,
    setIndex: number
  ) => void;
  updateSet: (
    dayId: string,
    muscleGroupId: string,
    exerciseId: string,
    reps: number[],
    weight: number[]
  ) => void;
  addReps: (dayId: string, muscleGroupId: string, exerciseId: string) => void;
  removeReps: (
    dayId: string,
    muscleGroupId: string,
    exerciseId: string,
    repsIndex: number
  ) => void;
  updateReps: (
    dayId: string,
    muscleGroupId: string,
    exerciseId: string,
    repsIndex: number,
    reps: number
  ) => void;
  addWeight: (dayId: string, muscleGroupId: string, exerciseId: string) => void;
  removeWeight: (
    dayId: string,
    muscleGroupId: string,
    exerciseId: string,
    weightIndex: number
  ) => void;
  updateWeight: (
    dayId: string,
    muscleGroupId: string,
    exerciseId: string,
    weightIndex: number,
    weight: number
  ) => void;
  updateDetails: (
    dayId: string,
    muscleGroupId: string,
    exerciseId: string,
    details: string
  ) => void;
  updateSeries: (
    dayId: string,
    muscleGroupId: string,
    exerciseId: string,
    series: number
  ) => void;
  saveRoutine: (routine: Routine) => void;
}

const useRoutineStore = create<RoutineStore>((set) => ({
  routine: {
    id: "",
    name: "",
    days: [],
  } as Routine,
  updateAlumnoName: (name: string) =>
    set((state) => ({
      routine: { ...state.routine, name: name },
    })),
  updateSelectedStudent: (studentId: string) =>
    set((state) => ({
      routine: { ...state.routine, studentId: studentId },
    })),
  setRoutineType: (type: RoutineType) =>
    set((state) => ({
      routine: { ...state.routine, type: type },
    })),
  resetRoutine: () =>
    set(() => ({
      routine: {
        id: "",
        name: "",
        studentId: undefined,
        days: [],
        type: "regular",
      } as Routine,
    })),
  loadRoutine: (routine: Routine) =>
    set(() => ({
      routine: routine,
    })),
  addDay: (day: Day) =>
    set((state) => ({
      routine: { ...state.routine, days: [...state.routine?.days, day] },
    })),
  removeDay: (id: string) =>
    set((state) => ({
      routine: {
        ...state.routine,
        days: state.routine?.days?.filter((d) => d.id !== id),
      },
    })),
  addMuscleGroup: (dayId: string, muscleGroupName: string) =>
    set((state) => ({
      routine: {
        ...state.routine,
        days: state.routine?.days?.map((d) =>
          d.id === dayId
            ? {
                ...d,
                muscleGroups: [
                  ...d.muscleGroups,
                  {
                    id: crypto.randomUUID(),
                    name: muscleGroupName,
                    exercises: [],
                  },
                ],
              }
            : d
        ),
      },
    })),
  removeMuscleGroup: (dayId: string, muscleGroupId: string) =>
    set((state) => ({
      routine: {
        ...state.routine,
        days: state.routine?.days?.map((d) =>
          d.id === dayId
            ? {
                ...d,
                muscleGroups: d.muscleGroups.filter(
                  (mg) => mg.id !== muscleGroupId
                ),
              }
            : d
        ),
      },
    })),
  addExercise: (dayId: string, muscleGroupId: string) =>
    set((state) => ({
      routine: {
        ...state.routine,
        days: state.routine?.days?.map((d) =>
          d.id === dayId
            ? {
                ...d,
                muscleGroups: d.muscleGroups.map((mg) =>
                  mg.id === muscleGroupId
                    ? {
                        ...mg,
                        exercises: [
                          ...mg.exercises,
                          {
                            id: crypto.randomUUID(),
                            name: "",
                            series: 1,
                            reps: [10], // Default reps value
                            weight: [0], // Default weight value
                            details: "",
                          },
                        ],
                      }
                    : mg
                ),
              }
            : d
        ),
      },
    })),
  removeExercise: (dayId: string, muscleGroupId: string, exerciseId: string) =>
    set((state) => ({
      routine: {
        ...state.routine,
        days: state.routine?.days?.map((d) =>
          d.id === dayId
            ? {
                ...d,
                muscleGroups: d.muscleGroups.map((mg) =>
                  mg.id === muscleGroupId
                    ? {
                        ...mg,
                        exercises: mg.exercises.filter(
                          (ex) => ex.id !== exerciseId
                        ),
                      }
                    : mg
                ),
              }
            : d
        ),
      },
    })),
  updateExercise: (
    dayId: string,
    muscleGroupId: string,
    exerciseId: string,
    field: keyof Exercise,
    exerciseName: string,
    value: string | number
  ) =>
    set((state) => ({
      routine: {
        ...state.routine,
        days: state.routine?.days?.map((d) =>
          d.id === dayId
            ? {
                ...d,
                muscleGroups: d.muscleGroups.map((mg) =>
                  mg.id === muscleGroupId
                    ? {
                        ...mg,
                        exercises: mg.exercises.map((ex) =>
                          ex.id === exerciseId
                            ? { ...ex, [field]: value, name: exerciseName }
                            : ex
                        ),
                      }
                    : mg
                ),
              }
            : d
        ),
      },
    })),
  addSet: (dayId: string, muscleGroupId: string, exerciseId: string) =>
    set((state) => ({
      routine: {
        ...state.routine,
        days: state.routine?.days?.map((d) =>
          d.id === dayId
            ? {
                ...d,
                muscleGroups: d.muscleGroups.map((mg) =>
                  mg.id === muscleGroupId
                    ? {
                        ...mg,
                        exercises: mg.exercises.map((ex) =>
                          ex.id === exerciseId
                            ? {
                                ...ex,
                                series: ex.series + 1,
                                reps: [...ex.reps, 10], // Add default reps value
                                weight: [...ex.weight, 0], // Add default weight value
                              }
                            : ex
                        ),
                      }
                    : mg
                ),
              }
            : d
        ),
      },
    })),
  removeSet: (
    dayId: string,
    muscleGroupId: string,
    exerciseId: string,
    setIndex: number
  ) =>
    set((state) => ({
      routine: {
        ...state.routine,
        days: state.routine?.days?.map((d) =>
          d.id === dayId
            ? {
                ...d,
                muscleGroups: d.muscleGroups.map((mg) =>
                  mg.id === muscleGroupId
                    ? {
                        ...mg,
                        exercises: mg.exercises.map((ex) =>
                          ex.id === exerciseId
                            ? {
                                ...ex,
                                series: Math.max(1, ex.series - 1), // Ensure minimum of 1 series
                                reps: ex.reps.filter((_, i) => i !== setIndex),
                                weight: ex.weight.filter(
                                  (_, i) => i !== setIndex
                                ),
                              }
                            : ex
                        ),
                      }
                    : mg
                ),
              }
            : d
        ),
      },
    })),
  updateSet: (
    dayId: string,
    muscleGroupId: string,
    exerciseId: string,
    reps: number[],
    weight: number[]
  ) =>
    set((state) => ({
      routine: {
        ...state.routine,
        days: state.routine.days.map((d) =>
          d.id === dayId
            ? {
                ...d,
                muscleGroups: d.muscleGroups.map((mg) =>
                  mg.id === muscleGroupId
                    ? {
                        ...mg,
                        exercises: mg.exercises.map((ex) =>
                          ex.id === exerciseId
                            ? {
                                ...ex,
                                reps: reps,
                                weight: weight,
                              }
                            : ex
                        ),
                      }
                    : mg
                ),
              }
            : d
        ),
      },
    })),
  addReps: (dayId: string, muscleGroupId: string, exerciseId: string) =>
    set((state) => ({
      routine: {
        ...state.routine,
        days: state.routine?.days?.map((d) =>
          d.id === dayId
            ? {
                ...d,
                muscleGroups: d.muscleGroups.map((mg) =>
                  mg.id === muscleGroupId
                    ? {
                        ...mg,
                        exercises: mg.exercises.map((ex) =>
                          ex.id === exerciseId
                            ? { ...ex, reps: [...ex.reps, 0] }
                            : ex
                        ),
                      }
                    : mg
                ),
              }
            : d
        ),
      },
    })),
  removeReps: (
    dayId: string,
    muscleGroupId: string,
    exerciseId: string,
    repsIndex: number
  ) =>
    set((state) => ({
      routine: {
        ...state.routine,
        days: state.routine?.days?.map((d) =>
          d.id === dayId
            ? {
                ...d,
                muscleGroups: d.muscleGroups.map((mg) =>
                  mg.id === muscleGroupId
                    ? {
                        ...mg,
                        exercises: mg.exercises.map((ex) =>
                          ex.id === exerciseId
                            ? {
                                ...ex,
                                reps: ex.reps.filter((_, i) => i !== repsIndex),
                              }
                            : ex
                        ),
                      }
                    : mg
                ),
              }
            : d
        ),
      },
    })),
  updateReps: (
    dayId: string,
    muscleGroupId: string,
    exerciseId: string,
    repsIndex: number,
    reps: number
  ) =>
    set((state) => ({
      routine: {
        ...state.routine,
        days: state.routine?.days?.map((d) =>
          d.id === dayId
            ? {
                ...d,
                muscleGroups: d.muscleGroups.map((mg) =>
                  mg.id === muscleGroupId
                    ? {
                        ...mg,
                        exercises: mg.exercises.map((ex) =>
                          ex.id === exerciseId
                            ? {
                                ...ex,
                                reps: ex.reps.map((r, i) =>
                                  i === repsIndex ? reps : r
                                ),
                              }
                            : ex
                        ),
                      }
                    : mg
                ),
              }
            : d
        ),
      },
    })),
  addWeight: (dayId: string, muscleGroupId: string, exerciseId: string) =>
    set((state) => ({
      routine: {
        ...state.routine,
        days: state.routine?.days?.map((d) =>
          d.id === dayId
            ? {
                ...d,
                muscleGroups: d.muscleGroups.map((mg) =>
                  mg.id === muscleGroupId
                    ? {
                        ...mg,
                        exercises: mg.exercises.map((ex) =>
                          ex.id === exerciseId
                            ? { ...ex, weight: [...ex.weight, 0] }
                            : ex
                        ),
                      }
                    : mg
                ),
              }
            : d
        ),
      },
    })),
  removeWeight: (
    dayId: string,
    muscleGroupId: string,
    exerciseId: string,
    weightIndex: number
  ) =>
    set((state) => ({
      routine: {
        ...state.routine,
        days: state.routine?.days?.map((d) =>
          d.id === dayId
            ? {
                ...d,
                muscleGroups: d.muscleGroups.map((mg) =>
                  mg.id === muscleGroupId
                    ? {
                        ...mg,
                        exercises: mg.exercises.map((ex) =>
                          ex.id === exerciseId
                            ? {
                                ...ex,
                                weight: ex.weight.filter(
                                  (_, i) => i !== weightIndex
                                ),
                              }
                            : ex
                        ),
                      }
                    : mg
                ),
              }
            : d
        ),
      },
    })),
  updateWeight: (
    dayId: string,
    muscleGroupId: string,
    exerciseId: string,
    weightIndex: number,
    weight: number
  ) =>
    set((state) => ({
      routine: {
        ...state.routine,
        days: state.routine.days.map((d) =>
          d.id === dayId
            ? {
                ...d,
                muscleGroups: d.muscleGroups.map((mg) =>
                  mg.id === muscleGroupId
                    ? {
                        ...mg,
                        exercises: mg.exercises.map((ex) =>
                          ex.id === exerciseId
                            ? {
                                ...ex,
                                weight: ex.weight.map((w, i) =>
                                  i === weightIndex ? weight : w
                                ),
                              }
                            : ex
                        ),
                      }
                    : mg
                ),
              }
            : d
        ),
      },
    })),
  updateDetails: (
    dayId: string,
    muscleGroupId: string,
    exerciseId: string,
    details: string
  ) =>
    set((state) => ({
      routine: {
        ...state.routine,
        days: state.routine?.days?.map((d) =>
          d.id === dayId
            ? {
                ...d,
                muscleGroups: d.muscleGroups.map((mg) =>
                  mg.id === muscleGroupId
                    ? {
                        ...mg,
                        exercises: mg.exercises.map((ex) =>
                          ex.id === exerciseId
                            ? { ...ex, details: details }
                            : ex
                        ),
                      }
                    : mg
                ),
              }
            : d
        ),
      },
    })),
  updateSeries: (
    dayId: string,
    muscleGroupId: string,
    exerciseId: string,
    series: number
  ) =>
    set((state) => ({
      routine: {
        ...state.routine,
        days: state.routine?.days?.map((d) =>
          d.id === dayId
            ? {
                ...d,
                muscleGroups: d.muscleGroups.map((mg) =>
                  mg.id === muscleGroupId
                    ? {
                        ...mg,
                        exercises: mg.exercises.map((ex) =>
                          ex.id === exerciseId
                            ? {
                                ...ex,
                                series: Math.max(1, series), // Ensure minimum of 1 series
                                reps: Array.from(
                                  { length: Math.max(1, series) },
                                  (_, i) =>
                                    i < ex.reps.length ? ex.reps[i] : 10 // Keep existing values, add defaults for new positions
                                ),
                                weight: Array.from(
                                  { length: Math.max(1, series) },
                                  (_, i) =>
                                    i < ex.weight.length ? ex.weight[i] : 0 // Keep existing values, add defaults for new positions
                                ),
                              }
                            : ex
                        ),
                      }
                    : mg
                ),
              }
            : d
        ),
      },
    })),

  saveRoutine: (routine: Routine) => set({ routine: routine }),
}));

export default useRoutineStore;
