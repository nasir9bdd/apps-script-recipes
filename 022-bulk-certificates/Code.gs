/**
 * Bulk Certificates from Google Sheets (Apps Script Recipes #22)
 * Makes one certificate per row from a Google Slides template, saves it
 * as a PDF in Drive and emails it to that person.
 *
 * How to use: write {{Header Name}} placeholders on a Google Slides slide,
 * paste its link in TEMPLATE_URL, then ⚡ Automations → "Create certificates".
 * Rows that already have something in the Status column are skipped.
 *
 * License: MIT. Free to use and modify.
 */

// ================= SETTINGS: change these =================
const SHEET_NAME    = 'Certificates';               // tab with one person per row
const TEMPLATE_URL  =                               // link to your Slides template
  'PASTE_YOUR_GOOGLE_SLIDES_LINK_HERE';
const FOLDER_NAME   = 'Certificates (PDF)';         // Drive folder for the PDFs
const FILE_NAME     = 'Certificate - {{Name}}';     // name of each PDF
const STATUS_COLUMN = 'Status';                     // header where "Sent" is written
const SEND_EMAIL    = true;                         // false = only make the PDFs
const EMAIL_COLUMN  = 'Email';                      // header with email addresses
const SUBJECT       = 'Your certificate, {{Name}}!';
const MESSAGE       = 'Hi {{Name}},\n\nCongratulations on completing {{Course}}!'
                    + '\nYour certificate is attached.\n\nBest wishes';
// ===========================================================


/** Adds the ⚡ Automations menu when the spreadsheet opens. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('⚡ Automations')
    .addItem('Create certificates', 'createCertificates')
    .addToUi();
}

/** Makes (and emails) a certificate for every row with an empty Status. */
function createCertificates() {
  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) return alert_('No tab called "' + SHEET_NAME + '". Check SETTINGS.');

  const values = sheet.getDataRange().getDisplayValues();
  const headers = values[0].map(h => h.trim());
  const statusCol = headers.indexOf(STATUS_COLUMN);
  const emailCol = headers.indexOf(EMAIL_COLUMN);
  if (statusCol < 0) return alert_('No column "' + STATUS_COLUMN + '". See SETTINGS.');
  if (SEND_EMAIL && emailCol < 0) return alert_('No column "' + EMAIL_COLUMN + '".');

  const template = DriveApp.getFileById(fileId_(TEMPLATE_URL));
  const folder = folder_(FOLDER_NAME);
  let done = 0;

  values.slice(1).forEach((row, i) => {
    if (row.join('') === '' || row[statusCol]) return;   // empty row, or already done
    const pdf = makePdf_(template, folder, headers, row);
    let status = 'PDF created ✓';
    if (SEND_EMAIL && row[emailCol]) {
      MailApp.sendEmail(row[emailCol], fill_(SUBJECT, headers, row),
        fill_(MESSAGE, headers, row), { attachments: [pdf] });
      status = 'Sent ✓';
    }
    sheet.getRange(i + 2, statusCol + 1).setValue(status);
    SpreadsheetApp.flush();                              // show progress row by row
    done++;
  });
  ss.toast(done + ' certificate(s) done', '⚡ Automations');
}

/** Copies the template, fills in the row's values, saves it as a PDF. */
function makePdf_(template, folder, headers, row) {
  const name = fill_(FILE_NAME, headers, row);
  const copy = template.makeCopy(name, folder);
  const slides = SlidesApp.openById(copy.getId());
  headers.forEach((h, c) => { if (h) slides.replaceAllText('{{' + h + '}}', row[c]); });
  slides.saveAndClose();

  const pdf = folder.createFile(copy.getAs(MimeType.PDF)).setName(name + '.pdf');
  copy.setTrashed(true);                                 // keep only the PDF
  return pdf;
}

/** Replaces {{Header}} in a text with that row's value. */
function fill_(text, headers, row) {
  return text.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (match, name) => {
    const col = headers.indexOf(name);
    return col < 0 ? match : row[col];
  });
}

function folder_(name) {
  const found = DriveApp.getFoldersByName(name);
  return found.hasNext() ? found.next() : DriveApp.createFolder(name);
}

function fileId_(url) {
  const m = /\/d\/([\w-]{20,})|[?&]id=([\w-]{20,})/.exec(url);
  if (!m) throw new Error('TEMPLATE_URL is not a Google Slides link. Check SETTINGS.');
  return m[1] || m[2];
}

function alert_(message) {
  SpreadsheetApp.getUi().alert(message);
  return null;
}
