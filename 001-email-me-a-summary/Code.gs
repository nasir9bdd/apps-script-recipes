/**
 * Email Me a Sheet Summary (Apps Script Recipes #1)
 * Adds a ⚡ Automations menu. One click emails you the number of rows
 * and the total of one column, with a link back to the sheet.
 *
 * How to use: paste, save, reload the sheet, then
 * ⚡ Automations → "Email me a summary". Approve the permissions once.
 * @OnlyCurrentDoc  (the script can only open this spreadsheet)
 * License: MIT. Free to use and modify.
 */

// ================= SETTINGS: change these =================
const SHEET_NAME    = 'Sales';                // tab with your data
const AMOUNT_COLUMN = 'Amount';               // header of the column to add up
const CURRENCY      = '$';                    // shown before the total
const SUBJECT       = 'Your sales summary';   // email subject
// ===========================================================


/** Adds the ⚡ Automations menu when the spreadsheet opens. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('⚡ Automations')
    .addItem('Email me a summary', 'emailSummary')
    .addToUi();
}

/** Counts the rows, adds up AMOUNT_COLUMN and emails the result to you. */
function emailSummary() {
  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) return alert_('No tab called "' + SHEET_NAME + '". Check SETTINGS.');

  const [headers, ...rows] = sheet.getDataRange().getValues();
  const col = headers.map(h => String(h).trim()).indexOf(AMOUNT_COLUMN);
  if (col < 0) return alert_('No column "' + AMOUNT_COLUMN + '". Check SETTINGS.');

  const filled = rows.filter(row => row.join('') !== '');
  const total = filled.reduce((sum, row) => sum + (Number(row[col]) || 0), 0);
  const me = Session.getActiveUser().getEmail();

  const body = [
    'Summary of "' + ss.getName() + '"',
    '',
    'Rows: ' + filled.length,
    'Total ' + AMOUNT_COLUMN + ': ' + CURRENCY + money_(total),
    '',
    'Open the sheet: ' + ss.getUrl(),
  ].join('\n');

  MailApp.sendEmail(me, SUBJECT, body);
  ss.toast('Summary sent to ' + me, '⚡ Automations');
}

/** 1234.5 → "1,234.50" */
function money_(n) {
  return n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function alert_(message) {
  SpreadsheetApp.getUi().alert(message);
  return null;
}
