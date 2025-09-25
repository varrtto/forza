"use client";

import useRoutineStore from "@/state/newRoutine";
import { useEffect } from "react";

import { CreateRoutineCard } from "./CreateRoutineCard";
import { DayCard } from "./DayCard";
import { EmptyRoutineCard } from "./EmptyRoutineCard";
import { SaveButton } from "./SaveButton";

interface AddRoutineFormProps {
  preSelectedStudentId?: string | null;
}

export const AddRoutineForm = ({
  preSelectedStudentId,
}: AddRoutineFormProps) => {
  const { routine, resetRoutine } = useRoutineStore();

  // Reset routine state when component mounts
  useEffect(() => {
    resetRoutine();
  }, [resetRoutine]);

  return (
    <div className="space-y-6 max-w-xl py-4">
      {/* Add Day Section */}
      <CreateRoutineCard preSelectedStudentId={preSelectedStudentId} />

      {/* Days List */}
      <div className="space-y-6">
        {routine.days?.map((day) => (
          <DayCard key={day.id} day={day} />
        ))}
      </div>
      {/* Save Button */}
      {routine.days?.length > 0 && <SaveButton routine={routine} />}

      {/* Empty Routine Card */}
      {routine.days?.length === 0 && <EmptyRoutineCard />}
    </div>
  );
};
