import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";

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
import useRoutineStore, { Day, MuscleGroup } from "@/state/newRoutine";
import { Dumbbell, Plus, Trash2 } from "lucide-react";
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
    removeWeight,
    updateWeight,
    addSet,
    removeSet,
    updateSet,
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
      <CardContent className="space-y-3">
        {muscleGroup.exercises.length === 0 ? (
          <p className="text-muted-foreground text-sm italic">
            No se han agregado ejercicios aún
          </p>
        ) : (
          muscleGroup.exercises.map((exercise) => (
            <div
              key={exercise.id}
              className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg"
            >
              <Dumbbell className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-2" />
              <div className="flex-1 space-y-4">
                {/* Exercise Name - Now a combobox */}
                <div>
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
                        value
                      )
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecciona un ejercicio" />
                    </SelectTrigger>
                    <SelectContent>
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
                      Series (repeticiones por serie)
                    </Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        addSet(day.id, muscleGroup.id, exercise.id)
                      }
                      className="h-6 px-2 text-xs"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Serie
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {exercise.series.map((reps, setIndex) => (
                      <div key={setIndex} className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground min-w-[20px]">
                          {setIndex + 1}:
                        </span>
                        <Input
                          type="number"
                          min="1"
                          value={reps}
                          onChange={(e) =>
                            updateSet(
                              day.id,
                              muscleGroup.id,
                              exercise.id,
                              setIndex,
                              Number.parseInt(e.target.value) || 1
                            )
                          }
                          className="w-16 h-8 text-center"
                          placeholder="10"
                        />
                        {exercise.series.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              removeSet(
                                day.id,
                                muscleGroup.id,
                                exercise.id,
                                setIndex
                              )
                            }
                            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Ejemplo: [10, 10, 10] o [12, 10, 8, 6]
                  </p>
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
                          {exercise.weight.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                removeWeight(
                                  day.id,
                                  muscleGroup.id,
                                  exercise.id,
                                  weightIndex
                                )
                              }
                              className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  removeExercise(day.id, muscleGroup.id, exercise.id)
                }
                className="text-destructive hover:text-destructive flex-shrink-0 mt-2"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
