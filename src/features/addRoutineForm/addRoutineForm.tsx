"use client";

import useRoutineStore from "@/state/newRoutine";
import { Routine } from "@/types";
import { useEffect } from "react";

import { CreateRoutineCard } from "./CreateRoutineCard";
import { DayCard } from "./DayCard";
import { EmptyRoutineCard } from "./EmptyRoutineCard";
import { SaveButton } from "./SaveButton";

interface AddRoutineFormProps {
  preSelectedStudentId?: string | null;
  existingRoutine?: Routine | null;
  routineId?: string | null;
}

export const AddRoutineForm = ({
  preSelectedStudentId,
  existingRoutine,
  routineId,
}: AddRoutineFormProps) => {
  const { routine, resetRoutine, loadRoutine } = useRoutineStore();

  useEffect(() => {
    if (existingRoutine) {
      loadRoutine(existingRoutine);
    } else {
      resetRoutine();
    }
  }, [existingRoutine, resetRoutine, loadRoutine]);

  return (
    <div className="flex flex-col gap-12">
      <CreateRoutineCard
        preSelectedStudentId={preSelectedStudentId}
        isEditMode={!!existingRoutine}
      />

      {routine.days?.length === 0 ? (
        <EmptyRoutineCard />
      ) : (
        <div className="flex flex-col gap-12">
          {routine.days?.map((day) => (
            <DayCard key={day.id} day={day} />
          ))}
        </div>
      )}

      {routine.days?.length > 0 && (
        <SaveButton
          routine={routine}
          isEditMode={!!existingRoutine}
          routineId={routineId}
        />
      )}
    </div>
  );
};
