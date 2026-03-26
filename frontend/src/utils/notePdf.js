import { jsPDF } from 'jspdf';

const currencyFormatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
});

function formatDate(value) {
  if (!value) {
    return 'N/A';
  }

  const [year, month, day] = String(value).split('-');
  if (!year || !month || !day) {
    return String(value);
  }

  return `${day}/${month}/${year}`;
}

function line(doc, label, value, y) {
  doc.setFont('helvetica', 'bold');
  doc.text(label, 18, y);
  doc.setFont('helvetica', 'normal');
  doc.text(String(value), 78, y);
}

export function generateNotePdf(note) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });

  doc.setFillColor(29, 78, 216);
  doc.rect(0, 0, 210, 24, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('SP SCAN PESADO', 14, 15);

  doc.setTextColor(15, 37, 68);
  doc.setFontSize(16);
  doc.text(`FOLIO: ${note.folio ?? 'N/A'}`, 14, 36);
  doc.setFontSize(10);
  doc.setTextColor(75, 85, 99);
  doc.text(`Fecha de contrato: ${formatDate(note.fecha_contrato)}`, 14, 43);

  doc.setDrawColor(209, 213, 219);
  doc.roundedRect(14, 50, 182, 20, 3, 3);
  doc.setTextColor(31, 41, 55);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('DATOS DEL CLIENTE', 18, 58);
  doc.setFont('helvetica', 'normal');
  doc.text(note.cliente_nombre ?? 'N/A', 18, 65);

  doc.roundedRect(14, 76, 182, 78, 3, 3);
  doc.setFont('helvetica', 'bold');
  doc.text('DETALLES DEL SERVICIO / CONTRATO', 18, 84);
  doc.setDrawColor(229, 231, 235);
  doc.line(18, 87, 192, 87);

  doc.setTextColor(31, 41, 55);
  doc.setFontSize(10.5);
  line(doc, 'Verificentro asignado', note.verificentro_nombre ?? 'N/A', 96);
  line(doc, 'Verificaciones registradas', note.resumen_verificaciones ?? '0 Registradas', 105);
  line(doc, 'Atendio', note.atendio ?? 'N/A', 114);
  line(doc, 'Reviso', note.reviso ?? 'N/A', 123);
  line(doc, 'Metodo de pago', note.tipo_pago ?? 'N/A', 132);
  line(doc, 'Estado de la nota', note.pagado_completo ? 'PAGADO EN SU TOTALIDAD' : 'PAGO PARCIAL / ANTICIPO', 141);

  doc.setFillColor(240, 244, 255);
  doc.roundedRect(14, 160, 182, 18, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(29, 78, 216);
  doc.text(`Total / anticipo recibido: ${currencyFormatter.format(Number(note.anticipo ?? 0))}`, 18, 171);

  if (note.comentario) {
    doc.setTextColor(75, 85, 99);
    doc.setFont('helvetica', 'bold');
    doc.text('Notas adicionales', 18, 188);
    doc.setFont('helvetica', 'normal');
    const commentLines = doc.splitTextToSize(String(note.comentario), 174);
    doc.text(commentLines, 18, 194);
  }

  doc.setDrawColor(15, 37, 68);
  doc.line(24, 248, 86, 248);
  doc.line(124, 248, 186, 248);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 37, 68);
  doc.text('Firma del cliente', 39, 254);
  doc.text('Firma de conformidad', 134, 254);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(note.cliente_nombre ?? 'N/A', 38, 259);
  doc.text(`SP Scan Pesado - ${note.atendio ?? 'Representante'}`, 124, 259);

  doc.save(`Contrato_${note.folio ?? 'nota'}.pdf`);
}
