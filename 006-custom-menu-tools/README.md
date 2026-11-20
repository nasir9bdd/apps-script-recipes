# One-Click Tools: Build Your Own Custom Menu

Apps Script Recipe #6 from [The Software Manual](https://www.youtube.com/playlist?list=PLGHFsC1aF4YM).

▶ **Video walkthrough:** https://youtu.be/RHslkDdag3M

Adds a menu with handy buttons for a daily log: add today's row,
jump to today, sort newest first, and clear the selected rows.

How to use: paste, save, reload the sheet. Add your own tools by
copying one addItem line and one small function.

## Settings

Change these lines at the top of `Code.gs` to match your sheet:

```js
const SHEET_NAME  = 'Log';          // tab the tools work on
const DATE_COLUMN = 'Date';         // header of the date column
const MENU_NAME   = '⚡ Tools';      // name shown in the menu bar
```

## How to install

1. Open your Google Sheet and click **Extensions → Apps Script**.
2. Delete anything in the editor, then paste the whole contents of [`Code.gs`](Code.gs).
3. Edit the **SETTINGS** block for your sheet, then click **Save**.
4. Reload the spreadsheet. A **⚡ Automations** menu appears.
5. Run it from that menu. The first time, Google asks you to authorize the script: choose your account, click **Advanced → Go to (project) (unsafe)**, then **Allow**. This is normal for your own scripts.

## License

MIT. Free to use and modify. See [LICENSE](../LICENSE).
