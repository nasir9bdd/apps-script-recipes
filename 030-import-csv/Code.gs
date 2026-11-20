/**
 * Auto-Import CSV Files from a Drive Folder (Apps Script Recipes #30)
 * Drop CSV files into a Google Drive folder: their rows are added to your
 * sheet, and each file is moved to an "Imported" folder so it's never
 * imported twice. Turn on auto-import to check the folder every 15 min.
 *
 * How to use: ⚡ Automations → "Import now", or "Turn on auto-import".
 *
 * License: MIT. Free to use and modify.
 */

// ================= SETTINGS: change these =================
const FOLDER      = 'CSV Inbox';    // folder name, or paste the folder's link
const SHEET_NAME  = 'Orders';       // rows are added at the bottom of this tab
const DONE_FOLDER = 'Imported';     // imported files move here (inside FOLDER)
const HAS_HEADER  = true;           // true = skip the first line of each file
const ADD_FILE_NAME = true;         // true = add a column with the file's name
// ===========================================================


/** Adds the ⚡ Automations menu when the spreadsheet opens. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('⚡ Automations')
    .addItem('Import now', 'importNow')
    .addSeparator()
    .addItem('Turn on auto-import', 'turnOnAuto')
    .addItem('Turn off auto-import', 'turnOffAuto')
    .addToUi();
}

function importNow() {
  const [files, rows] = importCsv();
  SpreadsheetApp.getActive().toast(files + ' file(s) imported, ' + rows + ' new rows',
    '⚡ Automations', 10);
}

/** Imports every CSV in the folder. Returns [files, rows]. */
function importCsv() {
  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('No tab called "' + SHEET_NAME + '". Check SETTINGS.');
  const inbox = folder_(FOLDER);
  const done = inbox.getFoldersByName(DONE_FOLDER).hasNext()
    ? inbox.getFoldersByName(DONE_FOLDER).next() : inbox.createFolder(DONE_FOLDER);

  const csvs = [];
  const files = inbox.getFiles();
  while (files.hasNext()) {
    const f = files.next();
    if (/\.csv$/i.test(f.getName()) || f.getMimeType() === 'text/csv') csvs.push(f);
  }
  csvs.sort((a, b) => a.getDateCreated() - b.getDateCreated());   // oldest first

  let added = 0;
  csvs.forEach(file => {
    let rows = Utilities.parseCsv(file.getBlob().getDataAsString());
    if (HAS_HEADER) rows = rows.slice(1);
    rows = rows.filter(r => r.some(c => c.trim() !== ''));
    if (ADD_FILE_NAME) rows = rows.map(r => r.concat(file.getName()));
    if (rows.length) {
      const width = Math.max(...rows.map(r => r.length));
      rows = rows.map(r => r.concat(Array(width - r.length).fill('')));
      sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, width).setValues(rows);
      added += rows.length;
    }
    file.moveTo(done);                               // never imported twice
    SpreadsheetApp.flush();
  });
  return [csvs.length, added];
}

function folder_(nameOrLink) {
  const id = /folders\/([\w-]{20,})/.exec(nameOrLink);
  if (id) return DriveApp.getFolderById(id[1]);
  const found = DriveApp.getFoldersByName(nameOrLink);
  if (!found.hasNext()) throw new Error('No folder called "' + nameOrLink + '".');
  return found.next();
}

function turnOnAuto() {
  turnOff_();
  ScriptApp.newTrigger('importCsv').timeBased().everyMinutes(15).create();
  SpreadsheetApp.getActive().toast('Auto-import on: every 15 minutes',
    '⚡ Automations', 10);
}

function turnOffAuto() {
  const n = turnOff_();
  SpreadsheetApp.getActive().toast(n ? 'Auto-import off' : 'It was not on',
    '⚡ Automations');
}

function turnOff_() {
  const mine = ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'importCsv');
  mine.forEach(t => ScriptApp.deleteTrigger(t));
  return mine.length;
}
