import { Card, CardContent } from "@/components/ui/card";
import { Dumbbell } from "lucide-react";

export const EmptyRoutineCard = () => {
  return (
    <Card>
      <CardContent className="text-center py-12">
        <Dumbbell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          No se han agregado días de entrenamiento aún
        </h3>
        <p className="text-muted-foreground">
          Comienza agregando un día a tu rutina arriba
        </p>
      </CardContent>
    </Card>
  );
};
