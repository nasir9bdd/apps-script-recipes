/**
 * Auto-Grade a Quiz and Email the Results (Apps Script Recipes #35)
 * Grades every answer of your quiz form against an answer key in your
 * sheet, writes the score and Pass or Fail next to it, and emails each
 * person their result with the right answers to the questions they missed.
 *
 * How to use: put the questions and correct answers in an "Answer Key" tab,
 * then ⚡ Automations → "Grade new answers", or turn on auto-grading.
 *
 * License: MIT. Free to use and modify.
 */

// ================= SETTINGS: change these =================
const SHEET_NAME   = 'Quiz Answers';   // tab where the form saves the answers
const KEY_SHEET    = 'Answer Key';     // column A = question, B = right answer
const NAME_COLUMN  = 'Name';           // header of the name column
const EMAIL_COLUMN = 'Email';          // header of the email column
const PASS_MARK    = 70;               // % needed to pass
const SUBJECT      = 'Your quiz result: {{Score}}';
// ===========================================================


/** Adds the ⚡ Automations menu when the spreadsheet opens. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('⚡ Automations')
    .addItem('Grade new answers', 'gradeNow')
    .addSeparator()
    .addItem('Turn on auto-grading', 'turnOnAuto')
    .addItem('Turn off auto-grading', 'turnOffAuto')
    .addToUi();
}

function gradeNow() {
  const n = gradeAnswers();
  SpreadsheetApp.getActive().toast(n + ' answer(s) graded and emailed',
    '⚡ Automations', 10);
}

/** Grades every row that wasn't graded yet. Returns the number graded. */
function gradeAnswers() {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);                              // one grading at a time
  try {
    const ss = SpreadsheetApp.getActive();
    const sheet = ss.getSheetByName(SHEET_NAME);
    const keySheet = ss.getSheetByName(KEY_SHEET);
    if (!sheet || !keySheet) throw new Error('Tab not found. Check SETTINGS.');
    const key = keySheet.getDataRange().getDisplayValues().slice(1)
      .filter(r => r[0].trim());

    const width = sheet.getLastColumn();
    const head = sheet.getRange(1, 1, 1, width).getDisplayValues()[0]
      .map(h => h.trim());
    ['Score', 'Result', 'Emailed'].forEach(h => {      // add result columns once
      if (head.includes(h)) return;
      head.push(h);
      sheet.getRange(1, head.length).setValue(h).setFontWeight('bold');
    });
    const col = h => head.indexOf(h);
    const last = sheet.getLastRow();
    if (last < 2) return 0;
    const rows = sheet.getRange(2, 1, last - 1, head.length).getDisplayValues();

    let count = 0;
    rows.forEach((row, i) => {
      const email = row[col(EMAIL_COLUMN)].trim();
      if (!email || row[col('Emailed')]) return;      // already done
      const missed = key.filter(([q, answer]) => !same_(row[col(q.trim())], answer));
      const right = key.length - missed.length;
      const pct = Math.round(right / key.length * 100);
      const passed = pct >= PASS_MARK;
      const score = right + ' of ' + key.length;

      let body = 'Hi ' + row[col(NAME_COLUMN)] + ',\n\nYou scored ' + score +
        ' (' + pct + '%). ' + (passed ? 'You passed, well done!'
        : 'You need ' + PASS_MARK + '% to pass. Have another go!') + '\n';
      if (missed.length) {
        body += '\nThe right answers to the questions you missed:\n';
        missed.forEach(([q, a]) => { body += '- ' + q + ' → ' + a + '\n'; });
      }
      MailApp.sendEmail(email, SUBJECT.replace('{{Score}}', score), body);
      const now = Utilities.formatDate(new Date(), ss.getSpreadsheetTimeZone(),
        'MMM d, HH:mm');
      sheet.getRange(i + 2, col('Score') + 1, 1, 3)
        .setValues([[score, passed ? 'Pass' : 'Fail', 'Sent ✓ ' + now]]);
      count++;
    });
    return count;
  } finally {
    lock.releaseLock();
  }
}

/** Same answer? Ignores capitals, spaces and the order of checkboxes. */
function same_(given, answer) {
  const norm = s => String(s ?? '').split(',').map(p => p.trim().toLowerCase())
    .filter(String).sort().join(',');
  return norm(given) === norm(answer);
}

function turnOnAuto() {
  turnOff_();
  ScriptApp.newTrigger('gradeAnswers').forSpreadsheet(SpreadsheetApp.getActive())
    .onFormSubmit().create();
  SpreadsheetApp.getActive().toast('Auto-grading on', '⚡ Automations', 10);
}

function turnOffAuto() {
  const n = turnOff_();
  SpreadsheetApp.getActive().toast(n ? 'Auto-grading off' : 'It was not on',
    '⚡ Automations');
}

function turnOff_() {
  const mine = ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'gradeAnswers');
  mine.forEach(t => ScriptApp.deleteTrigger(t));
  return mine.length;
}
