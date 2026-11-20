/**
 * Bulk Share or Unshare Drive Files from a Sheet (Apps Script Recipes #27)
 * Shows who can open every file in a Drive folder (a sharing audit), and
 * changes the link sharing of many files at once, from a dropdown.
 *
 * How to use: ⚡ Automations → "1. Check sharing", pick a value in
 * "Change To", then ⚡ Automations → "2. Apply changes".
 *
 * License: MIT. Free to use and modify.
 */

// ================= SETTINGS: change these =================
const FOLDER     = 'Photo Shoot';   // folder name, or paste the folder's link
const SHEET_NAME = 'Sharing';       // tab for the audit
const SUBFOLDERS = false;           // true = also check files in subfolders
// ===========================================================

// The choices in the "Change To" dropdown, and what each one does.
const LINK = DriveApp.Access.ANYONE_WITH_LINK;
const CHOICES = {
  'Private':             [DriveApp.Access.PRIVATE, DriveApp.Permission.NONE],
  'Anyone: can view':    [LINK, DriveApp.Permission.VIEW],
  'Anyone: can comment': [LINK, DriveApp.Permission.COMMENT],
  'Anyone: can edit':    [LINK, DriveApp.Permission.EDIT],
};

/** Adds the ⚡ Automations menu when the spreadsheet opens. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('⚡ Automations')
    .addItem('1. Check sharing', 'checkSharing')
    .addItem('2. Apply changes', 'applyChanges')
    .addToUi();
}

/** Lists every file with its link access and the people it's shared with. */
function checkSharing() {
  const ss = SpreadsheetApp.getActive();
  const rows = [];
  collect_(folder_(FOLDER), rows);
  rows.sort((a, b) => a[0].localeCompare(b[0]));

  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  sheet.clear();
  const table = [['File', 'Who Can Open', 'Shared With', 'Change To', 'Status',
    'File ID']].concat(rows);
  sheet.getRange(1, 1, table.length, 6).setValues(table);
  sheet.getRange(1, 1, 1, 6).setFontWeight('bold');
  if (rows.length) {
    sheet.getRange(2, 4, rows.length).setDataValidation(SpreadsheetApp
      .newDataValidation().requireValueInList(Object.keys(CHOICES)).build());
  }
  sheet.activate();
  ss.toast(rows.length + ' file(s) checked', '⚡ Automations', 10);
}

/** Changes the sharing of every file that has a "Change To" value. */
function applyChanges() {
  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('Run "1. Check sharing" first.');
  const values = sheet.getDataRange().getValues();
  let changed = 0;

  values.slice(1).forEach((row, i) => {
    const choice = String(row[3]).trim();
    if (!choice) return;
    const status = sheet.getRange(i + 2, 5);
    if (!CHOICES[choice]) return status.setValue('Unknown choice');
    try {
      const file = DriveApp.getFileById(row[5]);
      file.setSharing(...CHOICES[choice]);
      sheet.getRange(i + 2, 2).setValue(access_(file));
      sheet.getRange(i + 2, 4).clearContent();
      status.setValue('Changed ✓');
      changed++;
    } catch (e) {
      status.setValue('Error: ' + e.message);
    }
    SpreadsheetApp.flush();
  });
  ss.toast(changed + ' file(s) changed', '⚡ Automations', 10);
}

function collect_(folder, rows) {
  const files = folder.getFiles();
  while (files.hasNext()) {
    const f = files.next();
    const people = f.getEditors().concat(f.getViewers()).map(u => u.getEmail());
    rows.push([f.getName(), access_(f), people.join(', ') || 'Only you', '', '',
      f.getId()]);
  }
  if (!SUBFOLDERS) return;
  const subs = folder.getFolders();
  while (subs.hasNext()) collect_(subs.next(), rows);
}

/** "Anyone with the link: can view", "Private" and so on. */
function access_(file) {
  const access = file.getSharingAccess();
  if (access === DriveApp.Access.PRIVATE) return 'Private';
  const who = access === DriveApp.Access.ANYONE_WITH_LINK ? 'Anyone with the link'
    : access === DriveApp.Access.ANYONE ? 'Public on the web' : 'Your organization';
  return who + ': can ' + String(file.getSharingPermission()).toLowerCase();
}

/** Finds a folder by its link or by its name. */
function folder_(nameOrLink) {
  const id = /folders\/([\w-]{20,})/.exec(nameOrLink);
  if (id) return DriveApp.getFolderById(id[1]);
  const found = DriveApp.getFoldersByName(nameOrLink);
  if (!found.hasNext()) throw new Error('No folder called "' + nameOrLink + '".');
  return found.next();
}
