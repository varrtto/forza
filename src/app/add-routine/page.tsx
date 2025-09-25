"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { AddRoutineForm } from "../../features/addRoutineForm";

function AddRoutineContent() {
  const searchParams = useSearchParams();
  const studentId = searchParams.get("studentId");

  return (
    <div className="font-sans min-h-screen items-center justify-items-center pt-10 px-4 md:px-0">
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
