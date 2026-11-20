/**
 * Automatic Timestamps in Google Sheets (Apps Script Recipes #2)
 * When you edit a row, "Last Updated" gets the current date and time.
 * "Created" is filled once, the first time the row gets data, and never changes.
 *
 * How to use: paste, save, and start typing in your sheet. No menu and no
 * permissions needed: onEdit runs by itself every time you edit a cell.
 *
 * License: MIT. Free to use and modify.
 */

// ================= SETTINGS: change these =================
const SHEET_NAME     = 'Tasks';          // name of the tab to watch
const WATCH_COLUMNS  = [];               // e.g. ['Status']. Empty = every column
const UPDATED_COLUMN = 'Last Updated';   // header of the "last changed" column
const CREATED_COLUMN = 'Created';        // "first added" column, or '' to turn off
const DATE_FORMAT    = 'mmm d, yyyy h:mm am/pm';
// ===========================================================


/** Runs automatically after every edit you make in the spreadsheet. */
function onEdit(e) {
  const range = e.range;
  const sheet = range.getSheet();
  if (sheet.getName() !== SHEET_NAME || range.getLastRow() < 2) return;

  const headers = sheet.getDataRange().getDisplayValues()[0].map(trim_);
  const updatedCol = headers.indexOf(UPDATED_COLUMN) + 1;
  const createdCol = CREATED_COLUMN ? headers.indexOf(CREATED_COLUMN) + 1 : 0;
  if (!updatedCol) return;

  // react only to the watched columns (never to the timestamp columns themselves)
  const watched = WATCH_COLUMNS.map(h => headers.indexOf(h) + 1).filter(c => c > 0);
  let relevant = false;
  for (let c = range.getColumn(); c <= range.getLastColumn(); c++) {
    if (c === updatedCol || c === createdCol) continue;
    if (!WATCH_COLUMNS.length || watched.includes(c)) { relevant = true; break; }
  }
  if (!relevant) return;

  const now = new Date();
  for (let r = Math.max(2, range.getRow()); r <= range.getLastRow(); r++) {
    const row = sheet.getRange(r, 1, 1, headers.length).getValues()[0];
    const isEmpty = row.every((v, i) => v === '' || i === updatedCol - 1 || i === createdCol - 1);
    const updated = sheet.getRange(r, updatedCol);
    const created = createdCol ? sheet.getRange(r, createdCol) : null;

    if (isEmpty) {                          // row was cleared: clear its timestamps too
      updated.clearContent();
      if (created) created.clearContent();
      continue;
    }
    updated.setValue(now).setNumberFormat(DATE_FORMAT);
    if (created && created.isBlank()) created.setValue(now).setNumberFormat(DATE_FORMAT);
  }
}

function trim_(text) { return String(text).trim(); }
