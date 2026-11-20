/**
 * Turn Your Sheet into a Web Form (Apps Script Recipes #49)
 * Publishes a simple, mobile-friendly form. Its fields are your column
 * headers, and every answer is added as a new row.
 *
 * How to use: Deploy → New deployment → Web app → Deploy,
 * then share the Web app link. Add a header = add a question.
 *
 * License: MIT. Free to use and modify.
 */

// ================= SETTINGS: change these =================
const SHEET_NAME   = 'Sign-ups';                 // tab that collects the answers
const FORM_TITLE   = 'Workshop Sign-up';
const INTRO        = 'Save your seat. It takes 30 seconds.';
const THANK_YOU    = 'Thanks! You are on the list.';
const REQUIRED     = ['Name', 'Email'];          // headers that must be filled in
const CHOICES      = { 'Session': ['Morning', 'Afternoon'] };   // dropdowns
const TIME_COLUMN  = 'Submitted';                // filled in automatically
const BUTTON_COLOR = '#1a73e8';
// ===========================================================


/** Shows the form when someone opens the web app link. */
function doGet() {
  const fields = headers_().filter(h => h && h !== TIME_COLUMN).map(field_).join('');
  return HtmlService.createHtmlOutput(page_(fields))
    .setTitle(FORM_TITLE)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/** Called by the form: adds one row, in the same order as the headers. */
function submit(answers) {
  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
  const row = headers_().map(h => h === TIME_COLUMN ? new Date() : answers[h] || '');
  sheet.appendRow(row);
  return THANK_YOU;
}

function headers_() {
  const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('No tab called "' + SHEET_NAME + '". Check SETTINGS.');
  return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0]
    .map(h => h.trim());
}

/** One question: a dropdown, or a text box with a fitting type. */
function field_(name) {
  const req = REQUIRED.includes(name) ? ' required' : '';
  const label = '<label>' + esc_(name) + (req ? ' *' : '') + '</label>';
  if (CHOICES[name]) {
    const options = CHOICES[name].map(o => '<option>' + esc_(o) + '</option>');
    return label + '<select name="' + esc_(name) + '"' + req + '>'
      + options.join('') + '</select>';
  }
  const type = /e-?mail/i.test(name) ? 'email' : /date/i.test(name) ? 'date'
             : /phone/i.test(name) ? 'tel' : 'text';
  return label + '<input type="' + type + '" name="' + esc_(name) + '"' + req + '>';
}

function page_(fields) {
  return `<!doctype html><html><head><base target="_top"><style>
  body { font-family: Arial, sans-serif; background: #f1f3f4; padding: 24px; }
  form, .done { max-width: 460px; margin: auto; background: #fff; padding: 28px;
    border-radius: 12px; box-shadow: 0 1px 4px rgba(0,0,0,.15); }
  h1 { margin: 0 0 6px; font-size: 26px; } p { color: #555; margin: 0 0 18px; }
  label { display: block; font-weight: bold; margin: 14px 0 6px; }
  input, select { width: 100%; box-sizing: border-box; padding: 10px; font-size: 16px;
    border: 1px solid #ccc; border-radius: 6px; }
  button { margin-top: 22px; width: 100%; padding: 12px; font-size: 17px; border: 0;
    border-radius: 6px; color: #fff; background: ${BUTTON_COLOR}; cursor: pointer; }
  </style></head><body>
  <form id="f"><h1>${esc_(FORM_TITLE)}</h1><p>${esc_(INTRO)}</p>${fields}
  <button id="b">Submit</button></form>
  <script>
    document.getElementById('f').addEventListener('submit', e => {
      e.preventDefault();
      document.getElementById('b').disabled = true;
      const answers = Object.fromEntries(new FormData(e.target));
      google.script.run.withSuccessHandler(msg => {
        document.body.innerHTML = '<div class="done"><h1>' + msg + '</h1></div>';
      }).submit(answers);
    });
  </script></body></html>`;
}

function esc_(text) {
  return String(text).replace(/[&<>"]/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
}
