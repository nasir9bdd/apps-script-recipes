/**
 * Google Calendar Events from a Sheet (Apps Script Recipes #31)
 * Adds every row as an event in Google Calendar. Change a row and sync
 * again: the same event is updated, never duplicated.
 *
 * How to use: ⚡ Automations → "Sync events to Calendar".
 * Columns: Title, Date, Start, End, Location, Description, Event ID.
 * Leave Start empty for an all-day event.
 *
 * License: MIT. Free to use and modify.
 */

// ================= SETTINGS: change these =================
const SHEET_NAME     = 'Events';      // tab with one event per row
const CALENDAR_NAME  = '';            // '' = your main calendar, or a calendar's name
const ID_COLUMN      = 'Event ID';    // the script keeps track of events here
const DEFAULT_LENGTH = 60;            // minutes, used when End is empty
// ===========================================================


/** Adds the ⚡ Automations menu when the spreadsheet opens. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('⚡ Automations')
    .addItem('Sync events to Calendar', 'syncEvents')
    .addSeparator()
    .addItem('Delete synced events', 'deleteEvents')
    .addToUi();
}

/** Creates new events and updates the ones that already have an Event ID. */
function syncEvents() {
  const { sheet, rows, shown, col } = read_();
  const calendar = calendar_();
  let created = 0, updated = 0;

  rows.forEach((row, i) => {
    const title = row[col('Title')], date = row[col('Date')];
    if (!title || !(date instanceof Date)) return;
    const times = times_(date, shown[i][col('Start')], shown[i][col('End')]);
    const [start, end, allDay] = times;
    const extra = { location: row[col('Location')] || '',
                    description: row[col('Description')] || '' };

    let event = row[col(ID_COLUMN)] ? find_(calendar, row[col(ID_COLUMN)]) : null;
    if (event) {                                   // already synced: update it
      event.setTitle(title).setLocation(extra.location)
        .setDescription(extra.description);
      if (allDay) event.setAllDayDate(start); else event.setTime(start, end);
      updated++;
    } else {                                       // new row: create the event
      event = allDay ? calendar.createAllDayEvent(title, start, extra)
                     : calendar.createEvent(title, start, end, extra);
      sheet.getRange(i + 2, col(ID_COLUMN) + 1).setValue(event.getId());
      created++;
    }
  });
  SpreadsheetApp.getActive().toast(created + ' created, ' + updated + ' updated',
    '⚡ Automations');
}

/** Removes every event this sheet created and clears the Event ID column. */
function deleteEvents() {
  const { sheet, rows, col } = read_();
  const calendar = calendar_();
  let deleted = 0;
  rows.forEach((row, i) => {
    const id = row[col(ID_COLUMN)];
    if (!id) return;
    const event = find_(calendar, id);
    if (event) { event.deleteEvent(); deleted++; }
    sheet.getRange(i + 2, col(ID_COLUMN) + 1).clearContent();
  });
  SpreadsheetApp.getActive().toast(deleted + ' event(s) deleted', '⚡ Automations');
}

function read_() {
  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('No tab called "' + SHEET_NAME + '". Check SETTINGS.');
  const [headers, ...rows] = sheet.getDataRange().getValues();
  const shown = sheet.getDataRange().getDisplayValues().slice(1);  // times as shown
  const names = headers.map(h => String(h).trim());
  const col = name => {
    const i = names.indexOf(name);
    if (i < 0) throw new Error('No column "' + name + '" in ' + SHEET_NAME + '.');
    return i;
  };
  return { sheet, rows, shown, col };
}

function calendar_() {
  if (!CALENDAR_NAME) return CalendarApp.getDefaultCalendar();
  const found = CalendarApp.getCalendarsByName(CALENDAR_NAME)[0];
  if (!found) throw new Error('No calendar called "' + CALENDAR_NAME + '".');
  return found;
}

function find_(calendar, id) {
  try { return calendar.getEventById(id); } catch (e) { return null; }
}

/** Date + Start/End text ("9:00 AM", "14:30") -> [start, end, allDay]. */
function times_(date, startText, endText) {
  const zone = SpreadsheetApp.getActive().getSpreadsheetTimeZone();
  const day = Utilities.formatDate(date, zone, 'yyyy-MM-dd');
  const at = text => {
    const m = /(\d{1,2}):(\d{2})\s*([AP]M)?/i.exec(text || '');
    if (!m) return null;
    let h = Number(m[1]) % (m[3] ? 12 : 24);
    if (m[3] && m[3].toUpperCase() === 'PM') h += 12;
    return Utilities.parseDate(day + ' ' + h + ':' + m[2], zone, 'yyyy-MM-dd H:mm');
  };
  const start = at(startText);
  if (!start) return [date, null, true];
  const end = at(endText) || new Date(start.getTime() + DEFAULT_LENGTH * 60000);
  return [start, end, false];
}
