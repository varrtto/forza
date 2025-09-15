import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useRoutineStore from "@/state/newRoutine";
import { Plus } from "lucide-react";
import { DAYS_OF_WEEK } from "../addRoutineForm.constants";

export const CreateRoutineCard = () => {
  const { routine, addDay, updateAlumnoName } = useRoutineStore();
  const availableDays = DAYS_OF_WEEK.filter(
    (day) => !routine.days?.some((routineDay) => routineDay.name === day)
  );
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Agregar Día de Entrenamiento
        </CardTitle>
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
          <Label
            htmlFor="alumno-name"
            className="text-xs text-muted-foreground"
          >
            Nombre del Alumno
          </Label>
          <Input
            type="text"
            placeholder="Nombre del Alumno"
            value={routine.name}
            onChange={(e) => updateAlumnoName(e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
};
