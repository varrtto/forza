import { Button } from "@/components/ui/button";
import useRoutineStore from "@/state/newRoutine";
import { Routine } from "@/types";
import { generatePDF } from "@/utils/generatePDF";
import { FileText, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const SaveButton = ({ routine }: { routine: Routine }) => {
  const { resetRoutine } = useRoutineStore();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSaveToStudent = async () => {
    if (!routine.studentId) {
      setError("Por favor selecciona un estudiante");
      return;
    }

    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/routines", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: routine.studentId,
          routineData: routine,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess("Rutina guardada exitosamente");
        resetRoutine(); // Reset the routine after successful save
        setTimeout(() => {
          // Redirect to student profile to see the new routine
          router.push(`/students/${routine.studentId}`);
        }, 1500);
      } else {
        setError(result.error || "Error al guardar la rutina");
      }
    } catch {
      setError("Error de conexión. Intenta nuevamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleGeneratePDF = async () => {
    if (!routine.studentId) {
      setError("Por favor selecciona un estudiante");
      return;
    }
    try {
      await generatePDF(routine);
    } catch {
      setError("Error al generar el PDF");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 pt-6">
      {error && (
        <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-md max-w-md">
          {error}
        </div>
      )}
      {success && (
        <div className="text-green-600 text-sm text-center bg-green-50 p-3 rounded-md max-w-md">
          {success}
        </div>
      )}
      <div className="flex gap-4">
        <Button
          onClick={handleGeneratePDF}
          variant="outline"
          size="lg"
          className="px-8 flex items-center gap-2"
          disabled={!routine.studentId}
        >
          <FileText className="h-4 w-4" />
          Generar PDF
        </Button>
        <Button
          onClick={handleSaveToStudent}
          size="lg"
          className="px-8 flex items-center gap-2"
          disabled={isSaving || !routine.studentId}
        >
          <Save className="h-4 w-4" />
          {isSaving ? "Guardando..." : "Guardar Rutina"}
        </Button>
      </div>
    </div>
  );
};
