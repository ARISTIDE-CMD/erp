import { formatFCFA } from '@/lib/format';

const toDate = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('fr-FR');
};

const typeTitle = (type) => {
  switch (type) {
    case 'facture':
      return 'FACTURE';
    case 'bon_livraison':
      return 'BON DE LIVRAISON';
    case 'proforma':
      return 'FACTURE PRO-FORMA';
    default:
      return 'DOCUMENT';
  }
};

const sanitizeFilePart = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

const sanitizePdfText = (value) =>
  String(value ?? '')
    .replace(/[\u202f\u00a0]/g, ' ')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u2013\u2014]/g, '-');

export async function generateOrderPdf({ commande, typeDocument = 'proforma' }) {
  const { PDFDocument, StandardFonts, rgb } = await import(/* @vite-ignore */ 'https://esm.sh/pdf-lib@1.17.1');

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);
  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const colorBlue = rgb(0.11, 0.31, 0.77);
  const colorBlueSoft = rgb(0.88, 0.93, 1);
  const colorOrange = rgb(0.97, 0.45, 0.13);
  const colorText = rgb(0.16, 0.2, 0.27);

  const drawText = (text, x, y, size = 11, font = regular, color = colorText) => {
    page.drawText(sanitizePdfText(text || '-'), { x, y, size, font, color });
  };

  const logoX = 46;
  const logoY = 768;
  const logoSize = 28;
  const s = logoSize / 2 - 2;
  page.drawRectangle({ x: logoX, y: logoY + s + 2, width: s, height: s, color: colorBlue });
  page.drawRectangle({ x: logoX + s + 4, y: logoY + s + 2, width: s, height: s, color: colorOrange });
  page.drawRectangle({ x: logoX, y: logoY, width: s, height: s, color: colorOrange });
  page.drawRectangle({ x: logoX + s + 4, y: logoY, width: s, height: s, color: colorBlue });

  drawText('Molige ERP', 84, 786, 18, bold, colorBlue);
  drawText('Gestion integree commandes, clients, stocks', 84, 770, 10, regular, rgb(0.35, 0.44, 0.6));
  drawText(typeTitle(typeDocument), 430, 786, 11, bold, colorOrange);

  page.drawLine({
    start: { x: 46, y: 756 },
    end: { x: 549, y: 756 },
    thickness: 1,
    color: colorBlueSoft,
  });

  const client = commande?.client || {};
  const lignes = Array.isArray(commande?.lignes) ? commande.lignes : [];
  const numero = commande?.numero_commande || commande?.id || '-';
  const statut = commande?.statut || '-';
  const dateCommande = toDate(commande?.created_at);
  const montant = Number(commande?.montant_total || 0);

  drawText('Informations commande', 46, 730, 11, bold, colorBlue);
  drawText(`Numero: ${numero}`, 46, 713);
  drawText(`Date: ${dateCommande}`, 46, 697);
  drawText(`Statut: ${statut}`, 46, 681);

  drawText('Client', 330, 730, 11, bold, colorBlue);
  drawText(client?.nom || '-', 330, 713);
  drawText(client?.telephone || '-', 330, 697);
  drawText(client?.adresse || '-', 330, 681);

  const tableTop = 645;
  const rowHeight = 24;
  page.drawRectangle({
    x: 46,
    y: tableTop,
    width: 503,
    height: rowHeight,
    color: colorBlueSoft,
  });
  drawText('Designation', 56, tableTop + 8, 10, bold, colorBlue);
  drawText('Qte', 322, tableTop + 8, 10, bold, colorBlue);
  drawText('PU', 386, tableTop + 8, 10, bold, colorBlue);
  drawText('Total', 470, tableTop + 8, 10, bold, colorBlue);

  let y = tableTop - rowHeight;
  const rows = lignes.length ? lignes : [{ article: { designation: '-' }, quantite: 0, prix_unitaire: 0 }];
  for (const line of rows.slice(0, 16)) {
    const designation = line?.article?.designation || line?.article?.reference || '-';
    const qty = Number(line?.quantite || 0);
    const pu = Number(line?.prix_unitaire || 0);
    const total = qty * pu;

    page.drawRectangle({
      x: 46,
      y,
      width: 503,
      height: rowHeight,
      color: rgb(1, 1, 1),
      borderWidth: 0.3,
      borderColor: rgb(0.88, 0.92, 0.98),
    });
    drawText(designation, 56, y + 8, 10);
    drawText(String(qty), 328, y + 8, 10);
    drawText(formatFCFA(pu, 2), 372, y + 8, 10);
    drawText(formatFCFA(total, 2), 452, y + 8, 10, bold);
    y -= rowHeight;
  }

  const totalY = y - 10;
  page.drawRectangle({
    x: 344,
    y: totalY,
    width: 205,
    height: 38,
    color: rgb(0.98, 0.99, 1),
    borderWidth: 0.8,
    borderColor: colorBlueSoft,
  });
  drawText('Montant total', 356, totalY + 22, 10, bold, colorBlue);
  drawText(formatFCFA(montant, 2), 452, totalY + 8, 12, bold, colorOrange);

  drawText('Document genere depuis Molige ERP', 46, 54, 9, regular, rgb(0.44, 0.5, 0.6));
  drawText(`Date generation: ${toDate(new Date().toISOString())}`, 410, 54, 9, regular, rgb(0.44, 0.5, 0.6));

  const bytes = await pdfDoc.save();
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const fileName = `${sanitizeFilePart(typeDocument)}-${sanitizeFilePart(numero)}.pdf`;
  return { bytes, blob, fileName };
}
