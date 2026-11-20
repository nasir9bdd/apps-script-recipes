/**
 * Combine Many Tabs or Files into One Master Sheet (Apps Script Recipes #29)
 * Copies the rows of every tab (or of every spreadsheet in a Drive folder)
 * into one master tab. Columns are matched by header, even if the order
 * is different, and a "Source" column says where each row came from.
 *
 * How to use: ⚡ Automations → "Combine now". Run it again any time,
 * or turn on the hourly update. The master tab is rebuilt each time.
 *
 * License: MIT. Free to use and modify.
 */

// ================= SETTINGS: change these =================
const MASTER_SHEET = 'All Sales';   // the combined tab (replaced each time)
const FOLDER       = '';            // '' = tabs in this file, or a folder name/link
const SKIP_TABS    = ['Settings'];  // tabs to leave out
const ADD_SOURCE   = true;          // true = add a "Source" column
// ===========================================================


/** Adds the ⚡ Automations menu when the spreadsheet opens. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('⚡ Automations')
    .addItem('Combine now', 'combineNow')
    .addSeparator()
    .addItem('Turn on hourly update', 'turnOnHourly')
    .addItem('Turn off hourly update', 'turnOffHourly')
    .addToUi();
}

function combineNow() {
  const n = combine();
  SpreadsheetApp.getActive().toast(n + ' rows combined into "' + MASTER_SHEET + '"',
    '⚡ Automations', 10);
}

/** Rebuilds the master tab. Returns the number of rows. */
function combine() {
  const ss = SpreadsheetApp.getActive();
  const sources = [];                                // [name, values]
  if (FOLDER) {
    const files = folder_(FOLDER).getFilesByType(MimeType.GOOGLE_SHEETS);
    while (files.hasNext()) {
      const file = files.next();
      if (file.getId() === ss.getId()) continue;
      const first = SpreadsheetApp.open(file).getSheets()[0];
      sources.push([file.getName(), first.getDataRange().getDisplayValues()]);
    }
  } else {
    ss.getSheets().forEach(s => {
      const name = s.getName();
      if (name === MASTER_SHEET || SKIP_TABS.includes(name)) return;
      sources.push([name, s.getDataRange().getDisplayValues()]);
    });
  }

  const headers = [];                                // every header, in order seen
  sources.forEach(([, v]) => v[0].forEach(h => {
    if (h !== '' && !headers.includes(h)) headers.push(h);
  }));
  const rows = [];
  sources.forEach(([name, v]) => v.slice(1).forEach(row => {
    if (row.every(c => c === '')) return;            // skip empty rows
    const out = headers.map(h => {
      const c = v[0].indexOf(h);
      return c < 0 ? '' : row[c];
    });
    rows.push(ADD_SOURCE ? out.concat(name) : out);
  }));

  const table = [ADD_SOURCE ? headers.concat('Source') : headers].concat(rows);
  const master = ss.getSheetByName(MASTER_SHEET) || ss.insertSheet(MASTER_SHEET, 0);
  master.clearContents();
  master.getRange(1, 1, table.length, table[0].length).setValues(table);
  master.getRange(1, 1, 1, table[0].length).setFontWeight('bold');
  master.setFrozenRows(1);
  master.activate();
  return rows.length;
}

function folder_(nameOrLink) {
  const id = /folders\/([\w-]{20,})/.exec(nameOrLink);
  if (id) return DriveApp.getFolderById(id[1]);
  const found = DriveApp.getFoldersByName(nameOrLink);
  if (!found.hasNext()) throw new Error('No folder called "' + nameOrLink + '".');
  return found.next();
}

function turnOnHourly() {
  turnOff_();
  ScriptApp.newTrigger('combine').timeBased().everyHours(1).create();
  SpreadsheetApp.getActive().toast('Hourly update on', '⚡ Automations');
}

function turnOffHourly() {
  const n = turnOff_();
  SpreadsheetApp.getActive().toast(n ? 'Hourly update off' : 'It was not on',
    '⚡ Automations');
}

function turnOff_() {
  const mine = ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'combine');
  mine.forEach(t => ScriptApp.deleteTrigger(t));
  return mine.length;
}
