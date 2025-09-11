"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useRoutineStore from "@/state/newRoutine";
import { generatePDF } from "@/utils/generatePDF";

import { Calendar, Dumbbell, Plus, Target, Trash2 } from "lucide-react";

const DAYS_OF_WEEK = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

const MUSCLE_GROUPS = [
  "Pecho",
  "Espalda",
  "Hombros",
  "Biceps",
  "Triceps",
  "Piernas",
  "Core",
  "Glúteos",
  "Cardio",
];

const EXERCISES_BY_MUSCLE_GROUP = {
  Pecho: [
    "Press de Banca",
    "Press Inclinado",
    "Press Declinado",
    "Aperturas con Mancuernas",
    "Fondos en Paralelas",
    "Press con Mancuernas",
    "Pullover",
    "Flexiones",
  ],
  Espalda: [
    "Dominadas",
    "Remo con Barra",
    "Remo con Mancuerna",
    "Jalones al Pecho",
    "Peso Muerto",
    "Remo en Polea Baja",
    "Hiperextensiones",
    "Pull-ups",
  ],
  Hombros: [
    "Press Militar",
    "Elevaciones Laterales",
    "Elevaciones Frontales",
    "Elevaciones Posteriores",
    "Press con Mancuernas",
    "Remo al Mentón",
    "Encogimientos",
    "Arnold Press",
  ],
  Biceps: [
    "Curl de Bíceps",
    "Curl Martillo",
    "Curl en Predicador",
    "Curl con Barra",
  ],
  Triceps: [
    "Press Francés",
    "Extensiones de Tríceps",
    "Fondos para Tríceps",
    "Patadas de Tríceps",
  ],
  Piernas: [
    "Sentadillas",
    "Prensa de Piernas",
    "Extensiones de Cuádriceps",
    "Curl Femoral",
    "Peso Muerto Rumano",
    "Zancadas",
    "Elevaciones de Gemelos",
    "Sentadilla Búlgara",
  ],
  Core: [
    "Abdominales",
    "Plancha",
    "Crunches",
    "Elevaciones de Piernas",
    "Russian Twists",
    "Mountain Climbers",
    "Bicicleta",
    "Dead Bug",
  ],
  Glúteos: [
    "Hip Thrust",
    "Sentadilla Sumo",
    "Peso Muerto Rumano",
    "Patadas de Glúteo",
    "Puente de Glúteo",
    "Caminata Lateral",
    "Sentadilla Búlgara",
    "Extensiones de Cadera",
  ],
  Cardio: [
    "Cinta de Correr",
    "Bicicleta Estática",
    "Elíptica",
    "Remo",
    "Burpees",
    "Jumping Jacks",
    "Escaladora",
    "HIIT",
  ],
};

export const AddRoutineForm = () => {
  const {
    routine,
    addDay,
    removeDay,
    addMuscleGroup,
    removeMuscleGroup,
    addExercise,
    removeExercise,
    updateExercise,
    removeWeight,
    updateWeight,
    addSet,
    removeSet,
    updateSet,
    updateAlumnoName,
  } = useRoutineStore();
  const availableDays = DAYS_OF_WEEK.filter(
    (day) => !routine.days?.some((routineDay) => routineDay.name === day)
  );

  const getAvailableMuscleGroups = (dayId: string) => {
    const day = routine.days.find((d) => d.id === dayId);
    if (!day) return MUSCLE_GROUPS;

    return MUSCLE_GROUPS.filter(
      (mg) => !day.muscleGroups.some((dayMg) => dayMg.name === mg)
    );
  };

  return (
    <div className="space-y-6 max-w-xl py-4">
      {/* Add Day Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Agregar Día de Entrenamiento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-2 flex-wrap">
              {availableDays?.map((day) => (
                <Button
                  key={day}
                  variant="outline"
                  onClick={() =>
                    addDay({
                      id: crypto.randomUUID(),
                      name: day,
                      muscleGroups: [],
                    })
                  }
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  {day}
                </Button>
              ))}
            </div>
            {availableDays.length === 0 && (
              <p className="text-muted-foreground text-sm">
                Todos los días han sido agregados a tu rutina
              </p>
            )}
            <Input
              type="text"
              placeholder="Nombre del Alumno"
              value={routine.name}
              onChange={(e) => updateAlumnoName(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Days List */}
      <div className="space-y-6">
        {routine.days?.map((day) => (
          <Card key={day.id} className="border-2">
            <CardHeader className="bg-muted/50">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {day.name}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeDay(day.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {/* Add Muscle Group */}
              <div className="flex gap-2 flex-wrap">
                {getAvailableMuscleGroups(day.id).map((muscleGroup) => (
                  <Button
                    key={muscleGroup}
                    variant="outline"
                    size="sm"
                    onClick={() => addMuscleGroup(day.id, muscleGroup)}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-3 w-3" />
                    {muscleGroup}
                  </Button>
                ))}
              </div>

              {/* Muscle Groups */}
              <div className="space-y-4">
                {day.muscleGroups.map((muscleGroup) => (
                  <Card
                    key={muscleGroup.id}
                    className="border border-border/50"
                  >
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
                            onClick={() =>
                              removeMuscleGroup(day.id, muscleGroup.id)
                            }
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
                                      <SelectItem
                                        key={exerciseName}
                                        value={exerciseName}
                                      >
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
                                      addSet(
                                        day.id,
                                        muscleGroup.id,
                                        exercise.id
                                      )
                                    }
                                    className="h-6 px-2 text-xs"
                                  >
                                    <Plus className="h-3 w-3 mr-1" />
                                    Serie
                                  </Button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {exercise.series.map((reps, setIndex) => (
                                    <div
                                      key={setIndex}
                                      className="flex items-center gap-1"
                                    >
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
                                  {exercise.weight.map(
                                    (weight, weightIndex) => (
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
                                                Number.parseFloat(
                                                  e.target.value
                                                ) || 0
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
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                removeExercise(
                                  day.id,
                                  muscleGroup.id,
                                  exercise.id
                                )
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
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Save Button */}
      {routine.days?.length > 0 && (
        <div className="flex justify-center pt-6">
          <Button
            onClick={() => generatePDF(routine)}
            size="lg"
            className="px-8"
          >
            Guardar Rutina
          </Button>
        </div>
      )}

      {routine.days?.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Dumbbell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No se han agregado días de entrenamiento aún
            </h3>
            <p className="text-muted-foreground">
              Comienza agregando un día a tu rutina arriba
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
