import useRoutineStore from "@/state/newRoutine";
import { Day } from "@/types";
import { Trash2 } from "lucide-react";
import {
  MUSCLE_GROUPS,
  PPL_ALWAYS_MUSCLE_GROUPS,
  PPL_DAY_MUSCLE_GROUPS,
} from "../addRoutineForm.constants";
import { MuscleGroupCard } from "./MuscleGroupCard";

export const DayCard = ({ day }: { day: Day }) => {
  const { routine, removeDay, addMuscleGroup } = useRoutineStore();

  const getAvailableMuscleGroups = (dayId: string) => {
    const currentDay = routine.days.find((d) => d.id === dayId);
    if (!currentDay) return MUSCLE_GROUPS;

    let allowedMuscleGroups = MUSCLE_GROUPS;

    if (routine.type === "pushPullLegs") {
      const dayIndex = routine.days.findIndex((d) => d.id === dayId);
      const cyclePosition = dayIndex % 3;

      allowedMuscleGroups = [
        ...PPL_DAY_MUSCLE_GROUPS[cyclePosition],
        ...PPL_ALWAYS_MUSCLE_GROUPS,
      ];
    }

    return allowedMuscleGroups.filter(
      (mg) => !currentDay.muscleGroups.some((dayMg) => dayMg.name === mg)
    );
  };

  return (
    <section>
      <div className="flex items-center justify-between gap-4 border-b border-tape pb-2">
        <h2 className="font-display text-3xl tracking-tight md:text-4xl">
          {day.name}
        </h2>
        <button
          type="button"
          onClick={() => removeDay(day.id)}
          aria-label={`Eliminar ${day.name}`}
          className="flex h-9 w-9 cursor-pointer items-center justify-center text-ink/40 transition-colors hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {getAvailableMuscleGroups(day.id).map((muscleGroup) => (
          <button
            key={muscleGroup}
            type="button"
            onClick={() => addMuscleGroup(day.id, muscleGroup)}
            className="h-9 cursor-pointer border border-ink/20 px-3 font-display text-sm text-ink/80 transition-colors hover:border-tape hover:text-ink"
          >
            {muscleGroup}
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-8">
        {day.muscleGroups.map((muscleGroup) => (
          <MuscleGroupCard
            key={muscleGroup.id}
            muscleGroup={muscleGroup}
            day={day}
          />
        ))}
      </div>
    </section>
  );
};
