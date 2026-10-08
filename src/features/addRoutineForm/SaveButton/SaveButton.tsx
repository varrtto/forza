import useRoutineStore from "@/state/newRoutine";
import { Routine } from "@/types";
import { generatePDF } from "@/utils/generatePDF";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SaveButtonProps {
  routine: Routine;
  isEditMode?: boolean;
  routineId?: string | null;
}

export const SaveButton = ({
  routine,
  isEditMode = false,
  routineId,
}: SaveButtonProps) => {
  const { resetRoutine } = useRoutineStore();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSaveToStudent = async () => {
    if (!routine.studentId && !isEditMode) {
      setError("Por favor selecciona un estudiante");
      return;
    }

    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      let response;

      if (isEditMode && routineId) {
        response = await fetch(`/api/routines/${routineId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            routineData: routine,
          }),
        });
      } else {
        response = await fetch("/api/routines", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studentId: routine.studentId,
            routineData: routine,
          }),
        });
      }

      const result = await response.json();

      if (response.ok) {
        setSuccess(isEditMode ? "Rutina actualizada" : "Rutina guardada");

        setTimeout(() => {
          if (isEditMode && routineId) {
            router.push(`/routines/${routineId}`);
          } else {
            resetRoutine();
            router.push(`/students/${routine.studentId}`);
          }
        }, 1500);
      } else {
        setError(
          result.error ||
            (isEditMode
              ? "Error al actualizar la rutina"
              : "Error al guardar la rutina")
        );
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
    setIsGenerating(true);
    setError("");
    try {
      let avatarUrl;
      try {
        const profileResponse = await fetch("/api/user/profile");
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          avatarUrl = profileData.user.avatar_url;
        }
      } catch (profileError) {
        console.warn(
          "Could not fetch user profile for watermark:",
          profileError
        );
      }

      await generatePDF(routine, avatarUrl);
    } catch {
      setError("Error al generar el PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 border-t border-ink/15 pt-8">
      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && <p className="text-sm text-ink">{success}</p>}
      <div className="flex flex-wrap items-center gap-5">
        <button
          type="button"
          onClick={handleSaveToStudent}
          disabled={isSaving || isGenerating || (!routine.studentId && !isEditMode)}
          className="inline-flex h-12 cursor-pointer items-center bg-tape px-5 font-display text-lg tracking-wide text-on-tape transition-colors hover:bg-tape/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tape disabled:opacity-50"
        >
          {isSaving
            ? isEditMode
              ? "Actualizando..."
              : "Guardando..."
            : isEditMode
              ? "Guardar cambios"
              : "Guardar rutina"}
        </button>
        <button
          type="button"
          onClick={handleGeneratePDF}
          disabled={!routine.studentId || isGenerating || isSaving}
          className="cursor-pointer font-display text-base text-ink/70 underline decoration-tape decoration-2 underline-offset-4 hover:text-ink disabled:opacity-40"
        >
          {isGenerating ? "Generando PDF..." : "Generar PDF"}
        </button>
      </div>
    </div>
  );
};
