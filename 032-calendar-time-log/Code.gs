/**
 * Calendar Events to a Sheet for Time Tracking (Apps Script Recipes #32)
 * Lists the events of a calendar in your sheet, with the hours of each
 * one, and adds up the hours per client. Name events "Client: task",
 * for example "Bright Co: design review".
 *
 * How to use: ⚡ Automations → "Export events". Turn on the daily export
 * to keep the sheet up to date. The tab is rebuilt each time.
 *
 * License: MIT. Free to use and modify.
 */

// ================= SETTINGS: change these =================
const CALENDAR   = 'Client Work';   // calendar name, or '' for your main calendar
const DAYS_BACK  = 7;               // events from the last 7 days
const SHEET_NAME = 'Time Log';      // tab for the events (replaced each time)
const SEPARATOR  = ':';             // text before this is the client
const ALL_DAY    = false;           // true = also list all-day events
// ===========================================================


/** Adds the ⚡ Automations menu when the spreadsheet opens. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('⚡ Automations')
    .addItem('Export events', 'exportNow')
    .addSeparator()
    .addItem('Turn on daily export', 'turnOnDaily')
    .addItem('Turn off daily export', 'turnOffDaily')
    .addToUi();
}

function exportNow() {
  const [events, hours] = exportEvents();
  SpreadsheetApp.getActive().toast(events + ' events, ' + hours + ' hours in total',
    '⚡ Automations', 10);
}

/** Rebuilds the time log. Returns [events, total hours]. */
function exportEvents() {
  const ss = SpreadsheetApp.getActive();
  const cal = CALENDAR ? CalendarApp.getCalendarsByName(CALENDAR)[0]
                       : CalendarApp.getDefaultCalendar();
  if (!cal) throw new Error('No calendar called "' + CALENDAR + '".');
  const zone = ss.getSpreadsheetTimeZone();
  const end = new Date();
  const start = new Date(end.getTime() - DAYS_BACK * 24 * 3600 * 1000);
  const fmt = (d, f) => Utilities.formatDate(d, zone, f);

  const totals = {};                                 // client -> hours
  const rows = cal.getEvents(start, end)
    .filter(ev => ALL_DAY || !ev.isAllDayEvent())
    .map(ev => {
      const title = ev.getTitle();
      const cut = title.indexOf(SEPARATOR);
      const client = cut > 0 ? title.slice(0, cut).trim() : '(no client)';
      const task = cut > 0 ? title.slice(cut + 1).trim() : title;
      const hours = (ev.getEndTime() - ev.getStartTime()) / 3600000;
      totals[client] = (totals[client] || 0) + hours;
      return [fmt(ev.getStartTime(), 'EEE, MMM d'), fmt(ev.getStartTime(), 'h:mm a'),
        fmt(ev.getEndTime(), 'h:mm a'), client, task, hours];
    });

  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  sheet.clear();
  const table = [['Date', 'Start', 'End', 'Client', 'Task', 'Hours']].concat(rows);
  sheet.getRange(1, 1, table.length, 3).setNumberFormat('@');   // keep dates as text
  sheet.getRange(1, 1, table.length, 6).setValues(table);

  const summary = [['Client', 'Total Hours']].concat(Object.keys(totals).sort()
    .map(c => [c, totals[c]]));
  sheet.getRange(1, 8, summary.length, 2).setValues(summary);
  sheet.getRange(2, 6, Math.max(rows.length, 1)).setNumberFormat('0.0#');
  sheet.getRange(2, 9, summary.length).setNumberFormat('0.0#');
  sheet.getRangeList(['A1:F1', 'H1:I1']).setFontWeight('bold');
  sheet.activate();
  const total = Object.values(totals).reduce((a, b) => a + b, 0);
  return [rows.length, Math.round(total * 10) / 10];
}

function turnOnDaily() {
  turnOff_();
  ScriptApp.newTrigger('exportEvents').timeBased().everyDays(1).atHour(6).create();
  SpreadsheetApp.getActive().toast('Daily export on: every morning',
    '⚡ Automations');
}

function turnOffDaily() {
  const n = turnOff_();
  SpreadsheetApp.getActive().toast(n ? 'Daily export off' : 'It was not on',
    '⚡ Automations');
}

function turnOff_() {
  const mine = ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'exportEvents');
  mine.forEach(t => ScriptApp.deleteTrigger(t));
  return mine.length;
}
