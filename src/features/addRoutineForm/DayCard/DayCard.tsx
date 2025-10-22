import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useRoutineStore from "@/state/newRoutine";
import { Day } from "@/types";
import { Calendar, Plus, Trash2 } from "lucide-react";
import { MUSCLE_GROUPS } from "../addRoutineForm.constants";
import { MuscleGroupCard } from "./MuscleGroupCard";

export const DayCard = ({ day }: { day: Day }) => {
  const { routine, removeDay, addMuscleGroup } = useRoutineStore();

  const getAvailableMuscleGroups = (dayId: string) => {
    const day = routine.days.find((d) => d.id === dayId);
    if (!day) return MUSCLE_GROUPS;

    let allowedMuscleGroups = MUSCLE_GROUPS;

    // Filter muscle groups based on routine type
    if (routine.type === 'pushPullLegs') {
      const dayIndex = routine.days.findIndex((d) => d.id === dayId);
      const cyclePosition = dayIndex % 3; // 0: Push, 1: Pull, 2: Legs

      if (cyclePosition === 0) {
        // Push days
        allowedMuscleGroups = ['Pecho', 'Hombros', 'Triceps'];
      } else if (cyclePosition === 1) {
        // Pull days
        allowedMuscleGroups = ['Espalda', 'Biceps'];
      } else if (cyclePosition === 2) {
        // Legs days
        allowedMuscleGroups = ['Piernas', 'Glúteos', 'Femorales', 'Gemelos'];
      }

      // Always include Abdominales, PSOAS, and Isometricos for all days
      allowedMuscleGroups = [...allowedMuscleGroups, 'Abdominales', 'PSOAS', 'Isometricos'];
    }

    return allowedMuscleGroups.filter(
      (mg) => !day.muscleGroups.some((dayMg) => dayMg.name === mg)
    );
  };

  return (
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
            <MuscleGroupCard
              key={muscleGroup.id}
              muscleGroup={muscleGroup}
              day={day}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
