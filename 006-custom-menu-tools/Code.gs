/**
 * One-Click Tools: Build Your Own Custom Menu (Apps Script Recipes #6)
 * Adds a menu with handy buttons for a daily log: add today's row,
 * jump to today, sort newest first, and clear the selected rows.
 *
 * How to use: paste, save, reload the sheet. Add your own tools by
 * copying one addItem line and one small function.
 *
 * License: MIT. Free to use and modify.
 */

// ================= SETTINGS: change these =================
const SHEET_NAME  = 'Log';          // tab the tools work on
const DATE_COLUMN = 'Date';         // header of the date column
const MENU_NAME   = '⚡ Tools';      // name shown in the menu bar
// ===========================================================


/** Builds the menu. Each addItem = one button: (label, function name). */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu(MENU_NAME)
    .addItem('➕ Add today\'s row', 'addTodayRow')
    .addItem('📅 Go to today', 'goToToday')
    .addItem('↕ Sort newest first', 'sortNewestFirst')
    .addSeparator()
    .addItem('🧹 Clear selected rows', 'clearSelectedRows')
    .addToUi();
}

/** Adds a row with today's date at the bottom and selects the next cell. */
function addTodayRow() {
  const { sheet, dateCol } = log_();
  const row = sheet.getLastRow() + 1;
  sheet.getRange(row, dateCol).setValue(new Date()).setNumberFormat('mmm d, yyyy');
  sheet.getRange(row, dateCol + 1).activate();
}

/** Selects the first row with today's date. */
function goToToday() {
  const { sheet, dateCol } = log_();
  const zone = SpreadsheetApp.getActive().getSpreadsheetTimeZone();
  const day = d => Utilities.formatDate(d, zone, 'yyyy-MM-dd');
  const today = day(new Date());
  const dates = sheet.getRange(2, dateCol, Math.max(sheet.getLastRow() - 1, 1))
    .getValues().flat();
  const i = dates.findIndex(d => d instanceof Date && day(d) === today);
  if (i < 0) return SpreadsheetApp.getActive().toast('No row for today yet.');
  sheet.getRange(i + 2, 1, 1, sheet.getLastColumn()).activate();
}

/** Sorts all rows by date, newest at the top. */
function sortNewestFirst() {
  const { sheet, dateCol } = log_();
  if (sheet.getLastRow() < 3) return;
  sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn())
    .sort({ column: dateCol, ascending: false });
}

/** Clears the contents of the selected rows (asks first). */
function clearSelectedRows() {
  const ui = SpreadsheetApp.getUi();
  const range = SpreadsheetApp.getActiveRange();
  const n = range.getNumRows();
  const ok = ui.alert('Clear ' + n + ' row(s)?', ui.ButtonSet.YES_NO);
  if (ok !== ui.Button.YES) return;
  const sheet = range.getSheet();
  sheet.getRange(range.getRow(), 1, n, sheet.getLastColumn()).clearContent();
}

function log_() {
  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('No tab called "' + SHEET_NAME + '". Check SETTINGS.');
  sheet.activate();
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0]
    .map(h => h.trim());
  const dateCol = headers.indexOf(DATE_COLUMN) + 1;
  if (!dateCol) throw new Error('No column "' + DATE_COLUMN + '". Check SETTINGS.');
  return { sheet, dateCol };
}
