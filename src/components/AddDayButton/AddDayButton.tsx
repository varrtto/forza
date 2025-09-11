import { useState } from "react";
import { Button } from "../ui/button";
import { Combobox } from "../ui/combobox";

export const AddDayButton = () => {
  const [showAddDayForm, setShowAddDayForm] = useState(false);
  return (
    <div className="flex flex-row gap-2">
      <Button variant="outline" onClick={() => setShowAddDayForm(true)}>
        Añadir día
      </Button>
      {showAddDayForm && <Combobox />}
    </div>
  );
};
