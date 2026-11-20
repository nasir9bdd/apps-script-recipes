# =AI() in Google Sheets with Gemini

Apps Script Recipe #44 from [The Software Manual](https://www.youtube.com/playlist?list=PLGHFsC1aF4YM).

Ask Google's Gemini AI anything, right inside a formula:
  =AI("Translate to Spanish", A2)
  =AI("Is this review Positive, Negative or Neutral?", B2)
Answers are cached, so the same question isn't sent twice.

Setup: get a free API key at aistudio.google.com, then
⚡ Automations → "Set Gemini API key". The key is saved in the
script's properties, not in the code.

## Settings

Change these lines at the top of `Code.gs` to match your sheet:

```js
const MODEL        = 'gemini-3.8-flash';       // Gemini model to use
const TEMPERATURE  = 0.2;                      // 0 = predictable, 1 = creative
const MAX_WORDS    = 40;                       // keeps answers short
const CACHE_HOURS  = 6;                        // reuse answers for this long
const INSTRUCTIONS = 'Reply in plain text, with no markdown and no intro.';
```

## How to install

1. Open your Google Sheet and click **Extensions → Apps Script**.
2. Delete anything in the editor, then paste the whole contents of [`Code.gs`](Code.gs).
3. Edit the **SETTINGS** block for your sheet, then click **Save**.
4. Reload the spreadsheet. A **⚡ Automations** menu appears.
5. Run it from that menu. The first time, Google asks you to authorize the script: choose your account, click **Advanced → Go to (project) (unsafe)**, then **Allow**. This is normal for your own scripts.

## License

MIT. Free to use and modify. See [LICENSE](../LICENSE).
