/**
 * Auto-Sort a Sheet Whenever Data Changes (Apps Script Recipes #4)
 * Every time you edit the sheet, the rows are sorted again, for example
 * by due date or by priority. Your header row stays at the top.
 *
 * How to use: paste, save, done. It runs by itself on every edit.
 *
 * License: MIT. Free to use and modify.
 */

// ================= SETTINGS: change these =================
const SHEET_NAME  = 'Tasks';        // tab to keep sorted
const SORT_BY     = 'Due Date';     // header of the column to sort by
const ASCENDING   = true;           // true = A to Z, oldest first; false = reverse
const THEN_BY     = '';             // optional second sort column, e.g. 'Owner'
const HEADER_ROWS = 1;              // rows at the top that never move
// ===========================================================


/** Runs automatically after every edit. */
function onEdit(e) {
  const sheet = e.range.getSheet();
  if (sheet.getName() !== SHEET_NAME || e.range.getRow() <= HEADER_ROWS) return;

  const lastRow = sheet.getLastRow(), lastCol = sheet.getLastColumn();
  if (lastRow <= HEADER_ROWS + 1) return;
  const headers = sheet.getRange(HEADER_ROWS, 1, 1, lastCol).getDisplayValues()[0]
    .map(h => h.trim());

  const order = [];
  for (const name of [SORT_BY, THEN_BY].filter(String)) {
    const i = headers.indexOf(name);
    if (i < 0) return e.source.toast('No column "' + name + '". Check SETTINGS.');
    order.push({ column: i + 1, ascending: ASCENDING });
  }
  sheet.getRange(HEADER_ROWS + 1, 1, lastRow - HEADER_ROWS, lastCol).sort(order);
}
