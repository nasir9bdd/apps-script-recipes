/**
 * Create a Drive Folder for Every Client or Project (Apps Script Recipes #24)
 * Makes one Google Drive folder per row, with the same subfolders inside
 * each one, and puts a link to the folder in your sheet.
 * Turn on auto-create, and every new row gets its folder by itself.
 *
 * How to use: ⚡ Automations → "Create folders now".
 * Rows that already have a link are skipped. Existing folders are reused.
 *
 * License: MIT. Free to use and modify.
 */

// ================= SETTINGS: change these =================
const SHEET_NAME    = 'Clients';                       // tab with one row per client
const FOLDER_NAME   = '{{Client}} - {{Project}}';      // name of each folder
const PARENT_FOLDER = 'Clients';                       // all folders go in here
const SUBFOLDERS    = ['Contracts', 'Invoices', 'Photos'];   // [] = none
const LINK_COLUMN   = 'Folder';                        // header where links go
// ===========================================================


/** Adds the ⚡ Automations menu when the spreadsheet opens. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('⚡ Automations')
    .addItem('Create folders now', 'createFoldersNow')
    .addSeparator()
    .addItem('Turn on auto-create', 'turnOnAuto')
    .addItem('Turn off auto-create', 'turnOffAuto')
    .addToUi();
}

function createFoldersNow() {
  const n = createFolders();
  SpreadsheetApp.getActive().toast(n + ' folder(s) created', '⚡ Automations');
}

/** Runs after every edit once auto-create is on. */
function onEditCreate(e) {
  if (e.range.getSheet().getName() === SHEET_NAME) createFolders();
}

/** Makes a folder for every complete row that has no link yet. */
function createFolders() {
  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('No tab called "' + SHEET_NAME + '". Check SETTINGS.');
  const values = sheet.getDataRange().getDisplayValues();
  const headers = values[0].map(h => h.trim());
  const linkCol = headers.indexOf(LINK_COLUMN);
  if (linkCol < 0) throw new Error('No column "' + LINK_COLUMN + '". Check SETTINGS.');
  const parent = folder_(DriveApp, PARENT_FOLDER);
  let made = 0;

  values.slice(1).forEach((row, i) => {
    if (row[linkCol]) return;                          // already has a folder
    let missing = false;
    const name = FOLDER_NAME.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (m, h) => {
      const v = row[headers.indexOf(h)];
      if (!v) missing = true;
      return v;
    });
    if (missing) return;                               // row not filled in yet

    const folder = folder_(parent, name);
    SUBFOLDERS.forEach(sub => folder_(folder, sub));
    sheet.getRange(i + 2, linkCol + 1)
      .setFormula('=HYPERLINK("' + folder.getUrl() + '", "Open folder")');
    SpreadsheetApp.flush();
    made++;
  });
  return made;
}

/** Finds a folder by name inside `parent`, or creates it. */
function folder_(parent, name) {
  const found = parent.getFoldersByName(name);
  return found.hasNext() ? found.next() : parent.createFolder(name);
}

function turnOnAuto() {
  turnOff_();
  ScriptApp.newTrigger('onEditCreate').forSpreadsheet(SpreadsheetApp.getActive())
    .onEdit().create();
  SpreadsheetApp.getActive().toast('Auto-create on. Add a client to try it!',
    '⚡ Automations');
}

function turnOffAuto() {
  const n = turnOff_();
  SpreadsheetApp.getActive().toast(n ? 'Auto-create off' : 'It was not on',
    '⚡ Automations');
}

function turnOff_() {
  const mine = ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'onEditCreate');
  mine.forEach(t => ScriptApp.deleteTrigger(t));
  return mine.length;
}
