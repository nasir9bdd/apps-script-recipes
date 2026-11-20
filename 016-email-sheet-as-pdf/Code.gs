/**
 * Email a Sheet as a PDF on a Schedule (Apps Script Recipes #16)
 * Turns one tab into a PDF and emails it, right now or automatically
 * every day or every week. For example, a report every Monday at 9.
 *
 * How to use: ⚡ Automations → "Send PDF now" to test it, then
 * "Turn on schedule". "Turn off schedule" stops it again.
 *
 * License: MIT. Free to use and modify.
 */

// ================= SETTINGS: change these =================
const SHEET_NAME = 'Report';                     // tab to turn into a PDF
const SEND_TO    = 'boss@example.com';           // emails, separated by commas
const SUBJECT    = 'Weekly report - {{date}}';   // {{date}} = today's date
const MESSAGE    = 'Hi,\n\nThe latest report is attached.\n\nHave a great week!';
const REPEAT     = 'weekly';                     // 'daily' or 'weekly'
const DAY        = 'MONDAY';                     // for weekly: MONDAY to SUNDAY
const HOUR       = 9;                            // hour of the day, 0 to 23
const LANDSCAPE  = true;                         // false = portrait pages
// ===========================================================


/** Adds the ⚡ Automations menu when the spreadsheet opens. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('⚡ Automations')
    .addItem('Send PDF now', 'sendPdfNow')
    .addSeparator()
    .addItem('Turn on schedule', 'turnOnSchedule')
    .addItem('Turn off schedule', 'turnOffSchedule')
    .addToUi();
}

/** Menu: send the PDF right away. */
function sendPdfNow() {
  try {
    sendReport();
    SpreadsheetApp.getActive().toast('PDF sent to ' + SEND_TO, '⚡ Automations');
  } catch (err) {
    SpreadsheetApp.getUi().alert(err.message);
  }
}

/** Makes the PDF and emails it. The schedule runs this function. */
function sendReport() {
  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('No tab called "' + SHEET_NAME + '". Check SETTINGS.');

  const zone = ss.getSpreadsheetTimeZone();
  const date = Utilities.formatDate(new Date(), zone, 'MMM d, yyyy');
  const pdf = pdf_(ss, sheet).setName(SHEET_NAME + ' ' + date + '.pdf');
  MailApp.sendEmail(SEND_TO, SUBJECT.replace('{{date}}', date),
    MESSAGE.replace('{{date}}', date), { attachments: [pdf] });
}

/** Menu: run sendReport every day or week, at HOUR. */
function turnOnSchedule() {
  const ui = SpreadsheetApp.getUi();
  if (REPEAT === 'weekly' && !ScriptApp.WeekDay[DAY]) {
    return ui.alert('DAY must be MONDAY, TUESDAY, ... or SUNDAY. Check SETTINGS.');
  }
  removeSchedule_();                               // never schedule twice
  const trigger = ScriptApp.newTrigger('sendReport').timeBased();
  if (REPEAT === 'daily') trigger.everyDays(1);
  else trigger.onWeekDay(ScriptApp.WeekDay[DAY]);
  trigger.atHour(HOUR).create();

  const day = DAY[0] + DAY.slice(1).toLowerCase();             // MONDAY → Monday
  const when = REPEAT === 'daily' ? 'every day' : 'every ' + day;
  SpreadsheetApp.getActive().toast('Scheduled: ' + when + ' at ' + HOUR + ':00',
    '⚡ Automations');
}

/** Menu: stop the schedule. */
function turnOffSchedule() {
  const removed = removeSchedule_();
  const msg = removed ? 'Schedule turned off' : 'No schedule was on';
  SpreadsheetApp.getActive().toast(msg, '⚡ Automations');
}

function removeSchedule_() {
  const mine = ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'sendReport');
  mine.forEach(t => ScriptApp.deleteTrigger(t));
  return mine.length;
}

/** Exports one tab as a PDF, using the same options as File → Download. */
function pdf_(ss, sheet) {
  SpreadsheetApp.flush();                          // include the latest edits
  DriveApp.getFileById(ss.getId());                // asks for the Drive permission
  const options = {
    format: 'pdf', gid: sheet.getSheetId(), portrait: !LANDSCAPE, fitw: true,
    gridlines: false, sheetnames: false, printtitle: false, pagenum: 'UNDEFINED',
    top_margin: 0.6, bottom_margin: 0.6, left_margin: 0.6, right_margin: 0.6,
  };
  const query = Object.keys(options).map(k => k + '=' + options[k]).join('&');
  const url = 'https://docs.google.com/spreadsheets/d/' + ss.getId()
    + '/export?' + query;
  const res = UrlFetchApp.fetch(url, {
    headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() },
    muteHttpExceptions: true,
  });
  if (res.getResponseCode() !== 200) {
    throw new Error('Could not make the PDF (error ' + res.getResponseCode() + ').');
  }
  return res.getBlob();
}
