/**
 * Remove Blank Rows and Duplicates in One Click (Apps Script Recipes #7)
 * Deletes empty rows and repeated rows, and tells you how many it removed.
 * Choose which columns decide what counts as a duplicate.
 *
 * How to use: ⚡ Automations → "Clean up sheet".
 * Tip: File → Version history lets you undo a cleanup.
 *
 * License: MIT. Free to use and modify.
 */

// ================= SETTINGS: change these =================
const SHEET_NAME   = 'Contacts';       // tab to clean
const MATCH_ON     = ['Email'];        // duplicate = same value here; [] = whole row
const IGNORE_CASE  = true;             // true = "ANA@x.com" equals "ana@x.com"
const KEEP         = 'first';          // 'first' or 'last' copy of a duplicate
const HEADER_ROWS  = 1;                // rows at the top that are never removed
// ===========================================================


/** Adds the ⚡ Automations menu when the spreadsheet opens. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('⚡ Automations')
    .addItem('Clean up sheet', 'cleanUp')
    .addToUi();
}

function cleanUp() {
  const ui = SpreadsheetApp.getUi();
  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
  if (!sheet) return ui.alert('No tab called "' + SHEET_NAME + '". Check SETTINGS.');

  const values = sheet.getDataRange().getDisplayValues();
  const headers = values[HEADER_ROWS - 1].map(h => h.trim());
  const cols = MATCH_ON.map(name => headers.indexOf(name));
  if (cols.includes(-1)) return ui.alert('A MATCH_ON column was not found.');

  const rows = values.slice(HEADER_ROWS)
    .map((cells, i) => ({ cells, row: i + 1 + HEADER_ROWS }));
  if (KEEP === 'last') rows.reverse();
  const seen = new Set(), remove = [];
  let blanks = 0, dupes = 0;
  for (const { cells, row } of rows) {
    if (cells.every(c => c.trim() === '')) { remove.push(row); blanks++; continue; }
    const parts = cols.length ? cols.map(c => cells[c]) : cells;
    let key = parts.map(c => c.trim()).join('|');
    if (IGNORE_CASE) key = key.toLowerCase();
    if (seen.has(key)) { remove.push(row); dupes++; } else seen.add(key);
  }

  remove.sort((a, b) => b - a).forEach(row => sheet.deleteRow(row));   // bottom up
  ui.alert('Done! Removed ' + blanks + ' blank row(s) and '
    + dupes + ' duplicate(s).');
}
