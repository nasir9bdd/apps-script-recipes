/**
 * Automatic Due-Date Reminder Emails (Apps Script Recipes #13)
 * Emails each person a reminder a few days before their task is due,
 * and again if it becomes overdue. Runs every morning by itself.
 *
 * How to use: ⚡ Automations → "Send reminders now" to test it, then
 * "Turn on daily reminders". Rows marked Done are skipped.
 *
 * License: MIT. Free to use and modify.
 */

// ================= SETTINGS: change these =================
const SHEET_NAME      = 'Tasks';           // tab with your tasks
const DUE_COLUMN      = 'Due Date';        // header of the due date column
const EMAIL_COLUMN    = 'Email';           // header with the person's email
const STATUS_COLUMN   = 'Status';          // rows with DONE_VALUE are skipped
const DONE_VALUE      = 'Done';
const REMINDER_COLUMN = 'Reminder';        // the script writes what it sent here
const DAYS_BEFORE     = 2;                 // remind this many days before
const SEND_HOUR       = 8;                 // daily check at this hour, 0 to 23
const SUBJECT = 'Reminder: "{{Task}}" {{due}}';  // {{due}} = "is due tomorrow"...
const MESSAGE = 'Hi {{Owner}},\n\nJust a reminder: "{{Task}}" {{due}} ({{Due Date}}).'
              + '\n\nThanks!';
// ===========================================================


/** Adds the ⚡ Automations menu when the spreadsheet opens. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('⚡ Automations')
    .addItem('Send reminders now', 'sendRemindersNow')
    .addSeparator()
    .addItem('Turn on daily reminders', 'turnOnDaily')
    .addItem('Turn off daily reminders', 'turnOffDaily')
    .addToUi();
}

function sendRemindersNow() {
  const sent = sendReminders();
  SpreadsheetApp.getActive().toast(sent + ' reminder(s) sent', '⚡ Automations');
}

/** Checks every row and emails reminders. The daily schedule runs this. */
function sendReminders() {
  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('No tab called "' + SHEET_NAME + '". Check SETTINGS.');
  const zone = ss.getSpreadsheetTimeZone();
  const values = sheet.getDataRange().getValues();
  const shown = sheet.getDataRange().getDisplayValues();
  const headers = shown[0].map(h => h.trim());
  const col = name => {
    const i = headers.indexOf(name);
    if (i < 0) throw new Error('No column "' + name + '". Check SETTINGS.');
    return i;
  };
  const dueCol = col(DUE_COLUMN), emailCol = col(EMAIL_COLUMN);
  const statusCol = col(STATUS_COLUMN), reminderCol = col(REMINDER_COLUMN);
  const today = dayNumber_(new Date(), zone);
  let sent = 0;

  for (let r = 1; r < values.length; r++) {
    const date = values[r][dueCol], to = values[r][emailCol];
    if (!(date instanceof Date) || !to || shown[r][statusCol] === DONE_VALUE) continue;
    const daysLeft = dayNumber_(date, zone) - today;
    const already = String(values[r][reminderCol]);

    let due;
    if (daysLeft < 0 && !already.startsWith('Overdue')) due = 'is overdue';
    else if (daysLeft >= 0 && daysLeft <= DAYS_BEFORE && !already) {
      due = daysLeft === 0 ? 'is due today' : daysLeft === 1 ? 'is due tomorrow'
          : 'is due in ' + daysLeft + ' days';
    }
    if (!due) continue;

    const value = name => name === 'due' ? due
      : headers.includes(name) ? shown[r][headers.indexOf(name)] : '{{' + name + '}}';
    const fill = text => text.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (m, n) => value(n));
    MailApp.sendEmail(to, fill(SUBJECT), fill(MESSAGE));
    const stamp = Utilities.formatDate(new Date(), zone, 'MMM d');
    sheet.getRange(r + 1, reminderCol + 1)
      .setValue((due === 'is overdue' ? 'Overdue sent ' : 'Sent ') + stamp);
    sent++;
  }
  return sent;
}

function turnOnDaily() {
  turnOffDaily_();
  ScriptApp.newTrigger('sendReminders').timeBased().everyDays(1).atHour(SEND_HOUR)
    .create();
  SpreadsheetApp.getActive().toast('Daily reminders on, every day at ' + SEND_HOUR
    + ':00', '⚡ Automations');
}

function turnOffDaily() {
  const n = turnOffDaily_();
  SpreadsheetApp.getActive().toast(n ? 'Daily reminders off' : 'They were not on',
    '⚡ Automations');
}

function turnOffDaily_() {
  const mine = ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'sendReminders');
  mine.forEach(t => ScriptApp.deleteTrigger(t));
  return mine.length;
}

/** Whole days since 1970 in the sheet's time zone (ignores the time of day). */
function dayNumber_(date, zone) {
  const parts = Utilities.formatDate(date, zone, 'yyyy-M-d').split('-').map(Number);
  const [y, m, d] = parts;
  return Date.UTC(y, m - 1, d) / 86400000;
}
