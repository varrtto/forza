import { Combobox, ComboboxOption } from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import useRoutineStore from "@/state/newRoutine";
import { RoutineType, Student } from "@/types";
import { RotateCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { DAYS_OF_WEEK } from "../addRoutineForm.constants";

interface CreateRoutineCardProps {
  preSelectedStudentId?: string | null;
  isEditMode?: boolean;
}

const comboClass =
  "h-11 rounded-none border-0 border-b border-ink/25 bg-transparent px-0 shadow-none hover:bg-transparent focus-visible:border-tape";

export const CreateRoutineCard = ({
  preSelectedStudentId,
  isEditMode = false,
}: CreateRoutineCardProps) => {
  const {
    routine,
    addDay,
    updateSelectedStudent,
    resetRoutine,
    setRoutineType,
  } = useRoutineStore();
  const { data: session } = useSession();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  const availableDays = DAYS_OF_WEEK.filter(
    (day) => !routine.days?.some((routineDay) => routineDay.name === day)
  );

  useEffect(() => {
    if (session?.user?.id) {
      fetchStudents();
    }
  }, [session]);

  useEffect(() => {
    if (preSelectedStudentId && students.length > 0) {
      const studentExists = students.some(
        (student) => student.id === preSelectedStudentId
      );
      if (studentExists) {
        updateSelectedStudent(preSelectedStudentId);
      }
    }
  }, [preSelectedStudentId, students, updateSelectedStudent]);

  const fetchStudents = async () => {
    try {
      const response = await fetch("/api/students");
      const data = await response.json();

      if (response.ok) {
        setStudents(data.students);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const studentOptions: ComboboxOption[] = students.map((student) => ({
    value: student.id,
    label: student.name,
  }));

  const selectedStudent = students.find(
    (student) => student.id === routine.studentId
  );

  return (
    <section>
      <div className="flex items-end justify-between gap-4">
        <h2 className="font-display text-3xl tracking-tight md:text-4xl">
          Armado
        </h2>
        {routine.days.length > 0 && (
          <button
            type="button"
            onClick={resetRoutine}
            className="inline-flex cursor-pointer items-center gap-2 font-display text-sm text-ink/50 hover:text-ink"
          >
            <RotateCcw className="h-4 w-4" />
            Resetear
          </button>
        )}
      </div>

      {!isEditMode && (
        <div className="mt-8">
          <Label
            htmlFor="student-combobox"
            className="font-display text-base text-ink"
          >
            Alumno
          </Label>
          {preSelectedStudentId && selectedStudent ? (
            <p className="mt-2 font-display text-2xl tracking-tight">
              {selectedStudent.name}
            </p>
          ) : (
            <>
              <Combobox
                id="student-combobox"
                value={routine.studentId || ""}
                onValueChange={updateSelectedStudent}
                options={studentOptions}
                placeholder="Elegir alumno"
                searchPlaceholder="Buscar alumno"
                emptyText="No se encontraron alumnos."
                disabled={loading}
                className={`mt-1 ${comboClass}`}
              />
              {students.length === 0 && !loading && (
                <p className="mt-2 text-sm text-ink/55">
                  No hay alumnos. Agregá uno primero.
                </p>
              )}
            </>
          )}
        </div>
      )}

      <div className="mt-8">
        <p className="font-display text-base text-ink">Tipo</p>
        <ToggleGroup
          type="single"
          value={routine.type || "regular"}
          onValueChange={(value) =>
            value && setRoutineType(value as RoutineType)
          }
          className="mt-3 flex w-full flex-col gap-0 border border-ink/15 md:flex-row"
          spacing={0}
        >
          <ToggleGroupItem
            value="regular"
            aria-label="Rutina Regular"
            className="h-11 w-full rounded-none border-0 bg-transparent font-display text-sm text-ink/70 shadow-none hover:bg-transparent hover:text-ink data-[state=on]:bg-tape data-[state=on]:text-on-tape md:flex-1"
          >
            Regular
          </ToggleGroupItem>
          <ToggleGroupItem
            value="fullBody"
            aria-label="Rutina Completa"
            className="h-11 w-full rounded-none border-0 border-t border-ink/15 bg-transparent font-display text-sm text-ink/70 shadow-none hover:bg-transparent hover:text-ink data-[state=on]:bg-tape data-[state=on]:text-on-tape md:flex-1 md:border-t-0 md:border-l"
          >
            Full body
          </ToggleGroupItem>
          <ToggleGroupItem
            value="pushPullLegs"
            aria-label="Empuje/Tirón/Piernas"
            className="h-11 w-full rounded-none border-0 border-t border-ink/15 bg-transparent font-display text-sm text-ink/70 shadow-none hover:bg-transparent hover:text-ink data-[state=on]:bg-tape data-[state=on]:text-on-tape md:flex-1 md:border-t-0 md:border-l"
          >
            Empuje / tirón / piernas
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="mt-8">
        <p className="font-display text-base text-ink">Días</p>
        {availableDays.length === 0 ? (
          <p className="mt-3 text-sm text-ink/55">
            Ya están los siete días en la rutina.
          </p>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            {availableDays.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() =>
                  addDay({
                    id: crypto.randomUUID(),
                    name: day,
                    muscleGroups: [],
                  })
                }
                className="h-10 cursor-pointer border border-ink/20 px-3 font-display text-sm text-ink/80 transition-colors hover:border-tape hover:text-ink"
              >
                {day}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
