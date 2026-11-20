/**
 * Keep Google Form Choices in Sync with a Sheet (Apps Script Recipes #34)
 * The options of a form question (dropdown, multiple choice or checkboxes)
 * come from a column in your sheet. Add, remove or rename a value in the
 * sheet, and the form updates by itself.
 *
 * How to use: paste your form's link in FORM_URL, then
 * ⚡ Automations → "Sync now" or "Turn on auto-sync".
 *
 * License: MIT. Free to use and modify.
 */

// ================= SETTINGS: change these =================
const FORM_URL   =                                // your form's link (edit page)
  'PASTE_YOUR_FORM_LINK_HERE';
const QUESTION   = 'Product';                     // the question to update
const SHEET_NAME = 'Products';                    // tab with the choices
const COLUMN     = 'Product';                     // header of the choices column
const ONLY_IF    = ['In Stock', 'Yes'];           // [header, value] or [] = all rows
// ===========================================================


/** Adds the ⚡ Automations menu when the spreadsheet opens. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('⚡ Automations')
    .addItem('Sync now', 'syncNow')
    .addSeparator()
    .addItem('Turn on auto-sync', 'turnOnAuto')
    .addItem('Turn off auto-sync', 'turnOffAuto')
    .addToUi();
}

function syncNow() {
  const n = syncChoices();
  SpreadsheetApp.getActive().toast('Form updated: ' + n + ' choices',
    '⚡ Automations', 10);
}

/** Runs after every edit once auto-sync is on. */
function onEditSync(e) {
  if (e.range.getSheet().getName() === SHEET_NAME) syncChoices();
}

/** Copies the column's values into the question. Returns the number of choices. */
function syncChoices() {
  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
  const values = sheet.getDataRange().getDisplayValues();
  const headers = values[0].map(h => h.trim());
  const c = headers.indexOf(COLUMN);
  if (c < 0) throw new Error('No column "' + COLUMN + '". Check SETTINGS.');
  const f = ONLY_IF.length ? headers.indexOf(ONLY_IF[0]) : -1;

  const choices = [];
  values.slice(1).forEach(row => {
    const v = row[c].trim();
    if (!v || choices.includes(v)) return;             // no blanks or duplicates
    if (f >= 0 && row[f].trim().toLowerCase() !== ONLY_IF[1].toLowerCase()) return;
    choices.push(v);
  });
  if (!choices.length) throw new Error('No choices found in "' + COLUMN + '".');

  const id = /\/d\/([\w-]{20,})/.exec(FORM_URL);
  if (!id) throw new Error('FORM_URL is not a Google Forms link. Check SETTINGS.');
  const form = FormApp.openById(id[1]);
  const item = form.getItems().find(i => i.getTitle().trim() === QUESTION);
  if (!item) throw new Error('No question "' + QUESTION + '" in the form.');
  const type = item.getType();
  if (type === FormApp.ItemType.LIST) item.asListItem().setChoiceValues(choices);
  else if (type === FormApp.ItemType.MULTIPLE_CHOICE) {
    item.asMultipleChoiceItem().setChoiceValues(choices);
  } else if (type === FormApp.ItemType.CHECKBOX) {
    item.asCheckboxItem().setChoiceValues(choices);
  } else throw new Error('"' + QUESTION + '" needs to be a question with choices.');
  return choices.length;
}

function turnOnAuto() {
  turnOff_();
  ScriptApp.newTrigger('onEditSync').forSpreadsheet(SpreadsheetApp.getActive())
    .onEdit().create();
  SpreadsheetApp.getActive().toast('Auto-sync on. Edit the list to try it!',
    '⚡ Automations', 10);
}

function turnOffAuto() {
  const n = turnOff_();
  SpreadsheetApp.getActive().toast(n ? 'Auto-sync off' : 'It was not on',
    '⚡ Automations');
}

function turnOff_() {
  const mine = ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'onEditSync');
  mine.forEach(t => ScriptApp.deleteTrigger(t));
  return mine.length;
}
