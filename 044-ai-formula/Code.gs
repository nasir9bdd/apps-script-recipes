/**
 * =AI() in Google Sheets with Gemini (Apps Script Recipes #44)
 * Ask Google's Gemini AI anything, right inside a formula:
 *   =AI("Translate to Spanish", A2)
 *   =AI("Is this review Positive, Negative or Neutral?", B2)
 * Answers are cached, so the same question isn't sent twice.
 *
 * Setup: get a free API key at aistudio.google.com, then
 * ⚡ Automations → "Set Gemini API key". The key is saved in the
 * script's properties, not in the code.
 *
 * License: MIT. Free to use and modify.
 */

// ================= SETTINGS: change these =================
const MODEL        = 'gemini-3.8-flash';       // Gemini model to use
const TEMPERATURE  = 0.2;                      // 0 = predictable, 1 = creative
const MAX_WORDS    = 40;                       // keeps answers short
const CACHE_HOURS  = 6;                        // reuse answers for this long
const INSTRUCTIONS = 'Reply in plain text, with no markdown and no intro.';
// ===========================================================


/** Adds the ⚡ Automations menu when the spreadsheet opens. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('⚡ Automations')
    .addItem('Set Gemini API key', 'setApiKey')
    .addToUi();
}

/**
 * Asks Gemini a question, optionally about some cells.
 * @param {string} prompt What you want, e.g. "Summarize in 5 words".
 * @param {...any} cells Optional cells or ranges the question is about.
 * @return The AI's answer.
 * @customfunction
 */
function AI(prompt, ...cells) {
  if (!prompt) return 'Write a question, e.g. =AI("Translate to French", A2)';
  const key = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  if (!key) return 'No API key yet: ⚡ Automations → Set Gemini API key';

  const data = cells.map(toText_).filter(String).join('\n');
  const text = prompt + (data ? '\n\n' + data : '');
  const cache = CacheService.getScriptCache();
  const id = hash_([MODEL, TEMPERATURE, MAX_WORDS, INSTRUCTIONS, text].join('|'));
  const cached = cache.get(id);
  if (cached) return cached;

  const answer = askGemini_(key, text);
  cache.put(id, answer, Math.min(CACHE_HOURS, 6) * 3600);   // 6 hours is the maximum
  return answer;
}

/** Saves your API key in the script properties (menu item). */
function setApiKey() {
  const ui = SpreadsheetApp.getUi();
  const reply = ui.prompt('Gemini API key',
    'Paste your key from aistudio.google.com:', ui.ButtonSet.OK_CANCEL);
  if (reply.getSelectedButton() !== ui.Button.OK) return;
  const key = reply.getResponseText().trim();
  if (!key) return;
  PropertiesService.getScriptProperties().setProperty('GEMINI_API_KEY', key);
  SpreadsheetApp.getActive().toast('Key saved. Try =AI() in a cell!', '⚡ AI');
}

/** Calls the Gemini API. Retries when Google is busy. */
function askGemini_(key, text) {
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/'
    + MODEL + ':generateContent';
  const body = {
    systemInstruction: { parts: [{ text: INSTRUCTIONS
      + ' Use at most ' + MAX_WORDS + ' words.' }] },
    contents: [{ role: 'user', parts: [{ text: text }] }],
    generationConfig: { temperature: TEMPERATURE },
  };
  const options = {
    method: 'post', contentType: 'application/json', muteHttpExceptions: true,
    headers: { 'x-goog-api-key': key }, payload: JSON.stringify(body),
  };
  for (let attempt = 1; ; attempt++) {
    const res = UrlFetchApp.fetch(url, options);
    const code = res.getResponseCode();
    const json = JSON.parse(res.getContentText() || '{}');
    if (code === 200) {
      const parts = json.candidates?.[0]?.content?.parts ?? [];
      return parts.map(p => p.text || '').join('').trim() || '(no answer)';
    }
    if ((code === 429 || code >= 500) && attempt < 4) {   // busy: wait, try again
      Utilities.sleep(1500 * attempt);
      continue;
    }
    throw new Error('Gemini: ' + (json.error?.message || 'HTTP ' + code));
  }
}

/** Turns a cell or a range into text: cells joined with ", ", rows with new lines. */
function toText_(value) {
  if (!Array.isArray(value)) return String(value ?? '').trim();
  return value.map(row => [].concat(row).filter(String).join(', '))
    .filter(String).join('\n');
}

function hash_(text) {
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, text,
    Utilities.Charset.UTF_8);
  return Utilities.base64Encode(bytes);
}
