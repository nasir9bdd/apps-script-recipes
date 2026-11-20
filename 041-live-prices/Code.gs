/**
 * Live Currency and Crypto Prices in Google Sheets (Apps Script Recipes #41)
 * Type currency or crypto codes (EUR, GBP, BTC, ETH...) in column A: the
 * script fills in the price, the change since the last update and the
 * time. Every update is also saved in a history tab, so you can chart it.
 * Prices come from a free public API (Coinbase), no key or sign-up needed.
 *
 * How to use: ⚡ Automations → "Update prices now", or turn on hourly updates.
 *
 * License: MIT. Free to use and modify.
 */

// ================= SETTINGS: change these =================
const SHEET_NAME    = 'Prices';          // column A = codes, row 1 = headers
const BASE          = 'USD';             // prices are shown in this currency
const HISTORY_SHEET = 'Price History';   // '' = don't keep a history
const EVERY_HOURS   = 1;                 // 1, 2, 4, 6, 8 or 12
// ===========================================================


/** Adds the ⚡ Automations menu when the spreadsheet opens. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('⚡ Automations')
    .addItem('Update prices now', 'updateNow')
    .addSeparator()
    .addItem('Turn on hourly updates', 'turnOnUpdates')
    .addItem('Turn off hourly updates', 'turnOffUpdates')
    .addToUi();
}

function updateNow() {
  const n = updatePrices();
  SpreadsheetApp.getActive().toast(n + ' prices updated', '⚡ Automations', 10);
}

/** Fetches the prices and fills columns B to D. Returns the count. */
function updatePrices() {
  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('No tab called "' + SHEET_NAME + '". Check SETTINGS.');
  const url = 'https://api.coinbase.com/v2/exchange-rates?currency=' + BASE;
  const rates = JSON.parse(UrlFetchApp.fetch(url).getContentText()).data.rates;

  sheet.getRange(1, 1, 1, 4)
    .setValues([['Code', 'Price (' + BASE + ')', 'Change', 'Updated']])
    .setFontWeight('bold');
  const last = sheet.getLastRow();
  if (last < 2) return 0;
  const zone = ss.getSpreadsheetTimeZone();
  const now = Utilities.formatDate(new Date(), zone, 'MMM d, h:mm a');
  const old = sheet.getRange(2, 1, last - 1, 2).getValues();

  const out = old.map(([code, before]) => {
    const rate = Number(rates[String(code).trim().toUpperCase()]);
    if (!code || !rate) return [code ? 'Unknown code' : '', '', ''];
    const price = 1 / rate;                          // 1 unit of code, in BASE
    const change = before && typeof before === 'number' ? price / before - 1 : '';
    return [price, change, now];
  });
  sheet.getRange(2, 2, out.length, 3).setValues(out);
  sheet.getRange(2, 2, out.length).setNumberFormat('#,##0.00##');
  sheet.getRange(2, 3, out.length).setNumberFormat('+0.000%;-0.000%;0.000%');

  if (HISTORY_SHEET) {
    let hist = ss.getSheetByName(HISTORY_SHEET);
    if (!hist) {
      hist = ss.insertSheet(HISTORY_SHEET, ss.getNumSheets());
      hist.appendRow(['Time'].concat(old.map(r => String(r[0]))));
      hist.getRange(1, 1, 1, old.length + 1).setFontWeight('bold');
      hist.setColumnWidth(1, 140);
      sheet.activate();                              // stay on the prices tab
    }
    hist.appendRow([new Date()].concat(out.map(r => r[0])));
    const row = hist.getLastRow();
    hist.getRange(row, 1).setNumberFormat('mmm d, h:mm am/pm');
    hist.getRange(row, 2, 1, out.length).setNumberFormat('#,##0.00##');
  }
  return out.filter(r => typeof r[0] === 'number').length;
}

function turnOnUpdates() {
  turnOff_();
  ScriptApp.newTrigger('updatePrices').timeBased().everyHours(EVERY_HOURS).create();
  SpreadsheetApp.getActive().toast('Updates on: every ' + EVERY_HOURS + ' hour(s)',
    '⚡ Automations', 10);
}

function turnOffUpdates() {
  const n = turnOff_();
  SpreadsheetApp.getActive().toast(n ? 'Updates off' : 'They were not on',
    '⚡ Automations');
}

function turnOff_() {
  const mine = ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'updatePrices');
  mine.forEach(t => ScriptApp.deleteTrigger(t));
  return mine.length;
}
