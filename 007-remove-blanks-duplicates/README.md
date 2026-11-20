# Remove Blank Rows and Duplicates in One Click

Apps Script Recipe #7 from [The Software Manual](https://www.youtube.com/playlist?list=PLGHFsC1aF4YM).

▶ **Video walkthrough:** https://youtu.be/0zND8feubFw

Deletes empty rows and repeated rows, and tells you how many it removed.
Choose which columns decide what counts as a duplicate.

How to use: ⚡ Automations → "Clean up sheet".
Tip: File → Version history lets you undo a cleanup.

## Settings

Change these lines at the top of `Code.gs` to match your sheet:

```js
const SHEET_NAME   = 'Contacts';       // tab to clean
const MATCH_ON     = ['Email'];        // duplicate = same value here; [] = whole row
const IGNORE_CASE  = true;             // true = "ANA@x.com" equals "ana@x.com"
const KEEP         = 'first';          // 'first' or 'last' copy of a duplicate
const HEADER_ROWS  = 1;                // rows at the top that are never removed
```

## How to install

1. Open your Google Sheet and click **Extensions → Apps Script**.
2. Delete anything in the editor, then paste the whole contents of [`Code.gs`](Code.gs).
3. Edit the **SETTINGS** block for your sheet, then click **Save**.
4. Reload the spreadsheet. A **⚡ Automations** menu appears.
5. Run it from that menu. The first time, Google asks you to authorize the script: choose your account, click **Advanced → Go to (project) (unsafe)**, then **Allow**. This is normal for your own scripts.

## License

MIT. Free to use and modify. See [LICENSE](../LICENSE).
