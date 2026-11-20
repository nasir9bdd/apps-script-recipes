/**
 * Create a Google Slides Report from Sheet Data (Apps Script Recipes #28)
 * Builds a new presentation: a title slide, then one slide per row with
 * the row's details. Every report is listed in a log tab with its link.
 *
 * How to use: ⚡ Automations → "Create slides report".
 * Rows with an empty title column are skipped.
 *
 * License: MIT. Free to use and modify.
 */

// ================= SETTINGS: change these =================
const SHEET_NAME   = 'Projects';                   // tab with your data
const DECK_NAME    = 'Project Report {{date}}';    // name of each presentation
const DECK_TITLE   = 'Project Update';             // big text on the first slide
const TITLE_COLUMN = 'Project';                    // slide title for each row
const SKIP_COLUMNS = [];                           // headers to leave out
const LOG_SHEET    = 'Reports';                    // tab listing every report
// ===========================================================


/** Adds the ⚡ Automations menu when the spreadsheet opens. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('⚡ Automations')
    .addItem('Create slides report', 'createReport')
    .addToUi();
}

function createReport() {
  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('No tab called "' + SHEET_NAME + '".');
  const values = sheet.getDataRange().getDisplayValues();
  const headers = values[0].map(h => h.trim());
  const titleCol = headers.indexOf(TITLE_COLUMN);
  if (titleCol < 0) throw new Error('No column "' + TITLE_COLUMN + '".');
  const zone = ss.getSpreadsheetTimeZone();
  const today = Utilities.formatDate(new Date(), zone, 'yyyy-MM-dd');

  const deck = SlidesApp.create(DECK_NAME.replace('{{date}}', today));
  const first = deck.getSlides()[0];                 // the empty title slide
  first.getPlaceholder(SlidesApp.PlaceholderType.CENTERED_TITLE)
    .asShape().getText().setText(DECK_TITLE);
  const date = Utilities.formatDate(new Date(), zone, 'MMMM d, yyyy');
  first.getPlaceholder(SlidesApp.PlaceholderType.SUBTITLE)
    .asShape().getText().setText(date);

  const rows = values.slice(1).filter(row => row[titleCol]);
  rows.forEach(row => {
    const slide = deck.appendSlide(SlidesApp.PredefinedLayout.TITLE_AND_BODY);
    slide.getPlaceholder(SlidesApp.PlaceholderType.TITLE)
      .asShape().getText().setText(row[titleCol]);
    const lines = headers
      .map((h, c) => c === titleCol || !h || SKIP_COLUMNS.includes(h) || !row[c]
        ? '' : h + ': ' + row[c])
      .filter(String);
    slide.getPlaceholder(SlidesApp.PlaceholderType.BODY)
      .asShape().getText().setText(lines.join('\n'));
  });
  deck.saveAndClose();

  const log = ss.getSheetByName(LOG_SHEET) || ss.insertSheet(LOG_SHEET);
  if (!log.getLastRow()) {
    log.appendRow(['Created', 'Slides', 'Report']);
    log.getRange(1, 1, 1, 3).setFontWeight('bold');
  }
  const link = '=HYPERLINK("' + deck.getUrl() + '", "' + deck.getName() + '")';
  log.appendRow([Utilities.formatDate(new Date(), zone, 'yyyy-MM-dd HH:mm'),
    rows.length + 1, link]);
  log.activate();
  ss.toast('Report created with ' + (rows.length + 1) + ' slides',
    '⚡ Automations', 10);
}
