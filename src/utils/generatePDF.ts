import { Routine } from "@/state/newRoutine";
import { jsPDF } from "jspdf";

export const generatePDF = (routine: Routine) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text(`Rutina de Entrenamiento de ${routine.name}`, 14, 18);

  let y = 30;
  const pageHeight = 297; // A4 page height in mm for jsPDF default

  routine.days.forEach((day, dayIdx) => {
    doc.setFontSize(14);
    doc.text(`${dayIdx + 1}. Día: ${day.name}`, 14, y);
    y += 8;

    day.muscleGroups.forEach((mg) => {
      doc.setFontSize(12);
      doc.text(`Grupo Muscular: ${mg.name}`, 16, y);
      y += 7;

      // Table headers
      doc.setFontSize(11);
      doc.setFont("", "bold");
      doc.text("Ejercicio", 18, y);
      doc.text("Series", 78, y);
      doc.text("Pesos", 118, y);
      doc.setFont("", "normal");
      y += 6;

      // Draw a line under headers
      doc.setLineWidth(0.1);
      doc.line(16, y - 4, 180, y - 4);

      mg.exercises.forEach((ex) => {
        // Prepare values
        const name = ex.name || "(Sin nombre)";
        const series =
          ex.series && ex.series.length > 0 ? ex.series.join(", ") : "-";
        const weights =
          ex.weight && ex.weight.length > 0 ? ex.weight.join(", ") : "-";

        doc.text(name, 18, y);
        doc.text(series, 78, y);
        doc.text(weights, 118, y);

        y += 6;

        // If y is near the bottom, add a new page
        if (y > pageHeight - 20) {
          doc.addPage();
          y = 20;
        }
      });

      // Add some space after each muscle group
      y += 6;
      if (y > pageHeight - 20) {
        doc.addPage();
        y = 20;
      }
    });

    y += 4;
    if (y > pageHeight - 20) {
      doc.addPage();
      y = 20;
    }
  });

  doc.save("rutina.pdf");
};
