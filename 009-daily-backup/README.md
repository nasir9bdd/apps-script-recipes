# Daily Automatic Backup of Your Spreadsheet

Apps Script Recipe #9 from [The Software Manual](https://www.youtube.com/playlist?list=PLGHFsC1aF4YM).

▶ **Video walkthrough:** https://youtu.be/qbO-ARNOo0U

Saves a copy of this spreadsheet in a Google Drive folder every day,
keeps only the newest copies, and lists every backup in a log tab.

How to use: ⚡ Automations → "Back up now" to test it, then
"Turn on daily backups". It keeps running when your computer is off.

## Settings

Change these lines at the top of `Code.gs` to match your sheet:

```js
const FOLDER_NAME = 'Sheet Backups';               // Drive folder for the copies
const KEEP_COPIES = 7;                             // older copies go to the trash
const BACKUP_HOUR = 2;                             // 0-23, so 2 = around 2 AM
const FILE_NAME   = '{{name}} backup {{date}}';    // name of each copy
const LOG_SHEET   = 'Backup Log';                  // tab listing backups, '' = none
```

## How to install

1. Open your Google Sheet and click **Extensions → Apps Script**.
2. Delete anything in the editor, then paste the whole contents of [`Code.gs`](Code.gs).
3. Edit the **SETTINGS** block for your sheet, then click **Save**.
4. Reload the spreadsheet. A **⚡ Automations** menu appears.
5. Run it from that menu. The first time, Google asks you to authorize the script: choose your account, click **Advanced → Go to (project) (unsafe)**, then **Allow**. This is normal for your own scripts.

## License

MIT. Free to use and modify. See [LICENSE](../LICENSE).
