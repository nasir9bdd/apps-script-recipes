/**
 * PDF Invoices from Google Sheets (Apps Script Recipes #21)
 * Creates one PDF per row from a Google Docs template, saves it in a Drive
 * folder and puts a link to it in your sheet. It can also email each PDF.
 *
 * How to use: write {{Header Name}} placeholders in a Google Doc, paste its
 * link in TEMPLATE_URL, then ⚡ Automations → "Create PDF invoices".
 * Rows that already have a link in the PDF column are skipped.
 *
 * License: MIT. Free to use and modify.
 */

// ================= SETTINGS: change these =================
const SHEET_NAME   = 'Invoices';                   // tab with one invoice per row
const TEMPLATE_URL =                               // link to your Docs template
  'PASTE_YOUR_GOOGLE_DOC_LINK_HERE';
const FOLDER_NAME  = 'Invoices (PDF)';             // Drive folder for the PDFs
const FILE_NAME    = 'Invoice {{Invoice}} - {{Client}}';  // name of each PDF
const PDF_COLUMN   = 'PDF';                        // header where links go
const SEND_EMAIL   = false;                        // true = also email each PDF
const EMAIL_COLUMN = 'Email';                      // header with the client's email
const SUBJECT      = 'Invoice {{Invoice}} from Bright Studio';
const MESSAGE      = 'Hi {{Client}},\n\nYour invoice is attached.\n\nThank you!';
// ===========================================================


/** Adds the ⚡ Automations menu when the spreadsheet opens. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('⚡ Automations')
    .addItem('Create PDF invoices', 'createPdfs')
    .addToUi();
}

/** Makes a PDF for every row that has no link in PDF_COLUMN yet. */
function createPdfs() {
  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) return alert_('No tab called "' + SHEET_NAME + '". Check SETTINGS.');

  const values = sheet.getDataRange().getDisplayValues();
  const headers = values[0].map(h => h.trim());
  const pdfCol = headers.indexOf(PDF_COLUMN);
  if (pdfCol < 0) return alert_('No column "' + PDF_COLUMN + '". Check SETTINGS.');

  const template = DriveApp.getFileById(docId_(TEMPLATE_URL));
  const folder = folder_(FOLDER_NAME);
  let made = 0;

  values.slice(1).forEach((row, i) => {
    if (row.join('') === '' || row[pdfCol]) return;   // empty row, or already done
    const pdf = makePdf_(template, folder, headers, row);
    sheet.getRange(i + 2, pdfCol + 1)
      .setFormula('=HYPERLINK("' + pdf.getUrl() + '", "Open PDF")');
    if (SEND_EMAIL) email_(headers, row, pdf);
    SpreadsheetApp.flush();                           // show each link as it's made
    made++;
  });
  ss.toast(made + ' PDF invoice(s) created', '⚡ Automations');
}

/** Copies the template, fills in the row's values, saves it as a PDF. */
function makePdf_(template, folder, headers, row) {
  const name = fill_(FILE_NAME, headers, row);
  const copy = template.makeCopy(name, folder);
  const doc = DocumentApp.openById(copy.getId());
  headers.forEach((h, c) => { if (h) replaceAll_(doc.getBody(), h, row[c]); });
  doc.saveAndClose();

  const pdf = folder.createFile(copy.getAs(MimeType.PDF)).setName(name + '.pdf');
  copy.setTrashed(true);                              // keep only the PDF
  return pdf;
}

/** Replaces every {{name}} in the document with value. */
function replaceAll_(body, name, value) {
  const safe = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = '\\{\\{\\s*' + safe + '\\s*\\}\\}';
  let found;
  while ((found = body.findText(pattern))) {
    const text = found.getElement().asText();
    const start = found.getStartOffset();
    text.deleteText(start, found.getEndOffsetInclusive());
    if (value !== '') text.insertText(start, value);
  }
}

function email_(headers, row, pdf) {
  const to = row[headers.indexOf(EMAIL_COLUMN)];
  if (!to) return;
  MailApp.sendEmail(to, fill_(SUBJECT, headers, row), fill_(MESSAGE, headers, row),
    { attachments: [pdf.getAs(MimeType.PDF)] });
}

/** Replaces {{Header}} in a text with that row's value. */
function fill_(template, headers, row) {
  return template.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (match, name) => {
    const col = headers.indexOf(name);
    return col < 0 ? match : row[col];
  });
}

function folder_(name) {
  const found = DriveApp.getFoldersByName(name);
  return found.hasNext() ? found.next() : DriveApp.createFolder(name);
}

function docId_(url) {
  const m = /\/d\/([\w-]{20,})|[?&]id=([\w-]{20,})/.exec(url);
  if (!m) throw new Error('TEMPLATE_URL is not a Google Docs link. Check SETTINGS.');
  return m[1] || m[2];
}

function alert_(message) {
  SpreadsheetApp.getUi().alert(message);
  return null;
}
