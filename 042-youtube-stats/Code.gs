/**
 * Track YouTube Channel Stats in Google Sheets (Apps Script Recipes #42)
 * Put YouTube channels in column A (their @handle or channel ID): the
 * script fills in the name, subscribers, total views and number of videos.
 * Every update is also saved in a history tab, so you can watch them grow.
 *
 * Needs the YouTube service: in the editor, click + next to Services,
 * pick "YouTube Data API v3" and click Add.
 *
 * How to use: ⚡ Automations → "Update stats now", or turn on daily updates.
 *
 * License: MIT. Free to use and modify.
 */

// ================= SETTINGS: change these =================
const SHEET_NAME    = 'Channels';        // column A = @handle or channel ID
const HISTORY_SHEET = 'Stats History';   // '' = don't keep a history
const UPDATE_HOUR   = 7;                 // daily update around this hour
// ===========================================================


/** Adds the ⚡ Automations menu when the spreadsheet opens. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('⚡ Automations')
    .addItem('Update stats now', 'updateNow')
    .addSeparator()
    .addItem('Turn on daily updates', 'turnOnDaily')
    .addItem('Turn off daily updates', 'turnOffDaily')
    .addToUi();
}

function updateNow() {
  const n = updateStats();
  SpreadsheetApp.getActive().toast(n + ' channel(s) updated', '⚡ Automations', 10);
}

/** Looks up every channel and fills columns B to F. Returns the count. */
function updateStats() {
  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('No tab called "' + SHEET_NAME + '".');
  sheet.getRange(1, 1, 1, 6)
    .setValues([['Channel', 'Name', 'Subscribers', 'Views', 'Videos', 'Updated']])
    .setFontWeight('bold');
  const last = sheet.getLastRow();
  if (last < 2) return 0;
  const ids = sheet.getRange(2, 1, last - 1, 1).getValues()
    .map(r => String(r[0]).trim());
  const zone = ss.getSpreadsheetTimeZone();
  const now = Utilities.formatDate(new Date(), zone, 'MMM d, h:mm a');

  const out = ids.map(id => {
    if (!id) return ['', '', '', '', ''];
    const ask = id.startsWith('@') ? { forHandle: id } : { id: id };
    const ch = (YouTube.Channels.list('snippet,statistics', ask).items || [])[0];
    if (!ch) return ['Not found', '', '', '', now];
    const s = ch.statistics;
    return [ch.snippet.title, Number(s.subscriberCount), Number(s.viewCount),
      Number(s.videoCount), now];
  });
  sheet.getRange(2, 2, out.length, 5).setValues(out);
  sheet.getRange(2, 3, out.length, 3).setNumberFormat('#,##0');

  if (HISTORY_SHEET) {                     // one row per update: subscribers
    let hist = ss.getSheetByName(HISTORY_SHEET);
    if (!hist) {
      hist = ss.insertSheet(HISTORY_SHEET, ss.getNumSheets());
      hist.appendRow(['Date'].concat(ids));
      hist.getRange(1, 1, 1, ids.length + 1).setFontWeight('bold');
      hist.setColumnWidth(1, 140);
      hist.setColumnWidths(2, ids.length, 150);
      sheet.activate();                              // stay on the channels tab
    }
    hist.appendRow([new Date()].concat(out.map(r => r[1])));
    const row = hist.getLastRow();
    hist.getRange(row, 1).setNumberFormat('mmm d, h:mm am/pm');
    hist.getRange(row, 2, 1, out.length).setNumberFormat('#,##0');
  }
  return out.filter(r => typeof r[1] === 'number').length;
}

function turnOnDaily() {
  turnOff_();
  ScriptApp.newTrigger('updateStats').timeBased()
    .everyDays(1).atHour(UPDATE_HOUR).create();
  SpreadsheetApp.getActive().toast('Daily updates on, around ' + UPDATE_HOUR + ':00',
    '⚡ Automations', 10);
}

function turnOffDaily() {
  const n = turnOff_();
  SpreadsheetApp.getActive().toast(n ? 'Daily updates off' : 'They were not on',
    '⚡ Automations');
}

function turnOff_() {
  const mine = ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'updateStats');
  mine.forEach(t => ScriptApp.deleteTrigger(t));
  return mine.length;
}
