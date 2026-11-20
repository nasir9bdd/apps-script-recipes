/**
 * Send Emails with Personal Attachments from Drive (Apps Script Recipes #17)
 * Emails every row its own file from Google Drive: an invoice, a report,
 * a certificate. Write the file's name (or its Drive link) in the sheet.
 *
 * How to use: ⚡ Automations → "Send emails with files".
 * Rows that already have a status are skipped.
 * Free Gmail accounts can send about 100 emails a day.
 *
 * License: MIT. Free to use and modify.
 */

// ================= SETTINGS: change these =================
const SHEET_NAME    = 'Clients';                    // tab with one email per row
const EMAIL_COLUMN  = 'Email';                      // header of the email column
const FILE_COLUMN   = 'File';                       // file name or Drive link
const FOLDER_NAME   = 'Invoices (PDF)';             // where to look for file names
const STATUS_COLUMN = 'Status';                     // the script writes "Sent" here
const SUBJECT       = 'Your invoice {{Invoice}}';
const MESSAGE       = 'Hi {{Name}},\n\nYour invoice {{Invoice}} is attached.'
                    + '\n\nThank you!\nBright Studio';
// ===========================================================


/** Adds the ⚡ Automations menu when the spreadsheet opens. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('⚡ Automations')
    .addItem('Send emails with files', 'sendWithFiles')
    .addToUi();
}

/** Emails each row its own Drive file and notes the result in the sheet. */
function sendWithFiles() {
  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) return alert_('No tab called "' + SHEET_NAME + '". Check SETTINGS.');
  const values = sheet.getDataRange().getDisplayValues();
  const headers = values[0].map(h => h.trim());
  const at = name => headers.indexOf(name);
  if ([EMAIL_COLUMN, FILE_COLUMN, STATUS_COLUMN].some(n => at(n) < 0))
    return alert_('Check the column names in SETTINGS.');

  const zone = ss.getSpreadsheetTimeZone();
  let sent = 0;
  values.slice(1).forEach((row, i) => {
    const to = row[at(EMAIL_COLUMN)];
    const status = sheet.getRange(i + 2, at(STATUS_COLUMN) + 1);
    if (!to || row[at(STATUS_COLUMN)]) return;        // no address, or already done
    const file = findFile_(row[at(FILE_COLUMN)]);
    if (!file) return status.setValue('File not found');

    const fill = text => text.replace(/\{\{\s*([^}]+?)\s*\}\}/g,
      (m, name) => at(name) >= 0 ? row[at(name)] : m);
    MailApp.sendEmail(to, fill(SUBJECT), fill(MESSAGE),
      { attachments: [file.getBlob()] });
    status.setValue('Sent ✓ ' + Utilities.formatDate(new Date(), zone, 'MMM d, HH:mm'));
    SpreadsheetApp.flush();
    sent++;
  });
  ss.toast(sent + ' email(s) sent', '⚡ Automations');
}

/** Finds a file by its Drive link, or by its name inside FOLDER_NAME. */
function findFile_(text) {
  if (!text) return null;
  const id = /\/d\/([\w-]{20,})|[?&]id=([\w-]{20,})/.exec(text);
  if (id) return DriveApp.getFileById(id[1] || id[2]);
  const folders = DriveApp.getFoldersByName(FOLDER_NAME);
  if (!folders.hasNext()) return null;
  const files = folders.next().getFilesByName(text);
  return files.hasNext() ? files.next() : null;
}

function alert_(message) {
  SpreadsheetApp.getUi().alert(message);
}
