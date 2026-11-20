/**
 * Send Sheet Rows to Google Tasks (Apps Script Recipes #39)
 * Every row of your to-do list becomes a Google Task, with its due date
 * and notes, so it shows up in Gmail, Calendar and the Tasks app on your
 * phone. Tick a task as done, and the sheet shows it too.
 *
 * Needs the Google Tasks service: in the editor, click + next to Services,
 * pick "Google Tasks API" and click Add.
 *
 * License: MIT. Free to use and modify.
 */

// ================= SETTINGS: change these =================
const SHEET_NAME   = 'To-Do';           // tab with your tasks
const LIST_NAME    = 'From my sheet';   // task list (created if missing)
const TITLE_COLUMN = 'Task';            // header of the task column
const DUE_COLUMN   = 'Due';             // header of the due date column
const NOTES_COLUMN = 'Notes';           // header of the notes column ('' = none)
// ===========================================================


/** Adds the ⚡ Automations menu when the spreadsheet opens. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('⚡ Automations')
    .addItem('Send to Google Tasks', 'sendTasks')
    .addItem("Check what's done", 'checkDone')
    .addToUi();
}

/** Adds every row that isn't a task yet. */
function sendTasks() {
  const { sheet, head, rows } = read_();
  const listId = list_();
  const zone = SpreadsheetApp.getActive().getSpreadsheetTimeZone();
  let count = 0;
  for (let i = rows.length - 1; i >= 0; i--) {     // last row first: same order
    const row = rows[i];
    const title = String(row[head.indexOf(TITLE_COLUMN)]).trim();
    if (!title || row[head.indexOf('Task ID')]) continue;   // empty or already sent
    const task = { title: title };
    const due = row[head.indexOf(DUE_COLUMN)];
    if (due instanceof Date) {
      task.due = Utilities.formatDate(due, zone, 'yyyy-MM-dd') + 'T00:00:00.000Z';
    }
    if (NOTES_COLUMN) task.notes = String(row[head.indexOf(NOTES_COLUMN)] || '');
    const made = Tasks.Tasks.insert(task, listId);
    sheet.getRange(i + 2, head.indexOf('Status') + 1).setValue('Sent ✓');
    sheet.getRange(i + 2, head.indexOf('Task ID') + 1).setValue(made.id);
    count++;
  }
  SpreadsheetApp.getActive().toast(count + ' task(s) added to "' + LIST_NAME + '"',
    '⚡ Automations', 10);
}

/** Marks the rows whose task was ticked as done in Google Tasks. */
function checkDone() {
  const { sheet, head, rows } = read_();
  const listId = list_();
  const done = new Set();
  let page;
  do {
    const res = Tasks.Tasks.list(listId, { showCompleted: true, showHidden: true,
      maxResults: 100, pageToken: page });
    (res.items || []).filter(t => t.status === 'completed')
      .forEach(t => done.add(t.id));
    page = res.nextPageToken;
  } while (page);
  let count = 0;
  rows.forEach((row, i) => {
    if (!done.has(row[head.indexOf('Task ID')])) return;
    if (row[head.indexOf('Status')] !== 'Done ✓') count++;
    sheet.getRange(i + 2, head.indexOf('Status') + 1).setValue('Done ✓');
  });
  SpreadsheetApp.getActive().toast(count + ' task(s) done', '⚡ Automations', 10);
}

/** The sheet, its headers (Status and Task ID added once) and its rows. */
function read_() {
  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('No tab called "' + SHEET_NAME + '". Check SETTINGS.');
  const head = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
    .map(h => String(h).trim());
  ['Status', 'Task ID'].forEach(h => {
    if (head.includes(h)) return;
    head.push(h);
    sheet.getRange(1, head.length).setValue(h).setFontWeight('bold');
  });
  sheet.hideColumns(head.indexOf('Task ID') + 1);     // IDs link rows to tasks
  const last = sheet.getLastRow();
  const rows = last > 1
    ? sheet.getRange(2, 1, last - 1, head.length).getValues() : [];
  return { sheet, head, rows };
}

/** The ID of the task list, created the first time. */
function list_() {
  const lists = Tasks.Tasklists.list({ maxResults: 100 }).items || [];
  const found = lists.find(l => l.title === LIST_NAME);
  return found ? found.id : Tasks.Tasklists.insert({ title: LIST_NAME }).id;
}
