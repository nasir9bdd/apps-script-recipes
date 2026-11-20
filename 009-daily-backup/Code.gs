/**
 * Daily Automatic Backup of Your Spreadsheet (Apps Script Recipes #9)
 * Saves a copy of this spreadsheet in a Google Drive folder every day,
 * keeps only the newest copies, and lists every backup in a log tab.
 *
 * How to use: ⚡ Automations → "Back up now" to test it, then
 * "Turn on daily backups". It keeps running when your computer is off.
 *
 * License: MIT. Free to use and modify.
 */

// ================= SETTINGS: change these =================
const FOLDER_NAME = 'Sheet Backups';               // Drive folder for the copies
const KEEP_COPIES = 7;                             // older copies go to the trash
const BACKUP_HOUR = 2;                             // 0-23, so 2 = around 2 AM
const FILE_NAME   = '{{name}} backup {{date}}';    // name of each copy
const LOG_SHEET   = 'Backup Log';                  // tab listing backups, '' = none
// ===========================================================


/** Adds the ⚡ Automations menu when the spreadsheet opens. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('⚡ Automations')
    .addItem('Back up now', 'backupNow')
    .addSeparator()
    .addItem('Turn on daily backups', 'turnOnBackups')
    .addItem('Turn off daily backups', 'turnOffBackups')
    .addToUi();
}

/** Copies this spreadsheet into the backup folder and removes old copies. */
function backupNow() {
  const ss = SpreadsheetApp.getActive();
  const zone = ss.getSpreadsheetTimeZone();
  const date = Utilities.formatDate(new Date(), zone, 'yyyy-MM-dd HH:mm');
  const name = FILE_NAME.replace('{{name}}', ss.getName()).replace('{{date}}', date);
  const folder = folder_(FOLDER_NAME);

  const copy = DriveApp.getFileById(ss.getId()).makeCopy(name, folder);
  const prefix = FILE_NAME.split('{{date}}')[0].replace('{{name}}', ss.getName());
  const removed = removeOld_(folder, prefix);

  if (LOG_SHEET) log_(ss, date, copy, removed);
  ss.toast('Backup saved: ' + name, '⚡ Automations');
}

/** Keeps the newest KEEP_COPIES backups and moves the rest to the trash. */
function removeOld_(folder, prefix) {
  const copies = [];
  const files = folder.getFilesByType(MimeType.GOOGLE_SHEETS);
  while (files.hasNext()) {
    const f = files.next();
    if (f.getName().startsWith(prefix)) copies.push(f);
  }
  copies.sort((a, b) => b.getDateCreated() - a.getDateCreated());   // newest first
  const old = copies.slice(KEEP_COPIES);
  old.forEach(f => f.setTrashed(true));
  return old.length;
}

/** Adds a row to the log tab (made the first time). */
function log_(ss, date, copy, removed) {
  let sheet = ss.getSheetByName(LOG_SHEET);
  if (!sheet) {
    sheet = ss.insertSheet(LOG_SHEET);
    sheet.appendRow(['Backed up', 'Copy', 'Old copies removed']);
    sheet.getRange('A1:C1').setFontWeight('bold');
    sheet.setColumnWidth(2, 380);
  }
  sheet.appendRow([date, '', removed]);
  sheet.getRange(sheet.getLastRow(), 2)
    .setFormula('=HYPERLINK("' + copy.getUrl() + '", "' + copy.getName() + '")');
  sheet.activate();
}

function turnOnBackups() {
  turnOff_();
  ScriptApp.newTrigger('backupNow').timeBased().everyDays(1).atHour(BACKUP_HOUR)
    .create();
  SpreadsheetApp.getActive().toast('Daily backups on, every day around '
    + BACKUP_HOUR + ':00', '⚡ Automations');
}

function turnOffBackups() {
  const n = turnOff_();
  SpreadsheetApp.getActive().toast(n ? 'Daily backups off' : 'They were not on',
    '⚡ Automations');
}

function turnOff_() {
  const mine = ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'backupNow');
  mine.forEach(t => ScriptApp.deleteTrigger(t));
  return mine.length;
}

function folder_(name) {
  const found = DriveApp.getFoldersByName(name);
  return found.hasNext() ? found.next() : DriveApp.createFolder(name);
}
