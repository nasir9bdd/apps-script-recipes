/**
 * Email Alert When a Number Crosses a Limit (Apps Script Recipes #14)
 * Sends you an email as soon as a value drops below its limit, e.g. low
 * stock, a budget running out or a score below target. One email per
 * drop: it alerts again only after the value has gone back up.
 *
 * How to use: ⚡ Automations → "Turn on alerts". Then just edit your sheet.
 *
 * License: MIT. Free to use and modify.
 */

// ================= SETTINGS: change these =================
const SHEET_NAME   = 'Inventory';    // tab to watch
const VALUE_COLUMN = 'Stock';        // the number to watch
const LIMIT_COLUMN = 'Min Stock';    // alert when the value is below this
const ALERT_COLUMN = 'Alert';        // the script notes sent alerts here
const SEND_TO      = 'me';           // 'me' = your own email, or any addresses
const SUBJECT      = 'Low stock: {{Item}} ({{Stock}} left)';
const MESSAGE      = '{{Item}} is down to {{Stock}}. The minimum is {{Min Stock}}.'
                   + '\n\nTime to reorder!';
// ===========================================================


/** Adds the ⚡ Automations menu when the spreadsheet opens. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('⚡ Automations')
    .addItem('Turn on alerts', 'turnOnAlerts')
    .addItem('Turn off alerts', 'turnOffAlerts')
    .addSeparator()
    .addItem('Check all rows now', 'checkAll')
    .addToUi();
}

/** Runs after every edit (once alerts are on) and checks the edited rows. */
function checkEdit(e) {
  const r = e.range;
  if (r.getSheet().getName() !== SHEET_NAME) return;
  for (let row = Math.max(r.getRow(), 2); row <= r.getLastRow(); row++) check_(row);
}

function checkAll() {
  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
  for (let row = 2; row <= sheet.getLastRow(); row++) check_(row);
  SpreadsheetApp.getActive().toast('All rows checked', '⚡ Automations');
}

/** Emails once when a row goes below its limit; resets when it is back up. */
function check_(row) {
  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
  const lastCol = sheet.getLastColumn();
  const headers = sheet.getRange(1, 1, 1, lastCol).getDisplayValues()[0]
    .map(h => h.trim());
  const values = sheet.getRange(row, 1, 1, lastCol).getValues()[0];
  const shown = sheet.getRange(row, 1, 1, lastCol).getDisplayValues()[0];
  const at = name => headers.indexOf(name);
  const value = values[at(VALUE_COLUMN)], limit = values[at(LIMIT_COLUMN)];
  const alertCell = sheet.getRange(row, at(ALERT_COLUMN) + 1);
  if (typeof value !== 'number' || typeof limit !== 'number') return;

  if (value >= limit) {                          // back up: ready for the next alert
    if (alertCell.getValue()) alertCell.clearContent();
    return;
  }
  if (alertCell.getValue()) return;              // already alerted for this drop

  const fill = text => text.replace(/\{\{\s*([^}]+?)\s*\}\}/g,
    (m, name) => at(name) >= 0 ? shown[at(name)] : m);
  const to = SEND_TO === 'me' ? Session.getEffectiveUser().getEmail() : SEND_TO;
  MailApp.sendEmail(to, fill(SUBJECT), fill(MESSAGE));
  const zone = SpreadsheetApp.getActive().getSpreadsheetTimeZone();
  const time = Utilities.formatDate(new Date(), zone, 'MMM d, h:mm a');
  alertCell.setValue('Alert sent ' + time);
}

function turnOnAlerts() {
  turnOff_();
  ScriptApp.newTrigger('checkEdit').forSpreadsheet(SpreadsheetApp.getActive())
    .onEdit().create();
  SpreadsheetApp.getActive().toast('Alerts on. Edit a number to try it!',
    '⚡ Automations');
}

function turnOffAlerts() {
  const n = turnOff_();
  SpreadsheetApp.getActive().toast(n ? 'Alerts off' : 'Alerts were not on',
    '⚡ Automations');
}

function turnOff_() {
  const mine = ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'checkEdit');
  mine.forEach(t => ScriptApp.deleteTrigger(t));
  return mine.length;
}
