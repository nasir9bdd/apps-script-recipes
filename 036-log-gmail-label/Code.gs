/**
 * Log Emails from a Gmail Label into Google Sheets (Apps Script Recipes #36)
 * Adds one row per email with a Gmail label: date, sender, subject, the
 * first words of the message and a link back to it. Emails that are
 * already in the sheet are skipped, so you can run it again any time.
 *
 * How to use: ⚡ Automations → "Log emails now", or turn on the hourly log.
 *
 * License: MIT. Free to use and modify.
 */

// ================= SETTINGS: change these =================
const LABEL       = 'Clients';      // the Gmail label to log
const SHEET_NAME  = 'Email Log';    // tab for the emails (created if missing)
const MAX_THREADS = 100;            // newest conversations checked each time
const SNIPPET     = 80;             // characters of the message to keep
// ===========================================================


const GMAIL = 'https://mail.google.com/mail/u/0/#all/';

/** Adds the ⚡ Automations menu when the spreadsheet opens. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('⚡ Automations')
    .addItem('Log emails now', 'logNow')
    .addSeparator()
    .addItem('Turn on hourly log', 'turnOnHourly')
    .addItem('Turn off hourly log', 'turnOffHourly')
    .addToUi();
}

function logNow() {
  const n = logEmails();
  SpreadsheetApp.getActive().toast(n + ' new email(s) logged', '⚡ Automations', 10);
}

/** Appends every labeled email that isn't in the sheet yet. Returns the count. */
function logEmails() {
  const ss = SpreadsheetApp.getActive();
  const label = GmailApp.getUserLabelByName(LABEL);
  if (!label) throw new Error('No Gmail label called "' + LABEL + '".');
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  sheet.getRange(1, 1, 1, 6).setValues([['Date', 'From', 'Subject', 'Message', 'Link',
    'ID']]).setFontWeight('bold');
  sheet.hideColumns(6);                              // IDs, used to skip repeats
  const last = sheet.getLastRow();
  const ids = last > 1 ? sheet.getRange(2, 6, last - 1).getValues().flat() : [];
  const seen = new Set(ids);

  const rows = [];
  label.getThreads(0, MAX_THREADS).forEach(thread => {
    thread.getMessages().forEach(m => {
      if (seen.has(m.getId())) return;
      const text = m.getPlainBody().replace(/\s+/g, ' ').trim();
      rows.push([m.getDate(), m.getFrom(), m.getSubject(),
        text.length > SNIPPET ? text.slice(0, SNIPPET) + '...' : text,
        '=HYPERLINK("' + GMAIL + m.getId() + '", "Open")',
        m.getId()]);
    });
  });
  rows.sort((a, b) => a[0] - b[0]);                  // oldest first
  if (rows.length) {
    const range = sheet.getRange(last + 1, 1, rows.length, 6);
    range.setValues(rows);
    range.offset(0, 0, rows.length, 1).setNumberFormat('mmm d, h:mm am/pm');
  }
  sheet.activate();
  return rows.length;
}

function turnOnHourly() {
  turnOff_();
  ScriptApp.newTrigger('logEmails').timeBased().everyHours(1).create();
  SpreadsheetApp.getActive().toast('Hourly log on', '⚡ Automations');
}

function turnOffHourly() {
  const n = turnOff_();
  SpreadsheetApp.getActive().toast(n ? 'Hourly log off' : 'It was not on',
    '⚡ Automations');
}

function turnOff_() {
  const mine = ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'logEmails');
  mine.forEach(t => ScriptApp.deleteTrigger(t));
  return mine.length;
}
