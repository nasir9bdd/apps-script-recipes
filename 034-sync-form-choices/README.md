# Keep Google Form Choices in Sync with a Sheet

Apps Script Recipe #34 from [The Software Manual](https://www.youtube.com/playlist?list=PLGHFsC1aF4YM).

▶ **Video walkthrough:** https://youtu.be/R6CqOvI6Od4

The options of a form question (dropdown, multiple choice or checkboxes)
come from a column in your sheet. Add, remove or rename a value in the
sheet, and the form updates by itself.

How to use: paste your form's link in FORM_URL, then
⚡ Automations → "Sync now" or "Turn on auto-sync".

## Settings

Change these lines at the top of `Code.gs` to match your sheet:

```js
const FORM_URL   =                                // your form's link (edit page)
  'PASTE_YOUR_FORM_LINK_HERE';
const QUESTION   = 'Product';                     // the question to update
const SHEET_NAME = 'Products';                    // tab with the choices
const COLUMN     = 'Product';                     // header of the choices column
const ONLY_IF    = ['In Stock', 'Yes'];           // [header, value] or [] = all rows
```

## How to install

1. Open your Google Sheet and click **Extensions → Apps Script**.
2. Delete anything in the editor, then paste the whole contents of [`Code.gs`](Code.gs).
3. Edit the **SETTINGS** block for your sheet, then click **Save**.
4. Reload the spreadsheet. A **⚡ Automations** menu appears.
5. Run it from that menu. The first time, Google asks you to authorize the script: choose your account, click **Advanced → Go to (project) (unsafe)**, then **Allow**. This is normal for your own scripts.

## License

MIT. Free to use and modify. See [LICENSE](../LICENSE).
