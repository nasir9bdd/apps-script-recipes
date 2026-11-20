/**
 * Auto-Archive Old Rows (Apps Script Recipes #8)
 * Moves rows older than a number of days to an Archive tab, so your
 * main sheet stays short and fast. Can run by itself every night.
 *
 * How to use: ⚡ Automations → "Archive old rows now", then
 * "Turn on nightly archiving" to make it automatic.
 *
 * License: MIT. Free to use and modify.
 */

// ================= SETTINGS: change these =================
const SHEET_NAME    = 'Orders';        // tab to clean up
const ARCHIVE_SHEET = 'Archive';       // where old rows go (created if missing)
const DATE_COLUMN   = 'Order Date';    // header of the date to check
const OLDER_THAN    = 30;              // days
const ONLY_IF       = { 'Status': 'Delivered' };   // extra rule, or {} for none
const RUN_AT_HOUR   = 2;               // nightly run at this hour, 0 to 23
// ===========================================================


/** Adds the ⚡ Automations menu when the spreadsheet opens. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('⚡ Automations')
    .addItem('Archive old rows now', 'archiveNow')
    .addSeparator()
    .addItem('Turn on nightly archiving', 'turnOnNightly')
    .addItem('Turn off nightly archiving', 'turnOffNightly')
    .addToUi();
}

function archiveNow() {
  const moved = archiveOldRows();
  SpreadsheetApp.getActive().toast(moved + ' row(s) moved to ' + ARCHIVE_SHEET,
    '⚡ Automations');
}

/** Moves every matching row to the archive. The nightly schedule runs this. */
function archiveOldRows() {
  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('No tab called "' + SHEET_NAME + '". Check SETTINGS.');
  const values = sheet.getDataRange().getValues();
  const headers = values[0].map(h => String(h).trim());
  const dateCol = headers.indexOf(DATE_COLUMN);
  if (dateCol < 0) throw new Error('No column "' + DATE_COLUMN + '". See SETTINGS.');
  const rules = Object.entries(ONLY_IF).map(([h, v]) => [headers.indexOf(h), v]);
  const cutoff = new Date(Date.now() - OLDER_THAN * 86400000);

  const old = [];
  values.forEach((row, i) => {
    if (i === 0 || !(row[dateCol] instanceof Date) || row[dateCol] >= cutoff) return;
    if (rules.every(([c, v]) => c >= 0 && String(row[c]) === v)) old.push(i + 1);
  });
  if (!old.length) return 0;

  let archive = ss.getSheetByName(ARCHIVE_SHEET);
  if (!archive) {
    archive = ss.insertSheet(ARCHIVE_SHEET);
    archive.appendRow(headers).setFrozenRows(1);
    archive.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  }
  const rows = old.map(r => values[r - 1]);
  const formats = sheet.getDataRange().getNumberFormats();   // keep date, $ formats
  archive.getRange(archive.getLastRow() + 1, 1, rows.length, headers.length)
    .setValues(rows).setNumberFormats(old.map(r => formats[r - 1]));
  old.reverse().forEach(r => sheet.deleteRow(r));          // bottom up
  return rows.length;
}

function turnOnNightly() {
  turnOff_();
  ScriptApp.newTrigger('archiveOldRows').timeBased().everyDays(1).atHour(RUN_AT_HOUR)
    .create();
  SpreadsheetApp.getActive().toast('Nightly archiving on, every night at '
    + RUN_AT_HOUR + ':00', '⚡ Automations');
}

function turnOffNightly() {
  const n = turnOff_();
  SpreadsheetApp.getActive().toast(n ? 'Nightly archiving off' : 'It was not on',
    '⚡ Automations');
}

function turnOff_() {
  const mine = ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'archiveOldRows');
  mine.forEach(t => ScriptApp.deleteTrigger(t));
  return mine.length;
}
