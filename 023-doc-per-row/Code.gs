/**
 * One Google Doc per Row: Contracts, Offer Letters (Apps Script Recipes #23)
 * Copies a Google Docs template for every row, fills in the row's values,
 * saves it in a Drive folder and puts a link to it in your sheet.
 * Write {{Column Name}} in the template. {{Today}} becomes today's date.
 *
 * How to use: paste your template's link in TEMPLATE_URL, then
 * ⚡ Automations → "Create documents". Rows with a link are skipped.
 *
 * License: MIT. Free to use and modify.
 */

// ================= SETTINGS: change these =================
const SHEET_NAME   = 'Offers';                       // tab with one row per document
const TEMPLATE_URL =                                 // link to your Docs template
  'PASTE_YOUR_GOOGLE_DOC_LINK_HERE';
const FOLDER_NAME  = 'Offer Letters';                // Drive folder for the documents
const FILE_NAME    = 'Offer Letter - {{Name}}';      // name of each document
const DOC_COLUMN   = 'Document';                     // header where links go
const SHARE_COLUMN = '';                             // email column to share with
// ===========================================================


/** Adds the ⚡ Automations menu when the spreadsheet opens. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('⚡ Automations')
    .addItem('Create documents', 'createDocs')
    .addToUi();
}

/** Makes one document for every row that has no link in DOC_COLUMN yet. */
function createDocs() {
  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) return alert_('No tab called "' + SHEET_NAME + '". Check SETTINGS.');
  const values = sheet.getDataRange().getDisplayValues();
  const headers = values[0].map(h => h.trim());
  const docCol = headers.indexOf(DOC_COLUMN);
  if (docCol < 0) return alert_('No column "' + DOC_COLUMN + '". Check SETTINGS.');

  const template = DriveApp.getFileById(docId_(TEMPLATE_URL));
  const found = DriveApp.getFoldersByName(FOLDER_NAME);
  const folder = found.hasNext() ? found.next() : DriveApp.createFolder(FOLDER_NAME);
  const zone = ss.getSpreadsheetTimeZone();
  const today = Utilities.formatDate(new Date(), zone, 'MMMM d, yyyy');
  let made = 0;

  values.slice(1).forEach((row, i) => {
    if (row.join('') === '' || row[docCol]) return;  // empty row, or already done
    const value = name => name === 'Today' ? today : row[headers.indexOf(name)];
    const fill = text => text.replace(/\{\{\s*([^}]+?)\s*\}\}/g,
      (m, name) => name === 'Today' || headers.includes(name) ? value(name) : m);

    const copy = template.makeCopy(fill(FILE_NAME), folder);
    const doc = DocumentApp.openById(copy.getId());
    ['Today'].concat(headers)
      .forEach(h => { if (h) replaceAll_(doc.getBody(), h, value(h)); });
    doc.saveAndClose();
    if (SHARE_COLUMN && row[headers.indexOf(SHARE_COLUMN)]) {
      copy.addViewer(row[headers.indexOf(SHARE_COLUMN)]);
    }
    sheet.getRange(i + 2, docCol + 1)
      .setFormula('=HYPERLINK("' + copy.getUrl() + '", "Open Doc")');
    SpreadsheetApp.flush();                          // show each link as it's made
    made++;
  });
  ss.toast(made + ' document(s) created', '⚡ Automations');
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

function docId_(url) {
  const m = /\/d\/([\w-]{20,})|[?&]id=([\w-]{20,})/.exec(url);
  if (!m) throw new Error('TEMPLATE_URL is not a Google Docs link. Check SETTINGS.');
  return m[1] || m[2];
}

function alert_(message) {
  SpreadsheetApp.getUi().alert(message);
}
