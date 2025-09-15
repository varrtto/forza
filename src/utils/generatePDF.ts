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
      doc.text("EJERCICIO", 18, y);
      doc.text("SERIES", 68, y);
      doc.text("REPETICIONES", 88, y);
      doc.text("PESOS", 128, y);
      doc.text("DETALLES", 158, y);
      doc.setFont("", "normal");
      y += 6;

      // Draw a line under headers
      doc.setLineWidth(0.1);
      doc.line(16, y - 4, 180, y - 4);

      mg.exercises.forEach((ex) => {
        // Prepare values
        const name = ex.name || "(Sin nombre)";
        const series = ex.series && ex.series > 0 ? ex.series : "-";
        const reps = ex.reps && ex.reps.length > 0 ? ex.reps.join(", ") : "-";
        const weights =
          ex.weight && ex.weight.length > 0 ? ex.weight.join(", ") : "-";
        const details = ex.details || "-";

        // Calculate available width for details column (from 158 to 180 = 22mm)
        const detailsWidth = 180 - 158;

        // Split details text to fit within the column width
        const detailsLines = doc.splitTextToSize(details, detailsWidth);

        // Calculate the maximum number of lines needed for this row
        const maxLines = Math.max(1, detailsLines.length);

        // Draw each line of the row
        for (let lineIndex = 0; lineIndex < maxLines; lineIndex++) {
          const currentY = y + lineIndex * 6;

          // Only draw text if we're not at the bottom of the page
          if (currentY <= pageHeight - 20) {
            if (lineIndex === 0) {
              // First line: show all columns
              doc.text(name, 18, currentY);
              doc.text(series.toString(), 68, currentY);
              doc.text(reps, 88, currentY);
              doc.text(weights, 128, currentY);
            }

            // Draw details line (or "-" if no details)
            const detailsText = detailsLines[lineIndex] || "-";
            doc.text(detailsText, 158, currentY);
          }
        }

        // Move y position based on the number of lines used
        y += maxLines * 6;

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
