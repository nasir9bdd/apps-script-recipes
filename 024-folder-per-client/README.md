# Create a Drive Folder for Every Client or Project

Apps Script Recipe #24 from [The Software Manual](https://www.youtube.com/playlist?list=PLGHFsC1aF4YM).

▶ **Video walkthrough:** https://youtu.be/vca4o2LF0Xk

Makes one Google Drive folder per row, with the same subfolders inside
each one, and puts a link to the folder in your sheet.
Turn on auto-create, and every new row gets its folder by itself.

How to use: ⚡ Automations → "Create folders now".
Rows that already have a link are skipped. Existing folders are reused.

## Settings

Change these lines at the top of `Code.gs` to match your sheet:

```js
const SHEET_NAME    = 'Clients';                       // tab with one row per client
const FOLDER_NAME   = '{{Client}} - {{Project}}';      // name of each folder
const PARENT_FOLDER = 'Clients';                       // all folders go in here
const SUBFOLDERS    = ['Contracts', 'Invoices', 'Photos'];   // [] = none
const LINK_COLUMN   = 'Folder';                        // header where links go
```

## How to install

1. Open your Google Sheet and click **Extensions → Apps Script**.
2. Delete anything in the editor, then paste the whole contents of [`Code.gs`](Code.gs).
3. Edit the **SETTINGS** block for your sheet, then click **Save**.
4. Reload the spreadsheet. A **⚡ Automations** menu appears.
5. Run it from that menu. The first time, Google asks you to authorize the script: choose your account, click **Advanced → Go to (project) (unsafe)**, then **Allow**. This is normal for your own scripts.

## License

MIT. Free to use and modify. See [LICENSE](../LICENSE).
