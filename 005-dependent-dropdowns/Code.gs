/**
 * Dependent Dropdowns on Every Row (Apps Script Recipes #5)
 * Pick a Category, and the Item dropdown in the same row shows only the
 * items of that category. Works on every row, even new ones.
 *
 * How to use: on a "Lists" tab, put each category in row 1 and its items
 * below it. Then ⚡ Automations → "Set up dropdowns" once.
 *
 * License: MIT. Free to use and modify.
 */

// ================= SETTINGS: change these =================
const SHEET_NAME       = 'Requests';   // tab with the dropdowns
const MAIN_COLUMN      = 'Category';   // first dropdown
const DEPENDENT_COLUMN = 'Item';       // second dropdown, depends on the first
const LISTS_SHEET      = 'Lists';      // categories in row 1, items below
// ===========================================================


/** Adds the ⚡ Automations menu when the spreadsheet opens. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('⚡ Automations')
    .addItem('Set up dropdowns', 'setUpDropdowns')
    .addToUi();
}

/** Puts the category dropdown on the whole MAIN_COLUMN (run once). */
function setUpDropdowns() {
  const { sheet, mainCol } = columns_();
  const lists = SpreadsheetApp.getActive().getSheetByName(LISTS_SHEET);
  const categories = lists.getRange(1, 1, 1, lists.getLastColumn());
  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInRange(categories, true).setAllowInvalid(false).build();
  sheet.getRange(2, mainCol, sheet.getMaxRows() - 1).setDataValidation(rule);
  SpreadsheetApp.getActive().toast('Dropdowns ready. Pick a ' + MAIN_COLUMN + '!',
    '⚡ Automations');
}

/** Runs after every edit: updates the item dropdown of the edited row(s). */
function onEdit(e) {
  const { sheet, mainCol, depCol } = columns_();
  const r = e.range;
  if (r.getSheet().getName() !== SHEET_NAME || r.getRow() < 2) return;
  if (mainCol < r.getColumn() || mainCol > r.getLastColumn()) return;

  for (let row = r.getRow(); row <= r.getLastRow(); row++) {
    const category = sheet.getRange(row, mainCol).getValue();
    const cell = sheet.getRange(row, depCol);
    const items = itemsFor_(category);
    if (!items.length) { cell.clearDataValidations().clearContent(); continue; }
    cell.setDataValidation(SpreadsheetApp.newDataValidation()
      .requireValueInList(items, true).setAllowInvalid(false).build());
    if (!items.includes(cell.getValue())) cell.clearContent();   // item doesn't fit
  }
}

/** The items listed under one category on the Lists tab. */
function itemsFor_(category) {
  if (!category) return [];
  const lists = SpreadsheetApp.getActive().getSheetByName(LISTS_SHEET);
  const values = lists.getDataRange().getDisplayValues();
  const col = values[0].indexOf(String(category));
  if (col < 0) return [];
  return values.slice(1).map(row => row[col]).filter(String);
}

function columns_() {
  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0]
    .map(h => h.trim());
  return { sheet, mainCol: headers.indexOf(MAIN_COLUMN) + 1,
                  depCol: headers.indexOf(DEPENDENT_COLUMN) + 1 };
}
