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

  // Initialize routine state when component mounts
  useEffect(() => {
    if (existingRoutine) {
      // Load existing routine for editing
      loadRoutine(existingRoutine);
    } else {
      // Reset for creating new routine
      resetRoutine();
    }
  }, [existingRoutine, resetRoutine, loadRoutine]);

  return (
    <div className="space-y-6 max-w-xl py-4">
      {/* Add Day Section */}
      <CreateRoutineCard
        preSelectedStudentId={preSelectedStudentId}
        isEditMode={!!existingRoutine}
      />

      {/* Days List */}
      <div className="space-y-6">
        {routine.days?.map((day) => (
          <DayCard key={day.id} day={day} />
        ))}
      </div>
      {/* Save Button */}
      {routine.days?.length > 0 && (
        <SaveButton
          routine={routine}
          isEditMode={!!existingRoutine}
          routineId={routineId}
        />
      )}

      {/* Empty Routine Card */}
      {routine.days?.length === 0 && <EmptyRoutineCard />}
    </div>
  );
};
