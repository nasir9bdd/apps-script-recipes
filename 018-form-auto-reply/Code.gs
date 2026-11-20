/**
 * Auto-Reply to Every Google Form Submission (Apps Script Recipes #18)
 * Sends a personal confirmation email to everyone who fills in your
 * Google Form, using their own answers. Works for any form that saves
 * its responses to this spreadsheet.
 *
 * How to use: ⚡ Automations → "Turn on auto-replies".
 * Free Gmail accounts can send about 100 emails a day.
 *
 * License: MIT. Free to use and modify.
 */

// ================= SETTINGS: change these =================
const EMAIL_QUESTION = 'Email';              // the question that asks for an email
const SUBJECT        = 'You are in, {{Name}}!';
const MESSAGE        = 'Hi {{Name}},\n\nThanks for signing up for {{Workshop}}.'
                     + ' We will send you the details soon.\n\nSee you there!';
const STATUS_COLUMN  = 'Reply';              // added next to the answers
// ===========================================================


/** Adds the ⚡ Automations menu when the spreadsheet opens. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('⚡ Automations')
    .addItem('Turn on auto-replies', 'turnOnReplies')
    .addItem('Turn off auto-replies', 'turnOffReplies')
    .addToUi();
}

/** Runs after every form submission (once auto-replies are on). */
function replyToForm(e) {
  const answers = e.namedValues;             // { 'Name': ['Ana'], 'Email': [...] }
  const value = name => (answers[name] || [''])[0];
  const to = value(EMAIL_QUESTION).trim();
  const fill = text => text.replace(/\{\{\s*([^}]+?)\s*\}\}/g,
    (m, name) => name in answers ? value(name) : m);

  const sheet = e.range.getSheet();
  let col = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
    .indexOf(STATUS_COLUMN) + 1;
  if (!col) {                                // first time: add the status column
    col = sheet.getLastColumn() + 1;
    if (col > sheet.getMaxColumns()) sheet.insertColumnAfter(col - 1);
    sheet.getRange(1, col).setValue(STATUS_COLUMN).setFontWeight('bold');
  }
  const status = sheet.getRange(e.range.getRow(), col);
  if (!to) return status.setValue('No email');

  MailApp.sendEmail(to, fill(SUBJECT), fill(MESSAGE));
  const zone = SpreadsheetApp.getActive().getSpreadsheetTimeZone();
  status.setValue('Sent ✓ ' + Utilities.formatDate(new Date(), zone, 'MMM d, HH:mm'));
}

function turnOnReplies() {
  turnOff_();
  ScriptApp.newTrigger('replyToForm').forSpreadsheet(SpreadsheetApp.getActive())
    .onFormSubmit().create();
  SpreadsheetApp.getActive().toast('Auto-replies on. Try your form!', '⚡ Automations');
}

function turnOffReplies() {
  const n = turnOff_();
  SpreadsheetApp.getActive().toast(n ? 'Auto-replies off' : 'They were not on',
    '⚡ Automations');
}

function turnOff_() {
  const mine = ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'replyToForm');
  mine.forEach(t => ScriptApp.deleteTrigger(t));
  return mine.length;
}
