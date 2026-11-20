/**
 * Mail Merge from Google Sheets (Apps Script Recipes #11)
 * Sends one personalised email per row of your sheet.
 * Write {{Header Name}} in the subject or message and it is replaced
 * with that row's value, exactly as it looks in the sheet.
 *
 * How to use: ⚡ Automations menu → "Send a test email to me", then "Send emails".
 * Rows that already have something in the Status column are skipped,
 * so you can run it again safely after adding new rows.
 *
 * License: MIT. Free to use and modify.
 */

// ================= SETTINGS: change these =================
const SHEET_NAME    = 'Mail Merge';   // name of the tab with your list
const EMAIL_COLUMN  = 'Email';        // header of the column with email addresses
const STATUS_COLUMN = 'Status';       // header of the column where "Sent" is written
const SENDER_NAME   = 'Sheets Automations';  // name people see as the sender
const SUBJECT       = 'Hi {{Name}}, your invoice is ready';
const MESSAGE = `Hi {{Name}},

Your invoice for {{Amount}} is ready and is due on {{Due Date}}.

Thank you for working with us!
Best regards`;
// ===========================================================


/** Adds the ⚡ Automations menu when the spreadsheet opens. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('⚡ Automations')
    .addItem('Send a test email to me', 'sendTestEmail')
    .addItem('Send emails', 'sendEmails')
    .addToUi();
}

/** Sends one email per row that has an email address and an empty Status. */
function sendEmails() {
  const list = readList_();
  if (!list) return;
  const { sheet, headers, rows, emailCol, statusCol } = list;
  const ss = SpreadsheetApp.getActive();
  let sent = 0;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const email = row[emailCol].trim();
    if (!email || row[statusCol]) continue;           // no address, or already done

    if (MailApp.getRemainingDailyQuota() < 1) {
      alert_('Daily email limit reached. Run it again tomorrow to send the rest.');
      break;
    }
    const statusCell = sheet.getRange(i + 2, statusCol + 1);
    try {
      MailApp.sendEmail({
        to: email,
        subject: fill_(SUBJECT, headers, row),
        body: fill_(MESSAGE, headers, row),
        name: SENDER_NAME,
      });
      statusCell.setValue('Sent ✓ ' + Utilities.formatDate(new Date(), ss.getSpreadsheetTimeZone(), 'MMM d, HH:mm'));
      sent++;
    } catch (err) {
      statusCell.setValue('Error: ' + err.message);
    }
    SpreadsheetApp.flush();                             // show progress row by row
  }
  ss.toast(sent + ' email(s) sent.', '⚡ Mail Merge', 5);
}

/** Sends the first row's email to you, so you can check how it looks. */
function sendTestEmail() {
  const list = readList_();
  if (!list) return;
  const { headers, rows } = list;
  if (!rows.length) return alert_('Add at least one row below the headers first.');
  const me = Session.getActiveUser().getEmail();
  MailApp.sendEmail({
    to: me,
    subject: '[TEST] ' + fill_(SUBJECT, headers, rows[0]),
    body: fill_(MESSAGE, headers, rows[0]),
    name: SENDER_NAME,
  });
  SpreadsheetApp.getActive().toast('Test email sent to ' + me, '⚡ Mail Merge', 5);
}


// ---------- helpers (no need to change anything below) ----------

/** Reads the tab and finds the Email and Status columns by their headers. */
function readList_() {
  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
  if (!sheet) return alert_('Tab "' + SHEET_NAME + '" not found. Check SHEET_NAME in SETTINGS.');
  const values = sheet.getDataRange().getDisplayValues();   // values as they look in the sheet
  const headers = values[0].map(h => h.trim());
  const emailCol = headers.indexOf(EMAIL_COLUMN);
  const statusCol = headers.indexOf(STATUS_COLUMN);
  if (emailCol < 0) return alert_('Column "' + EMAIL_COLUMN + '" not found. Check EMAIL_COLUMN in SETTINGS.');
  if (statusCol < 0) return alert_('Column "' + STATUS_COLUMN + '" not found. Check STATUS_COLUMN in SETTINGS.');
  return { sheet, headers, rows: values.slice(1), emailCol, statusCol };
}

/** Replaces every {{Header}} with the value from that row. Unknown names are left as they are. */
function fill_(template, headers, row) {
  return template.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (match, name) => {
    const col = headers.indexOf(name);
    return col < 0 ? match : row[col];
  });
}

function alert_(message) {
  SpreadsheetApp.getUi().alert(message);
  return null;
}
