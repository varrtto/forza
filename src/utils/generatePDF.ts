import { Routine } from "@/types";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const generatePDF = async (routine: Routine) => {
  const doc = new jsPDF();

  // Fetch student name if studentId is available
  let studentName = "Estudiante";
  if (routine.studentId) {
    try {
      const response = await fetch("/api/students");
      const data = await response.json();
      if (response.ok) {
        const student = data.students.find(
          (s: { id: string }) => s.id === routine.studentId
        );
        if (student) {
          studentName = student.name;
        }
      }
    } catch (error) {
      console.error("Error fetching student name:", error);
    }
  }

  // Title with better styling
  doc.setFontSize(20);
  doc.setFont("", "bold");
  doc.text(`Rutina de Entrenamiento`, 7, 15);
  doc.setFontSize(16);
  doc.setFont("", "normal");
  doc.text(`Estudiante: ${studentName}`, 7, 23);

  // Add date
  doc.setFontSize(10);
  doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 7, 29);

  let y = 35; // Start after header
  const pageHeight = 297; // A4 page height in mm for jsPDF default
  const pageWidth = 210; // A4 page width in mm for jsPDF default

  routine.days.forEach((day, dayIdx) => {
    // Day header with background
    doc.setFillColor(240, 240, 240); // Light gray background
    doc.rect(7, y - 4, pageWidth - 14, 8, "F");

    doc.setFontSize(14);
    doc.setFont("", "bold");
    // Center text vertically within the rectangle (background spans from y-4 to y+4, so center is at y)
    doc.text(`${dayIdx + 1}. Día: ${day.name}`, 9, y + 2);
    doc.setFont("", "normal");
    y += 10;

    day.muscleGroups.forEach((mg) => {
      // Muscle group header
      doc.setFontSize(12);
      doc.setFont("", "bold");
      doc.text(`Grupo Muscular: ${mg.name}`, 9, y);
      doc.setFont("", "normal");
      y += 6;

      // Table width inside page margins
      const tableWidth = pageWidth - 14; // 7mm margins

      // Fixed utility columns
      const seriesColWidth = 20; // widened so header fits on one line
      const repsColWidth = 32;
      const weightsColWidth = 32;

      // Equal widths for EJERCICIO and DETALLES with remaining space
      const remainingForText =
        tableWidth - (seriesColWidth + repsColWidth + weightsColWidth);
      const exerciseColWidth = Math.floor(remainingForText / 2);
      const detailsColWidth = remainingForText - exerciseColWidth;

      // Build rows
      const rows = mg.exercises.map((ex) => ({
        exercise: ex.name || "(Sin nombre)",
        series: ex.series && ex.series > 0 ? ex.series : "-",
        reps: ex.reps && ex.reps.length > 0 ? ex.reps.join(", ") : "-",
        weights: ex.weight && ex.weight.length > 0 ? ex.weight.join(", ") : "-",
        details: ex.details || "-",
      }));

      // Render table with AutoTable
      autoTable(doc, {
        startY: y,
        margin: { left: 7, right: 7 },
        columns: [
          { header: "EJERCICIO", dataKey: "exercise" },
          { header: "SERIES", dataKey: "series" },
          { header: "REPS", dataKey: "reps" },
          { header: "PESOS", dataKey: "weights" },
          { header: "DETALLES", dataKey: "details" },
        ],
        body: rows,
        headStyles: {
          fillColor: [60, 60, 60],
          textColor: [255, 255, 255],
          fontStyle: "bold",
          halign: "left",
        },
        styles: {
          fontSize: 12,
          cellPadding: 2,
          lineColor: [200, 200, 200],
          lineWidth: 0.1,
        },
        alternateRowStyles: {
          fillColor: [248, 248, 248],
        },
        columnStyles: {
          exercise: { cellWidth: exerciseColWidth },
          series: { cellWidth: seriesColWidth, halign: "center" },
          reps: { cellWidth: repsColWidth },
          weights: { cellWidth: weightsColWidth },
          details: { cellWidth: detailsColWidth },
        },
      });

      // jsPDF-AutoTable augments the doc instance with lastAutoTable
      type DocWithAutoTable = jsPDF & { lastAutoTable?: { finalY: number } };
      const finalY = (doc as DocWithAutoTable).lastAutoTable?.finalY ?? y;
      y = finalY + 4; // space after table
    });

    // Add space between days
    y += 15;
    if (y > pageHeight - 20) {
      doc.addPage();
      y = 15;
    }
  });

  // Add footer on the last page
  const currentPage = doc.getCurrentPageInfo().pageNumber;
  doc.setPage(currentPage);

  // Footer line
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.2);
  doc.line(7, pageHeight - 15, pageWidth - 7, pageHeight - 15);

  // Footer text
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(
    `Generado por Forza - ${new Date().toLocaleDateString()}`,
    7,
    pageHeight - 8
  );
  doc.text(`Página ${currentPage}`, pageWidth - 30, pageHeight - 8);

  doc.save(`Rutina_${studentName.replace(/\s+/g, "_")}.pdf`);
};
