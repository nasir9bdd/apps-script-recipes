/**
 * Daily or Weekly Summary Report by Email (Apps Script Recipes #15)
 * Emails you the key numbers from your sheet on a schedule: the total,
 * the number of rows, the average, and a table with a total per group.
 *
 * How to use: ⚡ Automations → "Send report now" to test it, then
 * "Turn on scheduled report".
 *
 * License: MIT. Free to use and modify.
 */

// ================= SETTINGS: change these =================
const SHEET_NAME    = 'Sales';               // tab with your data
const DATE_COLUMN   = 'Date';                // only rows from the last DAYS days
const AMOUNT_COLUMN = 'Amount';              // the number to add up
const GROUP_COLUMN  = 'Product';             // one table row per value here
const DAYS          = 7;                     // 7 = last week, 1 = yesterday
const CURRENCY      = '$';
const SEND_TO       = 'me';                  // 'me' = your own email
const SUBJECT       = 'Weekly sales report';
const SEND_DAY      = 'MONDAY';              // a weekday, or 'EVERY DAY'
const SEND_HOUR     = 8;                     // 0-23, so 8 = 8 AM
// ===========================================================


/** Adds the ⚡ Automations menu when the spreadsheet opens. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('⚡ Automations')
    .addItem('Send report now', 'sendReportNow')
    .addSeparator()
    .addItem('Turn on scheduled report', 'turnOnReport')
    .addItem('Turn off scheduled report', 'turnOffReport')
    .addToUi();
}

function sendReportNow() {
  const to = sendReport();
  SpreadsheetApp.getActive().toast('Report sent to ' + to, '⚡ Automations', 10);
}

/** Adds up the last DAYS days and emails the report. The schedule runs this. */
function sendReport() {
  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('No tab called "' + SHEET_NAME + '". Check SETTINGS.');
  const values = sheet.getDataRange().getValues();
  const headers = values[0].map(h => String(h).trim());
  const col = name => {
    const i = headers.indexOf(name);
    if (i < 0) throw new Error('No column "' + name + '". Check SETTINGS.');
    return i;
  };
  const dateCol = col(DATE_COLUMN), amountCol = col(AMOUNT_COLUMN);
  const groupCol = col(GROUP_COLUMN);

  const zone = ss.getSpreadsheetTimeZone();
  const day = d => Math.floor(Date.parse(            // whole days in the sheet's zone
    Utilities.formatDate(d, zone, 'yyyy-MM-dd') + 'T00:00:00Z') / 86400000);
  const today = day(new Date());
  const groups = {};
  let total = 0, count = 0;
  values.slice(1).forEach(row => {
    const date = row[dateCol], amount = row[amountCol];
    if (!(date instanceof Date) || typeof amount !== 'number') return;
    if (today - day(date) > DAYS) return;            // too old
    const g = String(row[groupCol]) || '(none)';
    groups[g] = groups[g] || { count: 0, total: 0 };
    groups[g].count++;
    groups[g].total += amount;
    total += amount;
    count++;
  });

  const money = n => CURRENCY + n.toLocaleString('en-US',
    { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const since = new Date(Date.now() - DAYS * 86400000);
  const from = Utilities.formatDate(since, zone, 'MMM d');
  const to = SEND_TO === 'me' ? Session.getEffectiveUser().getEmail() : SEND_TO;
  const cell = (text, tag) => '<' + (tag || 'td') + ' style="padding:6px 12px;'
    + 'border:1px solid #dadce0">' + text + '</' + (tag || 'td') + '>';
  const rows = Object.keys(groups).sort((a, b) => groups[b].total - groups[a].total)
    .map(g => '<tr>' + cell(g) + cell(groups[g].count) + cell(money(groups[g].total))
      + '</tr>').join('');
  const box = (label, value) => '<td style="padding:12px 18px;background:#e8f0fe">'
    + '<div style="color:#5f6368">' + label + '</div><div style="font-size:22px;'
    + 'font-weight:bold;color:#1a73e8">' + value + '</div></td>';

  const html = '<div style="font-family:Arial,sans-serif;color:#202124">'
    + '<h2>' + SUBJECT + '</h2><p>Since ' + from + ' (last ' + DAYS + ' days)</p>'
    + '<table cellspacing="8"><tr>' + box('Total', money(total)) + box('Sales', count)
    + box('Average', money(count ? total / count : 0)) + '</tr></table>'
    + '<table style="border-collapse:collapse;margin-top:12px"><tr>'
    + cell(GROUP_COLUMN, 'th') + cell('Sales', 'th') + cell('Total', 'th') + '</tr>'
    + rows + '</table>'
    + '<p><a href="' + ss.getUrl() + '">Open the spreadsheet</a></p></div>';

  MailApp.sendEmail({ to: to, subject: SUBJECT, htmlBody: html });
  return to;
}

function turnOnReport() {
  turnOff_();
  const t = ScriptApp.newTrigger('sendReport').timeBased().atHour(SEND_HOUR);
  if (SEND_DAY === 'EVERY DAY') t.everyDays(1);
  else t.onWeekDay(ScriptApp.WeekDay[SEND_DAY]);
  t.create();
  SpreadsheetApp.getActive().toast('Report on: ' + SEND_DAY.toLowerCase() + ' at '
    + SEND_HOUR + ':00', '⚡ Automations');
}

function turnOffReport() {
  const n = turnOff_();
  SpreadsheetApp.getActive().toast(n ? 'Scheduled report off' : 'It was not on',
    '⚡ Automations');
}

function turnOff_() {
  const mine = ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'sendReport');
  mine.forEach(t => ScriptApp.deleteTrigger(t));
  return mine.length;
}
