/**
 * Website Uptime Monitor with Email Alerts (Apps Script Recipes #48)
 * Put web addresses in column A: the script checks each one, writes Up,
 * Slow or Down with the response time, and emails you when a site goes
 * down and when it's back up. Only on a change, so no flood of emails.
 *
 * How to use: ⚡ Automations → "Check sites now", then turn on checks
 * every 15 minutes.
 *
 * License: MIT. Free to use and modify.
 */

// ================= SETTINGS: change these =================
const SHEET_NAME    = 'Sites';             // column A = web addresses
const LOG_SHEET     = 'Uptime Log';        // '' = don't keep a log
const ALERT_EMAIL   = 'you@example.com';   // who gets the alerts
const SLOW_MS       = 3000;                // slower than this = Slow
const EVERY_MINUTES = 15;                  // 5, 10, 15 or 30
// ===========================================================

const COLORS = { Up: '#d9ead3', Slow: '#fff2cc', Down: '#f4cccc' };

/** Adds the ⚡ Automations menu when the spreadsheet opens. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('⚡ Automations')
    .addItem('Check sites now', 'checkNow')
    .addSeparator()
    .addItem('Turn on checks every ' + EVERY_MINUTES + ' min', 'turnOnChecks')
    .addItem('Turn off checks', 'turnOffChecks')
    .addToUi();
}

function checkNow() {
  const down = checkSites();
  SpreadsheetApp.getActive().toast(down + ' site(s) down', '⚡ Automations', 10);
}

/** Checks every site, fills columns B to E. Returns how many are down. */
function checkSites() {
  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('No tab called "' + SHEET_NAME + '".');
  sheet.getRange(1, 1, 1, 5)
    .setValues([['Website', 'Status', 'Code', 'Time (ms)', 'Checked']])
    .setFontWeight('bold');
  const last = sheet.getLastRow();
  if (last < 2) return 0;
  const rows = sheet.getRange(2, 1, last - 1, 2).getValues();
  const now = new Date();
  const zone = ss.getSpreadsheetTimeZone();
  const when = Utilities.formatDate(now, zone, 'MMM d, h:mm a');
  const news = [], log = [];

  const out = rows.map(([url, before]) => {
    url = String(url).trim();
    if (!url) return ['', '', '', ''];
    const start = Date.now();
    let code = 0;
    try {
      code = UrlFetchApp.fetch(url, { muteHttpExceptions: true }).getResponseCode();
    } catch (e) { }                                   // no answer at all
    const ms = Date.now() - start;
    const up = code >= 200 && code < 400;
    const status = !up ? 'Down' : ms > SLOW_MS ? 'Slow' : 'Up';
    const shown = code || 'No answer';
    const down = status === 'Down', was = before === 'Down';
    if (down && !was) news.push('DOWN: ' + url + ' (' + shown + ')');
    if (!down && was) news.push('BACK UP: ' + url);
    log.push([now, url, status, shown, ms]);
    return [status, shown, ms, when];
  });
  sheet.getRange(2, 2, out.length, 4).setValues(out);
  const colors = out.map(r => [COLORS[r[0]] || null]);
  sheet.getRange(2, 2, out.length).setBackgrounds(colors);

  if (news.length) {                                  // only when something changed
    const subject = news.length === 1 ? news[0] : news.length + ' website changes';
    MailApp.sendEmail(ALERT_EMAIL, subject, news.join('\n') + '\n\n' + ss.getUrl());
  }
  if (LOG_SHEET) {
    let tab = ss.getSheetByName(LOG_SHEET);
    if (!tab) {
      tab = ss.insertSheet(LOG_SHEET, ss.getNumSheets());
      tab.appendRow(['Time', 'Website', 'Status', 'Code', 'Time (ms)']);
      tab.getRange(1, 1, 1, 5).setFontWeight('bold');
      tab.setColumnWidths(1, 5, 110).setColumnWidth(2, 260);
      sheet.activate();                               // stay on the sites tab
    }
    const at = tab.getLastRow() + 1;
    tab.getRange(at, 1, log.length, 5).setValues(log);
    tab.getRange(at, 1, log.length).setNumberFormat('mmm d, h:mm am/pm');
  }
  return out.filter(r => r[0] === 'Down').length;
}

function turnOnChecks() {
  turnOff_();
  ScriptApp.newTrigger('checkSites').timeBased()
    .everyMinutes(EVERY_MINUTES).create();
  SpreadsheetApp.getActive().toast('Checks on: every ' + EVERY_MINUTES + ' minutes',
    '⚡ Automations', 10);
}

function turnOffChecks() {
  const n = turnOff_();
  SpreadsheetApp.getActive().toast(n ? 'Checks off' : 'They were not on',
    '⚡ Automations');
}

function turnOff_() {
  const mine = ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'checkSites');
  mine.forEach(t => ScriptApp.deleteTrigger(t));
  return mine.length;
}
