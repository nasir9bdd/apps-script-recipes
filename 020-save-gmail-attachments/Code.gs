/**
 * Save Gmail Attachments to Drive and Log Them (Apps Script Recipes #20)
 * Finds emails with attachments (any Gmail search), saves the files in a
 * Drive folder with one subfolder per month, and lists them in your sheet.
 * Saved emails get a label, so each file is saved only once.
 *
 * How to use: ⚡ Automations → "Save attachments now" to test it, then
 * "Turn on hourly check".
 *
 * License: MIT. Free to use and modify.
 */

// ================= SETTINGS: change these =================
const SEARCH      = 'has:attachment subject:receipt';   // any Gmail search
const FOLDER_NAME = 'Gmail Attachments';                // Drive folder for the files
const BY_MONTH    = true;                               // subfolders like 2026-11
const SHEET_NAME  = 'Attachments';                      // tab for the list
const DONE_LABEL  = 'Saved to Drive';                   // label for saved emails
// ===========================================================


/** Adds the ⚡ Automations menu when the spreadsheet opens. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('⚡ Automations')
    .addItem('Save attachments now', 'saveNow')
    .addSeparator()
    .addItem('Turn on hourly check', 'turnOnHourly')
    .addItem('Turn off hourly check', 'turnOffHourly')
    .addToUi();
}

function saveNow() {
  const n = saveAttachments();
  SpreadsheetApp.getActive().toast(n + ' file(s) saved to Drive', '⚡ Automations');
}

/** Saves new attachments and logs them. The hourly check runs this. */
function saveAttachments() {
  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (!sheet.getLastRow()) {
    sheet.appendRow(['Received', 'From', 'Subject', 'File', 'Size (KB)', 'Link']);
  }
  const label = GmailApp.getUserLabelByName(DONE_LABEL)
    || GmailApp.createLabel(DONE_LABEL);
  const query = SEARCH + ' -label:' + DONE_LABEL.replace(/\s+/g, '-');
  const zone = ss.getSpreadsheetTimeZone();
  let saved = 0;

  GmailApp.search(query, 0, 50).forEach(thread => {
    thread.getMessages().forEach(msg => {
      const date = msg.getDate();
      msg.getAttachments({ includeInlineImages: false }).forEach(file => {
        const month = BY_MONTH ? Utilities.formatDate(date, zone, 'yyyy-MM') : '';
        const saved_ = folder_(FOLDER_NAME, month).createFile(file.copyBlob());
        sheet.appendRow([date, msg.getFrom(), msg.getSubject(), file.getName(),
          Math.round(file.getSize() / 1024),
          '=HYPERLINK("' + saved_.getUrl() + '", "Open file")']);
        sheet.getRange(sheet.getLastRow(), 1, 1, 5)
          .setNumberFormats([['mmm d, h:mm am/pm', '@', '@', '@', '0']]);
        saved++;
      });
    });
    thread.addLabel(label);
  });
  return saved;
}

/** The Drive folder (and month subfolder), created when missing. */
function folder_(name, sub) {
  const found = DriveApp.getFoldersByName(name);
  const folder = found.hasNext() ? found.next() : DriveApp.createFolder(name);
  if (!sub) return folder;
  const inner = folder.getFoldersByName(sub);
  return inner.hasNext() ? inner.next() : folder.createFolder(sub);
}

function turnOnHourly() {
  turnOff_();
  ScriptApp.newTrigger('saveAttachments').timeBased().everyHours(1).create();
  SpreadsheetApp.getActive().toast('Hourly check on', '⚡ Automations');
}

function turnOffHourly() {
  const n = turnOff_();
  SpreadsheetApp.getActive().toast(n ? 'Hourly check off' : 'It was not on',
    '⚡ Automations');
}

function turnOff_() {
  const mine = ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'saveAttachments');
  mine.forEach(t => ScriptApp.deleteTrigger(t));
  return mine.length;
}
