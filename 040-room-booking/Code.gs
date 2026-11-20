/**
 * Room and Slot Booking with a Conflict Check (Apps Script Recipes #40)
 * People book a room (or a time slot) with your Google Form. If the slot
 * is free, the booking goes on the room's calendar and they get a
 * confirmation. If it's taken, they get an email asking for another time.
 *
 * How to use: make a calendar for the room, link your form to this sheet,
 * then ⚡ Automations → "Turn on automatic booking".
 *
 * License: MIT. Free to use and modify.
 */

// ================= SETTINGS: change these =================
const CALENDAR     = 'Meeting Room';    // the room's calendar
const SHEET_NAME   = 'Room Bookings';   // tab where the form saves answers
const NAME_COLUMN  = 'Name';            // header of the name column
const EMAIL_COLUMN = 'Email';           // header of the email column
const DATE_COLUMN  = 'Date';            // header of the date question
const TIME_COLUMN  = 'Time';            // header of the start time question
const MINUTES      = 60;                // length of a booking
const BOOKED = ['Booked: {{Date}} at {{Time}}',
  'Hi {{Name}},\n\nThe meeting room is yours on {{Date}} at {{Time}}.\n\nSee you!'];
const TAKEN  = ['Sorry, {{Date}} at {{Time}} is taken',
  'Hi {{Name}},\n\nThe room is already booked at that time.\n' +
  'Please send the form again with another time.'];
// ===========================================================


/** Adds the ⚡ Automations menu when the spreadsheet opens. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('⚡ Automations')
    .addItem('Check new bookings now', 'checkNow')
    .addSeparator()
    .addItem('Turn on automatic booking', 'turnOnAuto')
    .addItem('Turn off automatic booking', 'turnOffAuto')
    .addToUi();
}

function checkNow() {
  const n = processBookings();
  SpreadsheetApp.getActive().toast(n + ' booking(s) checked', '⚡ Automations', 10);
}

/** Books (or turns down) every row without a status. Returns the count. */
function processBookings() {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);                     // two bookings at once can't both win
  try {
    const ss = SpreadsheetApp.getActive();
    const zone = ss.getSpreadsheetTimeZone();
    const cal = CalendarApp.getCalendarsByName(CALENDAR)[0];
    if (!cal) throw new Error('No calendar called "' + CALENDAR + '".');
    const calZone = cal.getTimeZone();              // times are the room's local time
    const sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) throw new Error('No tab called "' + SHEET_NAME + '".');
    const head = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0]
      .map(h => h.trim());
    if (!head.includes('Status')) {
      head.push('Status');
      sheet.getRange(1, head.length).setValue('Status').setFontWeight('bold');
    }
    const col = h => head.indexOf(h);
    const last = sheet.getLastRow();
    if (last < 2) return 0;
    const rows = sheet.getRange(2, 1, last - 1, head.length).getValues();
    const shown = sheet.getRange(2, 1, last - 1, head.length).getDisplayValues();

    let count = 0;
    rows.forEach((row, i) => {
      if (row[col('Status')] || !(row[col(DATE_COLUMN)] instanceof Date)) return;
      const day = Utilities.formatDate(row[col(DATE_COLUMN)], zone, 'yyyy-MM-dd');
      const time = shown[i][col(TIME_COLUMN)].trim().toUpperCase();
      const start = Utilities.parseDate(day + ' ' + time, calZone,
        'yyyy-MM-dd h:mm a');
      const end = new Date(start.getTime() + MINUTES * 60000);
      const free = cal.getEvents(start, end).length === 0;
      const name = shown[i][col(NAME_COLUMN)];
      if (free) cal.createEvent(name + ' (booked by form)', start, end);

      const fill = s => s.replace(/{{Name}}/g, name).replace(/{{Time}}/g, time)
        .replace(/{{Date}}/g, Utilities.formatDate(start, calZone, 'EEE, MMM d'));
      const [subject, message] = free ? BOOKED : TAKEN;
      MailApp.sendEmail(shown[i][col(EMAIL_COLUMN)], fill(subject), fill(message));
      sheet.getRange(i + 2, col('Status') + 1)
        .setValue(free ? 'Booked ✓' : 'Taken ✗ (emailed)');
      count++;
    });
    return count;
  } finally {
    lock.releaseLock();
  }
}

function turnOnAuto() {
  turnOff_();
  ScriptApp.newTrigger('processBookings').forSpreadsheet(SpreadsheetApp.getActive())
    .onFormSubmit().create();
  SpreadsheetApp.getActive().toast('Automatic booking on', '⚡ Automations', 10);
}

function turnOffAuto() {
  const n = turnOff_();
  SpreadsheetApp.getActive().toast(n ? 'Automatic booking off' : 'It was not on',
    '⚡ Automations');
}

function turnOff_() {
  const mine = ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'processBookings');
  mine.forEach(t => ScriptApp.deleteTrigger(t));
  return mine.length;
}
