/**
 * Bulk Email Safely: Quota Check, Batches, Send Log (Apps Script Recipes #19)
 * Sends a long list of emails in small batches. It checks your daily Gmail
 * quota first, and when the quota runs out it simply continues tomorrow.
 * Every row gets a status, so nobody gets the same email twice.
 *
 * How to use: ⚡ Automations → "Start sending". The rest runs by itself.
 * Daily limit: about 100 recipients on free Gmail, 1,500 on Workspace.
 *
 * License: MIT. Free to use and modify.
 */

// ================= SETTINGS: change these =================
const SHEET_NAME    = 'Subscribers';                // tab with one email per row
const EMAIL_COLUMN  = 'Email';
const STATUS_COLUMN = 'Status';                     // "Sent" + time goes here
const SUBJECT       = '{{Name}}, here is our November newsletter';
const MESSAGE       = 'Hi {{Name}},\n\nHere is what happened this month...';
const BATCH_SIZE    = 50;                           // emails per batch
const WAIT_MINUTES  = 10;                           // pause between batches
const KEEP_QUOTA    = 5;                            // emails to keep for yourself
// ===========================================================


/** Adds the ⚡ Automations menu when the spreadsheet opens. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('⚡ Automations')
    .addItem('Start sending', 'sendBatch')
    .addItem('Stop sending', 'stopSending')
    .addSeparator()
    .addItem('Check my quota', 'checkQuota')
    .addToUi();
}

/** Sends one batch, then schedules the next one until every row is done. */
function sendBatch() {
  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName(SHEET_NAME);
  const values = sheet.getDataRange().getDisplayValues();
  const headers = values[0].map(h => h.trim());
  const at = name => headers.indexOf(name);
  const todo = [];
  values.forEach((row, i) => {
    if (i > 0 && row[at(EMAIL_COLUMN)] && !row[at(STATUS_COLUMN)]) todo.push(i);
  });

  const quota = MailApp.getRemainingDailyQuota() - KEEP_QUOTA;
  const batch = todo.slice(0, Math.max(0, Math.min(BATCH_SIZE, quota)));
  const zone = ss.getSpreadsheetTimeZone();
  batch.forEach(i => {
    const row = values[i];
    const fill = text => text.replace(/\{\{\s*([^}]+?)\s*\}\}/g,
      (m, name) => at(name) >= 0 ? row[at(name)] : m);
    MailApp.sendEmail(row[at(EMAIL_COLUMN)], fill(SUBJECT), fill(MESSAGE));
    sheet.getRange(i + 1, at(STATUS_COLUMN) + 1)
      .setValue('Sent ✓ ' + Utilities.formatDate(new Date(), zone, 'MMM d, HH:mm'));
    SpreadsheetApp.flush();
  });

  stop_();
  const left = todo.length - batch.length;
  if (!left) return ss.toast('All done! ' + batch.length + ' sent in this batch.',
    '⚡ Automations');
  const outOfQuota = batch.length < Math.min(BATCH_SIZE, todo.length);
  const minutes = outOfQuota ? 24 * 60 : WAIT_MINUTES;   // quota resets after a day
  ScriptApp.newTrigger('sendBatch').timeBased().after(minutes * 60 * 1000).create();
  ss.toast(batch.length + ' sent, ' + left + ' left. Next batch in '
    + (outOfQuota ? '24 hours' : minutes + ' minutes'), '⚡ Automations', 10);
}

function checkQuota() {
  SpreadsheetApp.getActive().toast('You can send ' + MailApp.getRemainingDailyQuota()
    + ' more emails today', '⚡ Automations', 10);
}

function stopSending() {
  const n = stop_();
  SpreadsheetApp.getActive().toast(n ? 'Sending stopped' : 'Nothing was scheduled',
    '⚡ Automations');
}

function stop_() {
  const mine = ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'sendBatch');
  mine.forEach(t => ScriptApp.deleteTrigger(t));
  return mine.length;
}
