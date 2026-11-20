# Move a Row to Another Tab When It's Done

Apps Script Recipe #3 from [The Software Manual](https://www.youtube.com/playlist?list=PLGHFsC1aF4YM).

▶ **Video walkthrough:** https://youtu.be/Venwj8iBNoQ

When the Status of a row becomes "Done", the whole row moves to the "Done" tab.
The Done tab is created for you (with the same headers) if it doesn't exist yet.

How to use: paste, save, and set any row's Status to Done. No menu and no
permissions needed: onEdit runs by itself every time you edit a cell.

## Settings

Change these lines at the top of `Code.gs` to match your sheet:

```js
const SOURCE_SHEET  = 'Tasks';    // tab with your active rows
const TARGET_SHEET  = 'Done';     // tab where finished rows go
const STATUS_COLUMN = 'Status';   // header of the column to watch
const MOVE_WHEN     = 'Done';     // Status value that moves the row (any case)
```

## How to install

1. Open your Google Sheet and click **Extensions → Apps Script**.
2. Delete anything in the editor, then paste the whole contents of [`Code.gs`](Code.gs).
3. Edit the **SETTINGS** block for your sheet, then click **Save**.
4. Reload the spreadsheet. A **⚡ Automations** menu appears.
5. Run it from that menu. The first time, Google asks you to authorize the script: choose your account, click **Advanced → Go to (project) (unsafe)**, then **Allow**. This is normal for your own scripts.

## License

MIT. Free to use and modify. See [LICENSE](../LICENSE).
