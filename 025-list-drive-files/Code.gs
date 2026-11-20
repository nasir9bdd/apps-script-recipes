/**
 * List All Files in a Drive Folder (Apps Script Recipes #25)
 * Writes every file in a Google Drive folder into your sheet: name, type,
 * size, last updated, owner and a link. Can include subfolders too.
 *
 * How to use: put the folder's name or link in FOLDER, then
 * ⚡ Automations → "List files". Run it again any time to refresh.
 *
 * License: MIT. Free to use and modify.
 */

// ================= SETTINGS: change these =================
const FOLDER     = 'Invoices (PDF)';     // folder name, or paste the folder's link
const SHEET_NAME = 'Files';              // tab for the list (replaced each time)
const SUBFOLDERS = true;                 // true = also list files in subfolders
const NEWEST_FIRST = true;               // false = sort by name
// ===========================================================


/** Adds the ⚡ Automations menu when the spreadsheet opens. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('⚡ Automations')
    .addItem('List files', 'listFiles')
    .addToUi();
}

function listFiles() {
  const ss = SpreadsheetApp.getActive();
  const folder = folder_(FOLDER);
  const zone = ss.getSpreadsheetTimeZone();
  const rows = [];
  collect_(folder, folder.getName(), rows);

  rows.sort((a, b) => NEWEST_FIRST ? b.updated - a.updated
                                     : a.name.localeCompare(b.name));
  const table = [['Name', 'Type', 'Size', 'Last Updated', 'Owner', 'Folder', 'Link']]
    .concat(rows.map(f => [f.name, f.type, size_(f.size),
      Utilities.formatDate(f.updated, zone, 'MMM d, yyyy h:mm a'),
      f.owner, f.folder, '=HYPERLINK("' + f.url + '", "Open")']));

  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  sheet.clearContents();
  sheet.getRange(1, 1, table.length, table[0].length).setValues(table);
  sheet.getRange(1, 1, 1, table[0].length).setFontWeight('bold');
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, table[0].length);
  ss.toast(rows.length + ' file(s) listed from "' + folder.getName() + '"',
    '⚡ Automations');
}

/** Adds the files of one folder (and its subfolders) to rows. */
function collect_(folder, path, rows) {
  const files = folder.getFiles();
  while (files.hasNext()) {
    const f = files.next();
    rows.push({ name: f.getName(), type: type_(f.getMimeType()), size: f.getSize(),
      updated: f.getLastUpdated(), owner: f.getOwner() ? f.getOwner().getEmail() : '',
      folder: path, url: f.getUrl() });
  }
  if (!SUBFOLDERS) return;
  const subs = folder.getFolders();
  while (subs.hasNext()) {
    const sub = subs.next();
    collect_(sub, path + ' / ' + sub.getName(), rows);
  }
}

function folder_(nameOrLink) {
  const id = /folders\/([\w-]{20,})/.exec(nameOrLink);
  if (id) return DriveApp.getFolderById(id[1]);
  const found = DriveApp.getFoldersByName(nameOrLink);
  if (!found.hasNext()) throw new Error('No folder called "' + nameOrLink + '".');
  return found.next();
}

/** "application/pdf" → "PDF", Google files → "Google Sheets" and so on. */
function type_(mime) {
  const google = { spreadsheet: 'Google Sheets', document: 'Google Docs',
    presentation: 'Google Slides', form: 'Google Forms', folder: 'Folder' };
  const g = /^application\/vnd\.google-apps\.(\w+)/.exec(mime);
  if (g) return google[g[1]] || g[1];
  return (mime.split('/')[1] || mime).split(/[.+-]/).pop().toUpperCase();
}

/** 1536 → "1.5 KB" */
function size_(bytes) {
  if (!bytes) return '';
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  while (bytes >= 1024 && i < units.length - 1) { bytes /= 1024; i++; }
  return (i ? bytes.toFixed(1) : bytes) + ' ' + units[i];
}
