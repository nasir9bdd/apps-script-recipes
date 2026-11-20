# List All Files in a Drive Folder

Apps Script Recipe #25 from [The Software Manual](https://www.youtube.com/playlist?list=PLGHFsC1aF4YM).

▶ **Video walkthrough:** https://youtu.be/m7FBjB1gGSA

Writes every file in a Google Drive folder into your sheet: name, type,
size, last updated, owner and a link. Can include subfolders too.

How to use: put the folder's name or link in FOLDER, then
⚡ Automations → "List files". Run it again any time to refresh.

## Settings

Change these lines at the top of `Code.gs` to match your sheet:

```js
const FOLDER     = 'Invoices (PDF)';     // folder name, or paste the folder's link
const SHEET_NAME = 'Files';              // tab for the list (replaced each time)
const SUBFOLDERS = true;                 // true = also list files in subfolders
const NEWEST_FIRST = true;               // false = sort by name
```

## How to install

1. Open your Google Sheet and click **Extensions → Apps Script**.
2. Delete anything in the editor, then paste the whole contents of [`Code.gs`](Code.gs).
3. Edit the **SETTINGS** block for your sheet, then click **Save**.
4. Reload the spreadsheet. A **⚡ Automations** menu appears.
5. Run it from that menu. The first time, Google asks you to authorize the script: choose your account, click **Advanced → Go to (project) (unsafe)**, then **Allow**. This is normal for your own scripts.

## License

MIT. Free to use and modify. See [LICENSE](../LICENSE).
