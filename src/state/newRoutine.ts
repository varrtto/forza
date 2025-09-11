import { create } from "zustand";

export interface Day {
  id: string;
  name: string;
  muscleGroups: MuscleGroup[];
}

export interface MuscleGroup {
  id: string;
  name: string;
  exercises: Exercise[];
}

export interface Exercise {
  id: string;
  name: string;
  series: number[];
  weight: number[];
}

export interface Routine {
  id: string;
  name: string;
  days: Day[];
}

export interface RoutineStore {
  routine: Routine;
  updateAlumnoName: (name: string) => void;
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
    setIndex: number,
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
                            series: [1],
                            weight: [0],
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
                          ex.id === exerciseId ? { ...ex, [field]: value } : ex
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
                                series: [...ex.series, 1],
                                weight: [...ex.weight, 0],
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
                                series: ex.series.filter(
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
    setIndex: number,
    reps: number
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
                                series: ex.series.map((s, i) =>
                                  i === setIndex ? reps : s
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
  saveRoutine: (routine: Routine) => set({ routine: routine }),
}));

export default useRoutineStore;
