/**
 * Bulk Rename Files in Google Drive (Apps Script Recipes #26)
 * Lists every file in a Drive folder in your sheet. Type the new names
 * next to the old ones, and rename them all with one click.
 *
 * How to use: ⚡ Automations → "1. List files", fill in "New Name",
 * then ⚡ Automations → "2. Rename files". Empty "New Name" = no change.
 *
 * License: MIT. Free to use and modify.
 */

// ================= SETTINGS: change these =================
const FOLDER     = 'Photo Shoot';   // folder name, or paste the folder's link
const SHEET_NAME = 'Rename';        // tab for the list
const KEEP_EXTENSION = true;        // true = ".jpg" is kept if you leave it out
// ===========================================================


/** Adds the ⚡ Automations menu when the spreadsheet opens. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('⚡ Automations')
    .addItem('1. List files', 'listFiles')
    .addItem('2. Rename files', 'renameFiles')
    .addToUi();
}

/** Writes every file of the folder into the sheet (replaces the list). */
function listFiles() {
  const ss = SpreadsheetApp.getActive();
  const folder = folder_(FOLDER);
  const rows = [];
  const files = folder.getFiles();
  while (files.hasNext()) {
    const f = files.next();
    rows.push([f.getName(), '', '', f.getId()]);
  }
  rows.sort((a, b) => a[0].localeCompare(b[0]));

  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  sheet.clearContents();
  const table = [['Current Name', 'New Name', 'Status', 'File ID']].concat(rows);
  sheet.getRange(1, 1, table.length, 4).setValues(table);
  sheet.getRange(1, 1, 1, 4).setFontWeight('bold');
  sheet.activate();
  ss.toast(rows.length + ' file(s) listed. Type the new names in column B.',
    '⚡ Automations', 10);
}

/** Renames every file that has a new name. */
function renameFiles() {
  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('Run "1. List files" first.');
  const values = sheet.getDataRange().getValues();
  let renamed = 0;

  values.slice(1).forEach((row, i) => {
    const [oldName, newName, , id] = row.map(String);
    if (!newName.trim() || !id) return;              // nothing to rename
    let name = newName.trim();
    const ext = /\.[\w]+$/.exec(oldName);
    if (KEEP_EXTENSION && ext && !/\.[\w]+$/.test(name)) name += ext[0];

    const status = sheet.getRange(i + 2, 3);
    try {
      DriveApp.getFileById(id).setName(name);
      sheet.getRange(i + 2, 1, 1, 2).setValues([[name, '']]);
      status.setValue('Renamed ✓');
      renamed++;
    } catch (e) {
      status.setValue('Error: ' + e.message);
    }
    SpreadsheetApp.flush();
  });
  ss.toast(renamed + ' file(s) renamed', '⚡ Automations', 10);
}

/** Finds a folder by its link or by its name. */
function folder_(nameOrLink) {
  const id = /folders\/([\w-]{20,})/.exec(nameOrLink);
  if (id) return DriveApp.getFolderById(id[1]);
  const found = DriveApp.getFoldersByName(nameOrLink);
  if (!found.hasNext()) throw new Error('No folder called "' + nameOrLink + '".');
  return found.next();
}
