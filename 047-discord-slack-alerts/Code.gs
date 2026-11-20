/**
 * Discord and Slack Alerts from Google Sheets (Apps Script Recipes #47)
 * When someone changes the Status of a row, the script posts a message to
 * your Discord or Slack channel, like "Order #1043 is now Shipped".
 * It uses an incoming webhook: a private link to one channel.
 *
 * How to use: create a webhook in Discord (Channel settings > Integrations)
 * or Slack (Incoming Webhooks app), then ⚡ Automations → "Set webhook link"
 * and "Turn on alerts". The link is stored privately, not in the code.
 *
 * License: MIT. Free to use and modify.
 */

// ================= SETTINGS: change these =================
const SHEET_NAME   = 'Orders';                 // tab to watch
const WATCH_COLUMN = 'Status';                 // alert when this column changes
const ALERT_ON     = [];                       // e.g. ['Shipped'] or [] = any value
const MESSAGE      = '{{Order}} is now **{{Status}}** ({{Customer}})';
// ===========================================================


/** Adds the ⚡ Automations menu when the spreadsheet opens. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('⚡ Automations')
    .addItem('Set webhook link', 'setWebhook')
    .addItem('Send a test message', 'testMessage')
    .addSeparator()
    .addItem('Turn on alerts', 'turnOnAlerts')
    .addItem('Turn off alerts', 'turnOffAlerts')
    .addToUi();
}

/** Asks for the webhook link and keeps it in the script's private storage. */
function setWebhook() {
  const ui = SpreadsheetApp.getUi();
  const res = ui.prompt('Paste your webhook link', ui.ButtonSet.OK_CANCEL);
  if (res.getSelectedButton() !== ui.Button.OK) return;
  const link = res.getResponseText().trim();
  PropertiesService.getScriptProperties().setProperty('WEBHOOK', link);
  SpreadsheetApp.getActive().toast('Webhook saved', '⚡ Automations', 10);
}

function testMessage() {
  post_('Hello from Google Sheets! Alerts are set up.');
  SpreadsheetApp.getActive().toast('Test message sent', '⚡ Automations', 10);
}

/** Runs on every edit (once alerts are on). */
function onStatusChange(e) {
  const sheet = e.range.getSheet();
  if (sheet.getName() !== SHEET_NAME || e.range.getRow() < 2) return;
  const head = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0]
    .map(h => h.trim());
  const col = head.indexOf(WATCH_COLUMN) + 1;
  if (e.range.getColumn() > col || e.range.getLastColumn() < col) return;
  for (let r = e.range.getRow(); r <= e.range.getLastRow(); r++) {
    const row = sheet.getRange(r, 1, 1, head.length).getDisplayValues()[0];
    const value = row[col - 1];
    if (!value || (ALERT_ON.length && !ALERT_ON.includes(value))) continue;
    post_(MESSAGE.replace(/{{(.+?)}}/g, (m, h) => row[head.indexOf(h)] ?? m));
  }
}

/** Sends one message. Discord and Slack want slightly different data. */
function post_(text) {
  const url = PropertiesService.getScriptProperties().getProperty('WEBHOOK');
  if (!url) throw new Error('No webhook yet: use "Set webhook link" first.');
  const slack = url.includes('hooks.slack.com');
  const body = slack ? { text: text.replace(/\*\*/g, '*') } : { content: text };
  UrlFetchApp.fetch(url, { method: 'post', contentType: 'application/json',
    payload: JSON.stringify(body) });
}

function turnOnAlerts() {
  turnOff_();
  ScriptApp.newTrigger('onStatusChange').forSpreadsheet(SpreadsheetApp.getActive())
    .onEdit().create();
  SpreadsheetApp.getActive().toast('Alerts on', '⚡ Automations', 10);
}

function turnOffAlerts() {
  const n = turnOff_();
  SpreadsheetApp.getActive().toast(n ? 'Alerts off' : 'They were not on',
    '⚡ Automations');
}

function turnOff_() {
  const mine = ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'onStatusChange');
  mine.forEach(t => ScriptApp.deleteTrigger(t));
  return mine.length;
}
