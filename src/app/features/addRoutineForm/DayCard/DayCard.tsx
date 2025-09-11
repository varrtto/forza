import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useRoutineStore, { Day } from "@/state/newRoutine";
import { Calendar, Plus, Trash2 } from "lucide-react";
import { MUSCLE_GROUPS } from "../addRoutineForm.constants";
import { MuscleGroupCard } from "./MuscleGroupCard";

export const DayCard = ({ day }: { day: Day }) => {
  const { routine, removeDay, addMuscleGroup } = useRoutineStore();

  const getAvailableMuscleGroups = (dayId: string) => {
    const day = routine.days.find((d) => d.id === dayId);
    if (!day) return MUSCLE_GROUPS;

    return MUSCLE_GROUPS.filter(
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
