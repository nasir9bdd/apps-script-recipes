/**
 * Move a Row to Another Tab When It's Done (Apps Script Recipes #3)
 * When the Status of a row becomes "Done", the whole row moves to the "Done" tab.
 * The Done tab is created for you (with the same headers) if it doesn't exist yet.
 *
 * How to use: paste, save, and set any row's Status to Done. No menu and no
 * permissions needed: onEdit runs by itself every time you edit a cell.
 *
 * License: MIT. Free to use and modify.
 */

// ================= SETTINGS: change these =================
const SOURCE_SHEET  = 'Tasks';    // tab with your active rows
const TARGET_SHEET  = 'Done';     // tab where finished rows go
const STATUS_COLUMN = 'Status';   // header of the column to watch
const MOVE_WHEN     = 'Done';     // Status value that moves the row (any case)
// ===========================================================


/** Runs automatically after every edit you make in the spreadsheet. */
function onEdit(e) {
  const range = e.range;
  const sheet = range.getSheet();
  if (sheet.getName() !== SOURCE_SHEET || range.getLastRow() < 2) return;

  const lastCol = sheet.getLastColumn();
  const headers = sheet.getRange(1, 1, 1, lastCol).getDisplayValues()[0].map(trim_);
  const statusCol = headers.indexOf(STATUS_COLUMN) + 1;
  if (statusCol < range.getColumn() || statusCol > range.getLastColumn()) return;

  const ss = e.source;
  let target = ss.getSheetByName(TARGET_SHEET);
  if (!target) {                    // first time: create it with the same headers
    target = ss.insertSheet(TARGET_SHEET);
    sheet.getRange(1, 1, 1, lastCol).copyTo(target.getRange(1, 1));
    target.setFrozenRows(1);
    sheet.activate();                               // stay on the source tab
  }

  // bottom-up, so deleting a row doesn't shift the rows still to check
  for (let r = range.getLastRow(); r >= Math.max(2, range.getRow()); r--) {
    const status = String(sheet.getRange(r, statusCol).getValue()).trim().toLowerCase();
    if (status !== MOVE_WHEN.toLowerCase()) continue;
    const destination = target.getRange(target.getLastRow() + 1, 1);
    sheet.getRange(r, 1, 1, lastCol).copyTo(destination);   // values + formatting
    sheet.deleteRow(r);
  }
}

function trim_(text) { return String(text).trim(); }
