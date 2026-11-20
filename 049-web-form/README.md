# Turn Your Sheet into a Web Form

Apps Script Recipe #49 from [The Software Manual](https://www.youtube.com/playlist?list=PLGHFsC1aF4YM).

▶ **Video walkthrough:** https://youtu.be/H66PtYvlMIY

Publishes a simple, mobile-friendly form. Its fields are your column
headers, and every answer is added as a new row.

How to use: Deploy → New deployment → Web app → Deploy,
then share the Web app link. Add a header = add a question.

## Settings

Change these lines at the top of `Code.gs` to match your sheet:

```js
const SHEET_NAME   = 'Sign-ups';                 // tab that collects the answers
const FORM_TITLE   = 'Workshop Sign-up';
const INTRO        = 'Save your seat. It takes 30 seconds.';
const THANK_YOU    = 'Thanks! You are on the list.';
const REQUIRED     = ['Name', 'Email'];          // headers that must be filled in
const CHOICES      = { 'Session': ['Morning', 'Afternoon'] };   // dropdowns
const TIME_COLUMN  = 'Submitted';                // filled in automatically
const BUTTON_COLOR = '#1a73e8';
```

## How to install

1. Open your Google Sheet and click **Extensions → Apps Script**.
2. Delete anything in the editor, then paste the whole contents of [`Code.gs`](Code.gs).
3. Edit the **SETTINGS** block for your sheet, then click **Save**.
4. Reload the spreadsheet. A **⚡ Automations** menu appears.
5. Run it from that menu. The first time, Google asks you to authorize the script: choose your account, click **Advanced → Go to (project) (unsafe)**, then **Allow**. This is normal for your own scripts.

## License

MIT. Free to use and modify. See [LICENSE](../LICENSE).
