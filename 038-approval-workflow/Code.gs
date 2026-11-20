/**
 * Approval Workflow with Google Forms and Sheets (Apps Script Recipes #38)
 * Someone sends a request with your Google Form (time off, a purchase, an
 * expense...). The approver gets an email right away. In the sheet, they
 * pick Approved or Rejected, and the person who asked gets the answer.
 *
 * How to use: link your form to this sheet, set APPROVER, then
 * ⚡ Automations → "Turn on approvals".
 *
 * License: MIT. Free to use and modify.
 */

// ================= SETTINGS: change these =================
const APPROVER     = 'manager@example.com';   // gets each new request
const SHEET_NAME   = 'Requests';              // tab where the form saves answers
const NAME_COLUMN  = 'Name';                  // header of the name column
const EMAIL_COLUMN = 'Email';                 // header of the email column
const CHOICES      = ['Approved', 'Rejected'];
const SUBJECT      = 'Your request was {{Decision}}';
const MESSAGE      = 'Hi {{Name}},\n\nYour request was {{Decision}}.\n\n' +
                     'Request: {{Type}}, {{Details}}\n\nThanks!';
// ===========================================================


/** Adds the ⚡ Automations menu when the spreadsheet opens. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('⚡ Automations')
    .addItem('Turn on approvals', 'turnOnApprovals')
    .addItem('Turn off approvals', 'turnOffApprovals')
    .addToUi();
}

/** Adds the Decision and Status columns, then starts both triggers. */
function turnOnApprovals() {
  const ss = SpreadsheetApp.getActive();
  const sheet = sheet_();
  const head = headers_(sheet);
  ['Decision', 'Status'].forEach(h => {
    if (head.includes(h)) return;
    head.push(h);
    sheet.getRange(1, head.length).setValue(h).setFontWeight('bold');
  });
  for (let r = 2; r <= sheet.getLastRow(); r++) dropdown_(sheet, r);

  turnOff_();
  ScriptApp.newTrigger('newRequest').forSpreadsheet(ss).onFormSubmit().create();
  ScriptApp.newTrigger('onDecision').forSpreadsheet(ss).onEdit().create();
  ss.toast('Approvals on', '⚡ Automations', 10);
}

/** A new form answer: email the approver with every answer. */
function newRequest(e) {
  const sheet = e.range.getSheet();
  if (sheet.getName() !== SHEET_NAME) return;
  const head = headers_(sheet);
  const row = sheet.getRange(e.range.getRow(), 1, 1, head.length)
    .getDisplayValues()[0];
  const answers = head.map((h, i) => h + ': ' + row[i])
    .filter((a, i) => row[i] && !['Decision', 'Status'].includes(head[i]));
  dropdown_(sheet, e.range.getRow());
  const link = sheet.getParent().getUrl() + '#gid=' + sheet.getSheetId();
  MailApp.sendEmail(APPROVER, 'New request from ' + row[head.indexOf(NAME_COLUMN)],
    answers.join('\n') + '\n\nApprove or reject it here:\n' + link);
}

/** A decision was picked: email the person who asked. */
function onDecision(e) {
  const sheet = e.range.getSheet();
  const head = headers_(sheet);
  const r = e.range.getRow(), c = e.range.getColumn();
  if (sheet.getName() !== SHEET_NAME || r < 2 || c !== head.indexOf('Decision') + 1) {
    return;
  }
  const row = sheet.getRange(r, 1, 1, head.length).getDisplayValues()[0];
  const decision = row[c - 1];
  if (!CHOICES.includes(decision)) return;
  const fill = s => s.replace(/{{([^}]+)}}/g, (m, h) =>
    h === 'Decision' ? decision.toLowerCase() : row[head.indexOf(h)] ?? m);
  MailApp.sendEmail(row[head.indexOf(EMAIL_COLUMN)], fill(SUBJECT), fill(MESSAGE));
  const zone = sheet.getParent().getSpreadsheetTimeZone();
  const now = Utilities.formatDate(new Date(), zone, 'MMM d, HH:mm');
  sheet.getRange(r, head.indexOf('Status') + 1).setValue('Emailed ✓ ' + now);
}

/** Puts the Approved / Rejected dropdown in the Decision cell of a row. */
function dropdown_(sheet, row) {
  const rule = SpreadsheetApp.newDataValidation().requireValueInList(CHOICES)
    .setAllowInvalid(false).build();
  const col = headers_(sheet).indexOf('Decision') + 1;
  sheet.getRange(row, col).setDataValidation(rule);
}

function sheet_() {
  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('No tab called "' + SHEET_NAME + '". Check SETTINGS.');
  return sheet;
}

function headers_(sheet) {
  return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0]
    .map(h => h.trim());
}

function turnOffApprovals() {
  const n = turnOff_();
  SpreadsheetApp.getActive().toast(n ? 'Approvals off' : 'They were not on',
    '⚡ Automations');
}

function turnOff_() {
  const mine = ScriptApp.getProjectTriggers()
    .filter(t => ['newRequest', 'onDecision'].includes(t.getHandlerFunction()));
  mine.forEach(t => ScriptApp.deleteTrigger(t));
  return mine.length;
}
