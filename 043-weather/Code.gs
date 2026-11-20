/**
 * Daily Weather Forecast in Google Sheets (Apps Script Recipes #43)
 * Type city names in column A: the script fills in today's forecast for
 * each one: high and low temperature, chance of rain and the sky. It uses
 * Open-Meteo, a free weather service: no sign-up and no API key.
 *
 * How to use: ⚡ Automations → "Get the forecast now", or turn on daily
 * updates to have a fresh forecast every morning.
 *
 * License: MIT. Free to use and modify.
 */

// ================= SETTINGS: change these =================
const SHEET_NAME  = 'Weather';     // column A = city names, row 1 = headers
const UNITS       = 'celsius';     // 'celsius' or 'fahrenheit'
const UPDATE_HOUR = 6;             // daily update around this hour
// ===========================================================


/** Adds the ⚡ Automations menu when the spreadsheet opens. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('⚡ Automations')
    .addItem('Get the forecast now', 'forecastNow')
    .addSeparator()
    .addItem('Turn on daily updates', 'turnOnDaily')
    .addItem('Turn off daily updates', 'turnOffDaily')
    .addToUi();
}

function forecastNow() {
  const n = updateWeather();
  SpreadsheetApp.getActive().toast(n + ' forecast(s) updated', '⚡ Automations', 10);
}

/** Fills columns B to F for every city. Returns the count. */
function updateWeather() {
  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('No tab called "' + SHEET_NAME + '".');
  const unit = UNITS === 'fahrenheit' ? 'F' : 'C';
  sheet.getRange(1, 1, 1, 6)
    .setValues([['City', 'Day', 'High ' + unit, 'Low ' + unit, 'Rain', 'Sky']])
    .setFontWeight('bold');
  const last = sheet.getLastRow();
  if (last < 2) return 0;
  const cities = sheet.getRange(2, 1, last - 1, 1).getValues()
    .map(r => String(r[0]).trim());

  const out = cities.map(city => {
    if (!city) return ['', '', '', '', ''];
    const place = find_(city);
    if (!place) return ['City not found', '', '', '', ''];
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=' + place.latitude +
      '&longitude=' + place.longitude + '&timezone=auto&forecast_days=1' +
      '&temperature_unit=' + UNITS + '&daily=temperature_2m_max,temperature_2m_min,' +
      'precipitation_probability_max,weather_code';
    const d = JSON.parse(UrlFetchApp.fetch(url).getContentText()).daily;
    const noon = new Date(d.time[0] + 'T12:00:00Z');
    const day = Utilities.formatDate(noon, 'UTC', 'EEE, MMM d');
    return [day, d.temperature_2m_max[0], d.temperature_2m_min[0],
      (d.precipitation_probability_max[0] || 0) / 100, sky_(d.weather_code[0])];
  });
  sheet.getRange(2, 2, out.length, 5).setValues(out);
  sheet.getRange(2, 3, out.length, 2).setNumberFormat('0.0');
  sheet.getRange(2, 5, out.length).setNumberFormat('0%');
  return out.filter(r => typeof r[1] === 'number').length;
}

/** Turns a city name into its map position (free geocoding, no key). */
function find_(city) {
  const url = 'https://geocoding-api.open-meteo.com/v1/search?count=1&name=' +
    encodeURIComponent(city);
  return (JSON.parse(UrlFetchApp.fetch(url).getContentText()).results || [])[0];
}

/** Weather code -> plain words. */
function sky_(c) {
  if (c === 0) return 'Clear';
  if (c <= 2) return 'Partly cloudy';
  if (c === 3) return 'Cloudy';
  if (c <= 48) return 'Fog';
  if (c <= 57) return 'Drizzle';
  if (c <= 67) return 'Rain';
  if (c <= 77) return 'Snow';
  if (c <= 82) return 'Showers';
  if (c <= 86) return 'Snow showers';
  return 'Thunderstorm';
}

function turnOnDaily() {
  turnOff_();
  ScriptApp.newTrigger('updateWeather').timeBased()
    .everyDays(1).atHour(UPDATE_HOUR).create();
  SpreadsheetApp.getActive().toast('Daily updates on, around ' + UPDATE_HOUR + ':00',
    '⚡ Automations', 10);
}

function turnOffDaily() {
  const n = turnOff_();
  SpreadsheetApp.getActive().toast(n ? 'Daily updates off' : 'They were not on',
    '⚡ Automations');
}

function turnOff_() {
  const mine = ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'updateWeather');
  mine.forEach(t => ScriptApp.deleteTrigger(t));
  return mine.length;
}
