import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { DashboardData } from "../types/dashboard";

// Helper function to sanitize text for PDF
const sanitizeText = (text: string): string => {
  return text
    .replace(/à/g, 'a')
    .replace(/è/g, 'e')
    .replace(/é/g, 'e')
    .replace(/ì/g, 'i')
    .replace(/í/g, 'i')
    .replace(/ò/g, 'o')
    .replace(/ó/g, 'o')
    .replace(/ù/g, 'u')
    .replace(/ú/g, 'u')
    .replace(/ç/g, 'c')
    .replace(/ñ/g, 'n')
    .replace(/[^\x00-\x7F]/g, ''); // Remove any remaining non-ASCII characters
};

export const generateDashboardPDF = (data: DashboardData): void => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;

  // Title
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(sanitizeText("Report Dashboard Matrimonio"), pageWidth / 2, 25, { align: "center" });

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(sanitizeText("Alessio & Beatrice - 24 Luglio 2027"), pageWidth / 2, 35, { align: "center" });

  doc.setFontSize(10);
  doc.text(sanitizeText(`Generato il: ${data.lastUpdated.toLocaleString()}`), pageWidth / 2, 45, { align: "center" });

  let currentY = 60;

  // RSVP Summary
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(sanitizeText("Riepilogo Risposte"), margin, currentY);
  currentY += 15;

  const summaryData = [
    [sanitizeText("Totale Invitati"), data.rsvpSummary.total.toString()],
    [sanitizeText("Confermati"), `${data.rsvpSummary.confirmed} (${data.rsvpSummary.confirmationRate}%)`],
    [sanitizeText("Rifiutati"), data.rsvpSummary.declined.toString()],
    [sanitizeText("Forse"), data.rsvpSummary.maybe.toString()],
    [sanitizeText("In Attesa"), data.rsvpSummary.pending.toString()]
  ];

  autoTable(doc, {
    head: [[sanitizeText("Categoria"), sanitizeText("Valore")]],
    body: summaryData,
    startY: currentY,
    theme: "striped",
    styles: { fontSize: 10 },
    headStyles: { fillColor: [63, 81, 181] },
    margin: { left: margin, right: margin }
  });

  currentY = (doc as any).lastAutoTable.finalY + 20;

  // Side Summary
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(sanitizeText("Risposte per Lato"), margin, currentY);
  currentY += 15;

  const sideData = [
    ["Lato Alessio", data.sideSummary.alessio.total.toString(), data.sideSummary.alessio.confirmed.toString(), `${data.sideSummary.alessio.confirmationRate}%`],
    ["Lato Beatrice", data.sideSummary.beatrice.total.toString(), data.sideSummary.beatrice.confirmed.toString(), `${data.sideSummary.beatrice.confirmationRate}%`],
    ...(data.sideSummary.unknown.total > 0 ? [["Non Specificato", data.sideSummary.unknown.total.toString(), data.sideSummary.unknown.confirmed.toString(), `${data.sideSummary.unknown.confirmationRate}%`]] : [])
  ];

  autoTable(doc, {
    head: [["Lato", "Totali", "Confermati", "Tasso"]],
    body: sideData,
    startY: currentY,
    theme: "striped",
    styles: { fontSize: 10 },
    headStyles: { fillColor: [63, 81, 181] },
    margin: { left: margin, right: margin }
  });

  currentY = (doc as any).lastAutoTable.finalY + 20;

  // Check if we need a new page
  if (currentY > 230) {
    doc.addPage();
    currentY = 30;
  }

  // Allergies Section
  if (data.allergiesList.length > 0) {
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(sanitizeText("Allergie e Intolleranze"), margin, currentY);
    currentY += 15;

    const allergiesData = data.allergiesList.map(item => [
      sanitizeText(item.memberName),
      sanitizeText(item.allergies.join(", ")),
      sanitizeText(item.dietaryNotes || "-")
    ]);

    autoTable(doc, {
      head: [[sanitizeText("Nome"), sanitizeText("Allergie"), sanitizeText("Note Alimentari")]],
      body: allergiesData,
      startY: currentY,
      theme: "striped",
      styles: { fontSize: 9 },
      headStyles: { fillColor: [244, 67, 54] },
      margin: { left: margin, right: margin },
      columnStyles: {
        0: { cellWidth: 50 },
        1: { cellWidth: 70 },
        2: { cellWidth: 60 }
      }
    });

    currentY = (doc as any).lastAutoTable.finalY + 20;
  } else {
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text(sanitizeText("Allergie: Nessuna allergia segnalata"), margin, currentY);
    currentY += 20;
  }

  // Check if we need a new page
  if (currentY > 200) {
    doc.addPage();
    currentY = 30;
  }

  // Cocktail Preferences Section
  if (data.cocktailPreferences.length > 0) {
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(sanitizeText("Preferenze Cocktail"), margin, currentY);
    currentY += 15;

    // Group cocktails by popularity
    const cocktailCounts: { [key: string]: number } = {};
    data.cocktailPreferences.forEach(pref => {
      cocktailCounts[pref.preference] = (cocktailCounts[pref.preference] || 0) + 1;
    });

    const sortedCocktails = Object.entries(cocktailCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([cocktail, count]) => [cocktail, count.toString()]);

    // Popular cocktails summary
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Cocktail più richiesti:", margin, currentY);
    currentY += 10;

    autoTable(doc, {
      head: [["Cocktail", "Richieste"]],
      body: sortedCocktails,
      startY: currentY,
      theme: "striped",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [245, 0, 87] },
      margin: { left: margin, right: margin },
      columnStyles: {
        0: { cellWidth: 100 },
        1: { cellWidth: 40 }
      }
    });

    currentY = (doc as any).lastAutoTable.finalY + 15;

    // Detailed preferences
    if (currentY > 200) {
      doc.addPage();
      currentY = 30;
    }

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Dettaglio per persona:", margin, currentY);
    currentY += 10;

    const cocktailData = data.cocktailPreferences.map(item => [
      sanitizeText(item.memberName),
      sanitizeText(item.preference)
    ]);

    autoTable(doc, {
      head: [["Nome", "Cocktail Preferito"]],
      body: cocktailData,
      startY: currentY,
      theme: "striped",
      styles: { fontSize: 9 },
      headStyles: { fillColor: [245, 0, 87] },
      margin: { left: margin, right: margin },
      columnStyles: {
        0: { cellWidth: 90 },
        1: { cellWidth: 90 }
      }
    });
  } else {
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text(sanitizeText("Cocktail: Nessuna preferenza specificata"), margin, currentY);
    currentY += 20;
  }

  // Gift Summary (if applicable)
  if (data.giftSummary.totalGifts > 0 || data.giftSummary.totalDonations > 0) {
    if (currentY > 200) {
      doc.addPage();
      currentY = 30;
    }

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("🎁 Riepilogo Regali", margin, currentY);
    currentY += 15;

    const giftData = [
      ["Famiglie Totali", data.giftSummary.totalFamilies.toString()],
      ["Regali Totali", `€ ${data.giftSummary.totalGifts}`],
      ["Donazioni Totali", `€ ${data.giftSummary.totalDonations}`],
      ["Media Regali", `€ ${data.giftSummary.averageGift}`],
      ["Media Donazioni", `€ ${data.giftSummary.averageDonation}`]
    ];

    autoTable(doc, {
      head: [["Categoria", "Valore"]],
      body: giftData,
      startY: currentY,
      theme: "striped",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [76, 175, 80] },
      margin: { left: margin, right: margin }
    });
  }

  // Footer on last page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(`Pagina ${i} di ${pageCount}`, pageWidth - margin, doc.internal.pageSize.height - 10, { align: "right" });
    doc.text("Report generato da Dashboard Matrimonio", margin, doc.internal.pageSize.height - 10);
  }

  // Generate filename with timestamp
  const timestamp = data.lastUpdated.toISOString().slice(0, 16).replace("T", "_").replace(":", "-");
  const filename = `Dashboard_Matrimonio_${timestamp}.pdf`;

  // Save the PDF
  doc.save(filename);
};