import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Minus, Target } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useRoutineStore from "@/state/newRoutine";
import { Day, MuscleGroup } from "@/types";
import { Plus, Trash2 } from "lucide-react";
import { EXERCISES_BY_MUSCLE_GROUP } from "../../addRoutineForm.constants";

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
  return (
    <Card key={muscleGroup.id} className="border border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-4 w-4" />
            {muscleGroup.name}
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => addExercise(day.id, muscleGroup.id)}
              className="flex items-center gap-1"
            >
              <Plus className="h-3 w-3" />
              Ejercicio
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeMuscleGroup(day.id, muscleGroup.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {muscleGroup.exercises.length === 0 ? (
          <p className="text-muted-foreground text-sm italic">
            No se han agregado ejercicios aún
          </p>
        ) : (
          muscleGroup.exercises.map((exercise) => (
            <div
              key={exercise.id}
              className="p-2 bg-muted/30 rounded-lg relative overflow-hidden"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  removeExercise(day.id, muscleGroup.id, exercise.id)
                }
                className="absolute top-0 right-0 text-destructive hover:text-destructive flex-shrink-0 mt-2"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <div className="flex items-start gap-3 pr-8">
                <div className="flex-1 min-w-0 space-y-4">
                  {/* Exercise Name - Now a combobox */}
                  <div className="min-w-0">
                    <Label
                      htmlFor={`exercise-name-${exercise.id}`}
                      className="text-xs text-muted-foreground"
                    >
                      Nombre del Ejercicio
                    </Label>
                    <Select
                      value={exercise.name}
                      onValueChange={(value) =>
                        updateExercise(
                          day.id,
                          muscleGroup.id,
                          exercise.id,
                          "name",
                          value,
                          exercise.name
                        )
                      }
                    >
                      <SelectTrigger className="mt-1 !w-full max-w-full [&>span]:truncate [&>span]:block">
                        <SelectValue placeholder="Selecciona un ejercicio" />
                      </SelectTrigger>
                      <SelectContent className="max-w-[calc(100vw-2rem)]">
                        {EXERCISES_BY_MUSCLE_GROUP[
                          muscleGroup.name as keyof typeof EXERCISES_BY_MUSCLE_GROUP
                        ]?.map((exerciseName) => (
                          <SelectItem key={exerciseName} value={exerciseName}>
                            {exerciseName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Series */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-xs text-muted-foreground">
                        Series: {exercise.series}
                      </Label>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            addSet(day.id, muscleGroup.id, exercise.id)
                          }
                          className="h-6 px-2 text-xs"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            removeSet(
                              day.id,
                              muscleGroup.id,
                              exercise.id,
                              exercise.series - 1
                            )
                          }
                          className="h-6 px-2 text-xs"
                          disabled={exercise.series <= 1}
                        >
                          <Minus className="h-3 w-3 mr-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  {/* Reps */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label
                        htmlFor={`exercise-weight-${exercise.id}`}
                        className="text-xs text-muted-foreground"
                      >
                        Repeticiones
                      </Label>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {exercise.reps.map((reps, repsIndex) => (
                        <div
                          key={repsIndex}
                          className="flex items-center gap-1"
                        >
                          <span className="text-xs text-muted-foreground min-w-[20px]">
                            {repsIndex + 1}:
                          </span>
                          <div className="flex items-center gap-1">
                            <Input
                              type="number"
                              min="0"
                              step="0.5"
                              placeholder="50"
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
                              className="w-16 h-8 text-center"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Weight */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label
                        htmlFor={`exercise-weight-${exercise.id}`}
                        className="text-xs text-muted-foreground"
                      >
                        Peso (kg)
                      </Label>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {exercise.weight.map((weight, weightIndex) => (
                        <div
                          key={weightIndex}
                          className="flex items-center gap-1"
                        >
                          <span className="text-xs text-muted-foreground min-w-[20px]">
                            {weightIndex + 1}:
                          </span>
                          <div className="flex items-center gap-1">
                            <Input
                              type="number"
                              min="0"
                              step="0.5"
                              placeholder="50"
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
                              className="w-16 h-8 text-center"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <Label
                htmlFor={`exercise-details-${exercise.id}`}
                className="text-xs text-muted-foreground"
              >
                Detalles
              </Label>
              <Textarea
                rows={3}
                className="resize-none"
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
          ))
        )}
      </CardContent>
    </Card>
  );
};
