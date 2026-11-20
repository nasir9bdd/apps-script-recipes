# Email Me a Sheet Summary

Apps Script Recipe #1 from [The Software Manual](https://www.youtube.com/playlist?list=PLGHFsC1aF4YM).

▶ **Video walkthrough:** https://youtu.be/RnYRVzGQYRo

Adds a ⚡ Automations menu. One click emails you the number of rows
and the total of one column, with a link back to the sheet.

How to use: paste, save, reload the sheet, then
⚡ Automations → "Email me a summary". Approve the permissions once.
@OnlyCurrentDoc  (the script can only open this spreadsheet)

## Settings

Change these lines at the top of `Code.gs` to match your sheet:

```js
const SHEET_NAME    = 'Sales';                // tab with your data
const AMOUNT_COLUMN = 'Amount';               // header of the column to add up
const CURRENCY      = '$';                    // shown before the total
const SUBJECT       = 'Your sales summary';   // email subject
```

## How to install

1. Open your Google Sheet and click **Extensions → Apps Script**.
2. Delete anything in the editor, then paste the whole contents of [`Code.gs`](Code.gs).
3. Edit the **SETTINGS** block for your sheet, then click **Save**.
4. Reload the spreadsheet. A **⚡ Automations** menu appears.
5. Run it from that menu. The first time, Google asks you to authorize the script: choose your account, click **Advanced → Go to (project) (unsafe)**, then **Allow**. This is normal for your own scripts.

## License

MIT. Free to use and modify. See [LICENSE](../LICENSE).
