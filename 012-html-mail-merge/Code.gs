/**
 * Mail Merge with Beautiful HTML Emails (Apps Script Recipes #12)
 * Design your email as a normal Gmail draft (bold text, colors, links,
 * buttons, attachments), then send one personal copy to every row.
 * Write {{Column Name}} anywhere in the draft to insert that row's value.
 *
 * How to use: create the Gmail draft, put its subject in DRAFT_SUBJECT,
 * then ⚡ Automations → "Send emails". Rows with a status are skipped.
 * Free Gmail accounts can send about 100 emails a day.
 *
 * License: MIT. Free to use and modify.
 */

// ================= SETTINGS: change these =================
const SHEET_NAME    = 'Contacts';                   // tab with one person per row
const DRAFT_SUBJECT = 'News for {{First Name}}';    // subject of your Gmail draft
const EMAIL_COLUMN  = 'Email';                      // header of the email column
const STATUS_COLUMN = 'Status';                     // the script writes "Sent" here
const SENDER_NAME   = 'Bright Studio';              // name people see as the sender
// ===========================================================


/** Adds the ⚡ Automations menu when the spreadsheet opens. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('⚡ Automations')
    .addItem('Send emails', 'sendEmails')
    .addToUi();
}

/** Sends the draft to every row that has an email and no status yet. */
function sendEmails() {
  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) return alert_('No tab called "' + SHEET_NAME + '". Check SETTINGS.');
  const values = sheet.getDataRange().getDisplayValues();
  const headers = values[0].map(h => h.trim());
  const emailCol = headers.indexOf(EMAIL_COLUMN);
  const statusCol = headers.indexOf(STATUS_COLUMN);
  if (emailCol < 0 || statusCol < 0) return alert_('Check the columns in SETTINGS.');

  const draft = GmailApp.getDrafts()
    .find(d => d.getMessage().getSubject() === DRAFT_SUBJECT);
  if (!draft) return alert_('No Gmail draft called "' + DRAFT_SUBJECT + '".');
  const msg = draft.getMessage();
  const zone = ss.getSpreadsheetTimeZone();
  let sent = 0;

  values.slice(1).forEach((row, i) => {
    if (!row[emailCol] || row[statusCol]) return;     // no address, or already sent
    const fill = (text, html) => text.replace(/\{\{([^}]+)\}\}/g, (m, name) => {
      const col = headers.indexOf(name.replace(/&nbsp;/g, ' ').trim());
      if (col < 0) return m;
      return html ? escape_(row[col]) : row[col];
    });
    const to = row[emailCol];
    GmailApp.sendEmail(to, fill(msg.getSubject()), fill(msg.getPlainBody()), {
      htmlBody: fill(msg.getBody(), true),
      attachments: msg.getAttachments({ includeInlineImages: false }),
      name: SENDER_NAME,
    });
    sheet.getRange(i + 2, statusCol + 1)
      .setValue('Sent ✓ ' + Utilities.formatDate(new Date(), zone, 'MMM d, HH:mm'));
    SpreadsheetApp.flush();
    sent++;
  });
  ss.toast(sent + ' email(s) sent', '⚡ Automations');
}

/** Makes a value safe to put inside HTML. */
function escape_(text) {
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function alert_(message) {
  SpreadsheetApp.getUi().alert(message);
}
