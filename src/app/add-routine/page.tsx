"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { AddRoutineForm } from "../../features/addRoutineForm";

function AddRoutineContent() {
  const searchParams = useSearchParams();
  const studentId = searchParams.get("studentId");

  return (
    <div className="flex flex-col justify-center items-center min-h-[calc(100vh-72px)]">
      <div className="w-full max-w-xl">
        <AddRoutineForm preSelectedStudentId={studentId} />
      </div>
    </div>
  );
}

export default function AddRoutine() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddRoutineContent />
    </Suspense>
  );
}
