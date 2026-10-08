import { Combobox } from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useExercises } from "@/hooks/useExercises";
import useRoutineStore from "@/state/newRoutine";
import { Day, MuscleGroup } from "@/types";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useMemo } from "react";

const comboClass =
  "h-11 rounded-none border-0 border-b border-ink/25 bg-transparent px-0 shadow-none hover:bg-transparent focus-visible:border-tape";
const setInputClass =
  "h-9 w-14 rounded-none border-0 border-b border-ink/25 bg-transparent px-0 text-center shadow-none focus-visible:border-tape focus-visible:ring-0";
const labelClass = "font-display text-sm text-ink/70";

export const MuscleGroupCard = ({
  muscleGroup,
  day,
}: {
  muscleGroup: MuscleGroup;
  day: Day;
}) => {
  const {
    addExercise,
    removeExercise,
    removeMuscleGroup,
    updateExercise,
    updateWeight,
    addSet,
    removeSet,
    updateReps,
    updateDetails,
  } = useRoutineStore();

  const { getExercisesForMuscleGroup } = useExercises();

  const availableExercises = useMemo(
    () => getExercisesForMuscleGroup(muscleGroup.name),
    [muscleGroup.name, getExercisesForMuscleGroup]
  );
  const exerciseOptions = useMemo(
    () =>
      availableExercises.map((exerciseName) => ({
        value: exerciseName,
        label: exerciseName,
      })),
    [availableExercises]
  );

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-xl tracking-tight">
          {muscleGroup.name}
        </h3>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => addExercise(day.id, muscleGroup.id)}
            className="h-9 cursor-pointer px-2 font-display text-sm text-ink underline decoration-tape decoration-2 underline-offset-4"
          >
            Ejercicio
          </button>
          <button
            type="button"
            onClick={() => removeMuscleGroup(day.id, muscleGroup.id)}
            aria-label={`Quitar ${muscleGroup.name}`}
            className="flex h-9 w-9 cursor-pointer items-center justify-center text-ink/40 transition-colors hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {muscleGroup.exercises.length === 0 ? (
        <p className="mt-3 text-sm text-ink/55">Sin ejercicios todavía.</p>
      ) : (
        <ul className="mt-3">
          {muscleGroup.exercises.map((exercise) => (
            <li key={exercise.id} className="relative border-b border-ink/15 py-5">
              <button
                type="button"
                onClick={() =>
                  removeExercise(day.id, muscleGroup.id, exercise.id)
                }
                aria-label="Eliminar ejercicio"
                className="absolute top-4 right-0 flex h-9 w-9 cursor-pointer items-center justify-center text-ink/40 transition-colors hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              <div className="pr-10">
                <Label
                  htmlFor={`exercise-name-${exercise.id}`}
                  className={labelClass}
                >
                  Ejercicio
                </Label>
                <Combobox
                  id={`exercise-name-${exercise.id}`}
                  className={`mt-1 ${comboClass}`}
                  value={exercise.name}
                  allowClear={false}
                  options={
                    exercise.name &&
                    !exerciseOptions.some(
                      (option) => option.value === exercise.name
                    )
                      ? [
                          { value: exercise.name, label: exercise.name },
                          ...exerciseOptions,
                        ]
                      : exerciseOptions
                  }
                  placeholder="Elegir ejercicio"
                  searchPlaceholder="Buscar ejercicio"
                  emptyText="No se encontró el ejercicio."
                  onValueChange={(value) => {
                    if (!value) return;
                    updateExercise(
                      day.id,
                      muscleGroup.id,
                      exercise.id,
                      "name",
                      value,
                      exercise.name
                    );
                  }}
                />

                <div className="mt-5 flex items-center justify-between">
                  <p className={labelClass}>Series: {exercise.series}</p>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        addSet(day.id, muscleGroup.id, exercise.id)
                      }
                      aria-label="Agregar serie"
                      className="flex h-8 w-8 cursor-pointer items-center justify-center border border-ink/20 text-ink/70 hover:border-tape hover:text-ink"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        removeSet(
                          day.id,
                          muscleGroup.id,
                          exercise.id,
                          exercise.series - 1
                        )
                      }
                      aria-label="Quitar serie"
                      disabled={exercise.series <= 1}
                      className="flex h-8 w-8 cursor-pointer items-center justify-center border border-ink/20 text-ink/70 hover:border-tape hover:text-ink disabled:opacity-40"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <p className={labelClass}>Repeticiones</p>
                  <div className="mt-2 flex flex-wrap gap-3">
                    {exercise.reps.map((reps, repsIndex) => (
                      <div key={repsIndex} className="flex items-center gap-1">
                        <span className="w-4 text-xs text-ink/50">
                          {repsIndex + 1}
                        </span>
                        <Input
                          type="number"
                          min="0"
                          step="0.5"
                          placeholder="10"
                          value={reps}
                          onChange={(e) =>
                            updateReps(
                              day.id,
                              muscleGroup.id,
                              exercise.id,
                              repsIndex,
                              Number.parseInt(e.target.value) || 1
                            )
                          }
                          className={setInputClass}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <p className={labelClass}>Peso (kg)</p>
                  <div className="mt-2 flex flex-wrap gap-3">
                    {exercise.weight.map((weight, weightIndex) => (
                      <div
                        key={weightIndex}
                        className="flex items-center gap-1"
                      >
                        <span className="w-4 text-xs text-ink/50">
                          {weightIndex + 1}
                        </span>
                        <Input
                          type="number"
                          min="0"
                          step="0.5"
                          placeholder="20"
                          value={weight}
                          onChange={(e) =>
                            updateWeight(
                              day.id,
                              muscleGroup.id,
                              exercise.id,
                              weightIndex,
                              Number.parseFloat(e.target.value) || 0
                            )
                          }
                          className={setInputClass}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <Label
                    htmlFor={`exercise-details-${exercise.id}`}
                    className={labelClass}
                  >
                    Detalles
                  </Label>
                  <Textarea
                    id={`exercise-details-${exercise.id}`}
                    rows={3}
                    className="mt-1 resize-none rounded-none border-0 border-b border-ink/25 bg-transparent px-0 shadow-none focus-visible:border-tape focus-visible:ring-0"
                    value={exercise.details}
                    onChange={(e) =>
                      updateDetails(
                        day.id,
                        muscleGroup.id,
                        exercise.id,
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
