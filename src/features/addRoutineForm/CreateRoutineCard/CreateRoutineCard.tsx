import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Combobox, ComboboxOption } from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import useRoutineStore from "@/state/newRoutine";
import { RoutineType, Student } from "@/types";
import { Plus, RotateCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { DAYS_OF_WEEK } from "../addRoutineForm.constants";

interface CreateRoutineCardProps {
  preSelectedStudentId?: string | null;
  isEditMode?: boolean;
}

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

  // Pre-select student if provided
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

  // Convert students to combobox options
  const studentOptions: ComboboxOption[] = students.map((student) => ({
    value: student.id,
    label: student.name,
  }));
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Agregar Día de Entrenamiento
          </CardTitle>
          {routine.days.length > 0 && (
            <Button
              onClick={resetRoutine}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Resetear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-2 flex-wrap">
            {availableDays?.map((day) => (
              <Button
                key={day}
                variant="outline"
                onClick={() =>
                  addDay({
                    id: crypto.randomUUID(),
                    name: day,
                    muscleGroups: [],
                  })
                }
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                {day}
              </Button>
            ))}
          </div>
          {availableDays.length === 0 && (
            <p className="text-muted-foreground text-sm">
              Todos los días han sido agregados a tu rutina
            </p>
          )}
          {!isEditMode && (
            <div className="w-full">
              <Label
                htmlFor="student-combobox"
                className="text-xs text-muted-foreground"
              >
                Seleccionar Estudiante
              </Label>
              <Combobox
                value={routine.studentId || ""}
                onValueChange={updateSelectedStudent}
                options={studentOptions}
                placeholder="Selecciona un estudiante"
                searchPlaceholder="Buscar estudiante..."
                emptyText="No se encontraron estudiantes."
                disabled={loading}
                className="mt-1"
              />
              {students.length === 0 && !loading && (
                <p className="text-muted-foreground text-xs mt-1">
                  No hay estudiantes disponibles. Agrega un estudiante primero.
                </p>
              )}
            </div>
          )}
          <div className="space-y-3 pt-2">
            <ToggleGroup
              type="single"
              value={routine.type || "regular"}
              onValueChange={(value) =>
                value && setRoutineType(value as RoutineType)
              }
              className="justify-start flex flex-col md:flex-row border "
              spacing={0.1}
            >
              <ToggleGroupItem
                value="regular"
                aria-label="Rutina Regular"
                className="rounded-none rounded-t-md md:rounded-none md:rounded-l-md w-full md:w-auto"
              >
                Rutina Regular
              </ToggleGroupItem>
              <ToggleGroupItem
                value="fullBody"
                aria-label="Rutina Completa"
                className="rounded-none w-full md:w-auto"
              >
                Rutina Full Body
              </ToggleGroupItem>
              <ToggleGroupItem
                value="pushPullLegs"
                aria-label="Empuje/Tirón/Piernas"
                className="rounded-none rounded-b-md md:rounded-none md:rounded-r-md w-full md:w-auto"
              >
                Empuje/Tirón/Piernas
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
