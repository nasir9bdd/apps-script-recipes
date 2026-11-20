# Automatic Timestamps in Google Sheets

Apps Script Recipe #2 from [The Software Manual](https://www.youtube.com/playlist?list=PLGHFsC1aF4YM).

▶ **Video walkthrough:** https://youtu.be/SkjLmVIK8TI

When you edit a row, "Last Updated" gets the current date and time.
"Created" is filled once, the first time the row gets data, and never changes.

How to use: paste, save, and start typing in your sheet. No menu and no
permissions needed: onEdit runs by itself every time you edit a cell.

## Settings

Change these lines at the top of `Code.gs` to match your sheet:

```js
const SHEET_NAME     = 'Tasks';          // name of the tab to watch
const WATCH_COLUMNS  = [];               // e.g. ['Status']. Empty = every column
const UPDATED_COLUMN = 'Last Updated';   // header of the "last changed" column
const CREATED_COLUMN = 'Created';        // "first added" column, or '' to turn off
const DATE_FORMAT    = 'mmm d, yyyy h:mm am/pm';
```

## How to install

1. Open your Google Sheet and click **Extensions → Apps Script**.
2. Delete anything in the editor, then paste the whole contents of [`Code.gs`](Code.gs).
3. Edit the **SETTINGS** block for your sheet, then click **Save**.
4. Reload the spreadsheet. A **⚡ Automations** menu appears.
5. Run it from that menu. The first time, Google asks you to authorize the script: choose your account, click **Advanced → Go to (project) (unsafe)**, then **Allow**. This is normal for your own scripts.

## License

MIT. Free to use and modify. See [LICENSE](../LICENSE).
