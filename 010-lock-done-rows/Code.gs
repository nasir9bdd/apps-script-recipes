/**
 * Lock Rows After They're Marked Complete (Apps Script Recipes #10)
 * When a row's status becomes "Done", the whole row is protected, so
 * nobody can change it by accident. Change the status back to unlock it.
 * Only you (the owner) can still edit locked rows.
 *
 * How to use: ⚡ Automations → "Turn on row locking".
 *
 * License: MIT. Free to use and modify.
 */

// ================= SETTINGS: change these =================
const SHEET_NAME    = 'Tasks';          // tab to protect
const STATUS_COLUMN = 'Status';         // header of the status column
const LOCK_WHEN     = 'Done';           // lock a row when its status is this
const WARNING_ONLY  = false;            // true = only show a warning
// ===========================================================


/** Adds the ⚡ Automations menu when the spreadsheet opens. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('⚡ Automations')
    .addItem('Turn on row locking', 'turnOnLocking')
    .addItem('Turn off row locking', 'turnOffLocking')
    .addSeparator()
    .addItem('Unlock all rows', 'unlockAll')
    .addToUi();
}

/** Runs after every edit (once locking is on) and checks the edited rows. */
function checkEdit(e) {
  const r = e.range;
  if (r.getSheet().getName() !== SHEET_NAME) return;
  for (let row = Math.max(r.getRow(), 2); row <= r.getLastRow(); row++) check_(row);
}

/** Locks the row if its status is LOCK_WHEN, unlocks it otherwise. */
function check_(row) {
  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0]
    .map(h => h.trim());
  const col = headers.indexOf(STATUS_COLUMN);
  if (col < 0) throw new Error('No column "' + STATUS_COLUMN + '". Check SETTINGS.');

  const status = String(sheet.getRange(row, col + 1).getDisplayValue()).trim();
  const lock = sheet.getProtections(SpreadsheetApp.ProtectionType.RANGE)
    .find(p => p.getDescription().startsWith('Locked')
      && p.getRange().getRow() === row);

  if (status === LOCK_WHEN && !lock) {
    const p = sheet.getRange(row, 1, 1, sheet.getLastColumn()).protect()
      .setDescription('Locked: ' + status);
    if (WARNING_ONLY) return p.setWarningOnly(true);
    p.addEditor(Session.getEffectiveUser());     // you keep access
    p.removeEditors(p.getEditors());             // everyone else is locked out
    if (p.canDomainEdit()) p.setDomainEdit(false);
  } else if (status !== LOCK_WHEN && lock) {
    lock.remove();
  }
}

/** Turns on locking and locks every row that is already done. */
function turnOnLocking() {
  turnOff_();
  const ss = SpreadsheetApp.getActive();
  ScriptApp.newTrigger('checkEdit').forSpreadsheet(ss).onEdit().create();
  const sheet = ss.getSheetByName(SHEET_NAME);
  for (let row = 2; row <= sheet.getLastRow(); row++) check_(row);
  ss.toast('Row locking on. Mark a row "' + LOCK_WHEN + '" to lock it.',
    '⚡ Automations');
}

function turnOffLocking() {
  const n = turnOff_();
  SpreadsheetApp.getActive().toast(n ? 'Row locking off (locked rows stay locked)'
    : 'Row locking was not on', '⚡ Automations');
}

function unlockAll() {
  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
  const locks = sheet.getProtections(SpreadsheetApp.ProtectionType.RANGE)
    .filter(p => p.getDescription().startsWith('Locked'));
  locks.forEach(p => p.remove());
  SpreadsheetApp.getActive().toast(locks.length + ' row(s) unlocked', '⚡ Automations');
}

function turnOff_() {
  const mine = ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'checkEdit');
  mine.forEach(t => ScriptApp.deleteTrigger(t));
  return mine.length;
}
