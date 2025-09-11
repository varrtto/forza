import { Button } from "@/components/ui/button";
import { Routine } from "@/state/newRoutine";
import { generatePDF } from "@/utils/generatePDF";

export const SaveButton = ({ routine }: { routine: Routine }) => {
  return (
    <div className="flex justify-center pt-6">
      <Button onClick={() => generatePDF(routine)} size="lg" className="px-8">
        Guardar Rutina en PDF
      </Button>
    </div>
  );
};
