import { Routine } from "@/types";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// Helper function to convert image to grayscale
const convertToGrayscale = (imageData: ImageData): ImageData => {
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    // Calculate grayscale value using luminance formula
    const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
    data[i] = gray;     // Red
    data[i + 1] = gray; // Green
    data[i + 2] = gray; // Blue
    // Alpha channel (data[i + 3]) remains unchanged
  }
  return imageData;
};

// Helper function to add watermark
const addWatermark = async (doc: jsPDF, avatarUrl?: string) => {
  if (!avatarUrl) return;

  try {
    // Load image from URL
    const response = await fetch(avatarUrl);
    const blob = await response.blob();

    // Convert blob to base64
    const base64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });

    // Create canvas for image processing
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    // Load image onto canvas
    const img = new Image();
    img.src = base64;
    await new Promise((resolve) => {
      img.onload = resolve;
    });

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    // Get image data and convert to grayscale
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const grayscaleData = convertToGrayscale(imageData);
    ctx.putImageData(grayscaleData, 0, 0);

    // Convert canvas back to base64
    const grayscaleBase64 = canvas.toDataURL('image/jpeg', 0.9);

    const imgWidth = img.width;
    const imgHeight = img.height;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Calculate smaller watermark size for repeating pattern
    const watermarkSize = Math.min(pageWidth * 0.15, pageHeight * 0.15);
    const aspectRatio = imgWidth / imgHeight;
    let watermarkWidth, watermarkHeight;

    if (aspectRatio > 1) {
      // Landscape
      watermarkWidth = watermarkSize;
      watermarkHeight = watermarkSize / aspectRatio;
    } else {
      // Portrait
      watermarkHeight = watermarkSize;
      watermarkWidth = watermarkSize * aspectRatio;
    }

    // Calculate spacing for diagonal grid pattern
    const horizontalSpacing = watermarkWidth * 1.5;
    const verticalSpacing = watermarkHeight * 1.5;
    const diagonalOffset = watermarkWidth * 0.75; // Offset for diagonal pattern

    // Save current graphics state
    doc.saveGraphicsState();

    // Set low opacity for watermark (avoid use of 'any')
    // @ts-expect-error: GState typing not present in jsPDF types, but safe for supported builds
    doc.setGState(new doc.GState({ opacity: 0.04 }));

    // Add watermark grid to all existing pages
    const totalPages = doc.getNumberOfPages();
    for (let page = 1; page <= totalPages; page++) {
      doc.setPage(page);

      // Calculate how many watermarks fit horizontally and vertically
      const cols = Math.ceil((pageWidth + watermarkWidth) / horizontalSpacing) + 1;
      const rows = Math.ceil((pageHeight + watermarkHeight) / verticalSpacing) + 1;

      // Create diagonal grid pattern
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          // Calculate position with diagonal offset
          const baseX = col * horizontalSpacing;
          const baseY = row * verticalSpacing;
          const offsetX = (row % 2) * diagonalOffset; // Alternate offset for diagonal effect

          const x = baseX - offsetX - watermarkWidth * 0.5; // Center the pattern
          const y = baseY - watermarkHeight * 0.5;

          // Only add if the watermark would be visible on the page
          if (x + watermarkWidth > -watermarkWidth && x < pageWidth + watermarkWidth &&
              y + watermarkHeight > -watermarkHeight && y < pageHeight + watermarkHeight) {
            doc.addImage(grayscaleBase64, 'JPEG', x, y, watermarkWidth, watermarkHeight);
          }
        }
      }
    }

    // Restore graphics state
    doc.restoreGraphicsState();
  } catch (error) {
    console.warn('Failed to add watermark:', error);
  }
};

const generateCompactPDF = async (routine: Routine, studentName: string, avatarUrl?: string) => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.setFont("", "bold");
  doc.text(`Rutina Full Body - ${studentName}`, 7, 12);
  doc.setFont("", "normal");
  doc.setFontSize(9);
  doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 7, 17);

  let y = 25;
  const pageHeight = 297;
  const pageWidth = 210;
  const margin = 7;

  routine.days.forEach((day, dayIdx) => {
    // Day header - more compact
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, y - 3, pageWidth - 2 * margin, 6, "F");
    doc.setFontSize(13);
    doc.setFont("", "bold");
    doc.text(`${day.name}`, margin + 2, y + 1);
    doc.setFont("", "normal");
    y += 8;

    // Collect all exercises for this day
    const allExercises: Array<{
      muscleGroup: string;
      exercise: string;
      series: string | number;
      reps: string;
      weights: string;
    }> = [];

    day.muscleGroups.forEach((mg) => {
      mg.exercises.forEach((ex) => {
        allExercises.push({
          muscleGroup: mg.name,
          exercise: ex.name || "(Sin nombre)",
          series: ex.series && ex.series > 0 ? ex.series : "-",
          reps: ex.reps && ex.reps.length > 0 ? ex.reps.join(", ") : "-",
          weights: ex.weight && ex.weight.length > 0 ? ex.weight.join(", ") : "-",
        });
      });
    });

    // Render compact table
    autoTable(doc, {
      startY: y,
      margin: { left: margin, right: margin },
      columns: [
        { header: "Grupo", dataKey: "muscleGroup" },
        { header: "Ejercicio", dataKey: "exercise" },
        { header: "Series", dataKey: "series" },
        { header: "Reps", dataKey: "reps" },
        { header: "Peso", dataKey: "weights" },
      ],
      body: allExercises,
      headStyles: {
        fillColor: [60, 60, 60],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 10,
        cellPadding: 1.5,
      },
      styles: {
        fontSize: 10,
        cellPadding: 1.5,
        lineColor: [200, 200, 200],
        lineWidth: 0.1,
      },
      alternateRowStyles: {
        fillColor: [250, 250, 250],
      },
      columnStyles: {
        muscleGroup: { cellWidth: 32 },
        exercise: { cellWidth: 73 },
        series: { cellWidth: 20, halign: "center" },
        reps: { cellWidth: 35.5 },
        weights: { cellWidth: 35.5 },
      },
    });

    type DocWithAutoTable = jsPDF & { lastAutoTable?: { finalY: number } };
    const finalY = (doc as DocWithAutoTable).lastAutoTable?.finalY ?? y;
    y = finalY + 6;

    if (y > pageHeight - 20 && dayIdx < routine.days.length - 1) {
      doc.addPage();
      y = 15;
    }
  });

  // Add watermark if avatar URL is provided
  await addWatermark(doc, avatarUrl);

  doc.save(`Rutina_FullBody_${studentName.replace(/\s+/g, "_")}.pdf`);
};

export const generatePDF = async (routine: Routine, avatarUrl?: string) => {
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

  // Use compact PDF for full body routines
  if (routine.isFullBody) {
    return generateCompactPDF(routine, studentName, avatarUrl);
  }

  const doc = new jsPDF();

  // Title with better styling
  doc.setFontSize(20);
  doc.setFont("", "bold");
  doc.text(`Rutina de Entrenamiento de ${studentName}`, 7, 15);
  doc.setFont("", "normal");

  // Add date
  doc.setFontSize(10);
  doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 7, 20);

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
    if (y > pageHeight - 10) {
      doc.addPage();
      y = 15;
    }
    });

    // Add watermark if avatar URL is provided
  await addWatermark(doc, avatarUrl);

  doc.save(`Rutina_${studentName.replace(/\s+/g, "_")}.pdf`);
};
