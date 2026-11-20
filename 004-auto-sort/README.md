# Auto-Sort a Sheet Whenever Data Changes

Apps Script Recipe #4 from [The Software Manual](https://www.youtube.com/playlist?list=PLGHFsC1aF4YM).

▶ **Video walkthrough:** https://youtu.be/KlAhfeX8Z04

Every time you edit the sheet, the rows are sorted again, for example
by due date or by priority. Your header row stays at the top.

How to use: paste, save, done. It runs by itself on every edit.

## Settings

Change these lines at the top of `Code.gs` to match your sheet:

```js
const SHEET_NAME  = 'Tasks';        // tab to keep sorted
const SORT_BY     = 'Due Date';     // header of the column to sort by
const ASCENDING   = true;           // true = A to Z, oldest first; false = reverse
const THEN_BY     = '';             // optional second sort column, e.g. 'Owner'
const HEADER_ROWS = 1;              // rows at the top that never move
```

## How to install

1. Open your Google Sheet and click **Extensions → Apps Script**.
2. Delete anything in the editor, then paste the whole contents of [`Code.gs`](Code.gs).
3. Edit the **SETTINGS** block for your sheet, then click **Save**.
4. Reload the spreadsheet. A **⚡ Automations** menu appears.
5. Run it from that menu. The first time, Google asks you to authorize the script: choose your account, click **Advanced → Go to (project) (unsafe)**, then **Allow**. This is normal for your own scripts.

## License

MIT. Free to use and modify. See [LICENSE](../LICENSE).
