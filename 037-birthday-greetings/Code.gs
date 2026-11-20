/**
 * Birthday and Anniversary Emails on Autopilot (Apps Script Recipes #37)
 * Every morning, the script checks your list. When it's someone's birthday
 * or anniversary, they get a personal email. Each greeting is sent only once
 * a year, and the sheet shows what was sent and when.
 *
 * How to use: ⚡ Automations → "Send today's greetings" to test it, then
 * "Turn on daily greetings".
 *
 * License: MIT. Free to use and modify.
 */

// ================= SETTINGS: change these =================
const SHEET_NAME   = 'Birthdays';     // tab with your people
const NAME_COLUMN  = 'Name';          // header of the name column
const EMAIL_COLUMN = 'Email';         // header of the email column
const SEND_HOUR    = 8;               // send around 8 AM
const GREETINGS = {                   // date column: [subject, message]
  'Birthday':    ['Happy birthday, {{Name}}! 🎂',
                  'Hi {{Name}},\n\nHappy birthday! Have a wonderful day.\n\nMaya'],
  'Anniversary': ['Happy {{Years}}-year anniversary, {{Name}}! 🎉',
                  'Hi {{Name}},\n\nThank you for {{Years}} great years!\n\nMaya'],
};
// ===========================================================


/** Adds the ⚡ Automations menu when the spreadsheet opens. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('⚡ Automations')
    .addItem("Send today's greetings", 'sendNow')
    .addSeparator()
    .addItem('Turn on daily greetings', 'turnOnDaily')
    .addItem('Turn off daily greetings', 'turnOffDaily')
    .addToUi();
}

function sendNow() {
  const n = sendGreetings();
  SpreadsheetApp.getActive().toast(n + ' greeting(s) sent', '⚡ Automations', 10);
}

/** Emails everyone whose birthday or anniversary is today. Returns the count. */
function sendGreetings() {
  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('No tab called "' + SHEET_NAME + '". Check SETTINGS.');
  const zone = ss.getSpreadsheetTimeZone();
  const day = d => Utilities.formatDate(d, zone, 'MM-dd');
  const now = new Date();
  const today = day(now), year = Number(Utilities.formatDate(now, zone, 'yyyy'));
  const stamp = Utilities.formatDate(now, zone, 'MMM d, yyyy');

  const values = sheet.getDataRange().getValues();
  const head = values[0].map(h => String(h).trim());
  let status = head.indexOf('Last Greeting');
  if (status < 0) {                                  // add the column once
    status = head.length;
    sheet.getRange(1, status + 1).setValue('Last Greeting').setFontWeight('bold');
  }

  let count = 0;
  values.slice(1).forEach((row, i) => {
    const email = String(row[head.indexOf(EMAIL_COLUMN)] || '').trim();
    const done = [];
    Object.keys(GREETINGS).forEach(column => {
      const date = row[head.indexOf(column)];
      if (!email || !(date instanceof Date)) return;
      let when = day(date);
      if (when === '02-29' && today === '02-28' && year % 4) when = '02-28';
      const note = column + ' ✓ ' + stamp;
      if (when !== today || String(row[status] || '').includes(note)) return;
      const fill = s => s.replace(/{{Name}}/g, row[head.indexOf(NAME_COLUMN)])
        .replace(/{{Years}}/g, year - Utilities.formatDate(date, zone, 'yyyy'));
      const [subject, message] = GREETINGS[column];
      MailApp.sendEmail(email, fill(subject), fill(message));
      done.push(note);
      count++;
    });
    if (done.length) sheet.getRange(i + 2, status + 1).setValue(done.join(', '));
  });
  return count;
}

function turnOnDaily() {
  turnOff_();
  ScriptApp.newTrigger('sendGreetings').timeBased().everyDays(1).atHour(SEND_HOUR)
    .create();
  SpreadsheetApp.getActive().toast('Daily greetings on, around ' + SEND_HOUR + ':00',
    '⚡ Automations', 10);
}

function turnOffDaily() {
  const n = turnOff_();
  SpreadsheetApp.getActive().toast(n ? 'Daily greetings off' : 'They were not on',
    '⚡ Automations');
}

function turnOff_() {
  const mine = ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'sendGreetings');
  mine.forEach(t => ScriptApp.deleteTrigger(t));
  return mine.length;
}
