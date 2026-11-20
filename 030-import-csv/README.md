# Auto-Import CSV Files from a Drive Folder

Apps Script Recipe #30 from [The Software Manual](https://www.youtube.com/playlist?list=PLGHFsC1aF4YM).

▶ **Video walkthrough:** https://youtu.be/_-y2kLQ4mrQ

Drop CSV files into a Google Drive folder: their rows are added to your
sheet, and each file is moved to an "Imported" folder so it's never
imported twice. Turn on auto-import to check the folder every 15 min.

How to use: ⚡ Automations → "Import now", or "Turn on auto-import".

## Settings

Change these lines at the top of `Code.gs` to match your sheet:

```js
const FOLDER      = 'CSV Inbox';    // folder name, or paste the folder's link
const SHEET_NAME  = 'Orders';       // rows are added at the bottom of this tab
const DONE_FOLDER = 'Imported';     // imported files move here (inside FOLDER)
const HAS_HEADER  = true;           // true = skip the first line of each file
const ADD_FILE_NAME = true;         // true = add a column with the file's name
```

## How to install

1. Open your Google Sheet and click **Extensions → Apps Script**.
2. Delete anything in the editor, then paste the whole contents of [`Code.gs`](Code.gs).
3. Edit the **SETTINGS** block for your sheet, then click **Save**.
4. Reload the spreadsheet. A **⚡ Automations** menu appears.
5. Run it from that menu. The first time, Google asks you to authorize the script: choose your account, click **Advanced → Go to (project) (unsafe)**, then **Allow**. This is normal for your own scripts.

## License

MIT. Free to use and modify. See [LICENSE](../LICENSE).
