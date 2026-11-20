# Lock Rows After They're Marked Complete

Apps Script Recipe #10 from [The Software Manual](https://www.youtube.com/playlist?list=PLGHFsC1aF4YM).

▶ **Video walkthrough:** https://youtu.be/8eweBu6tw48

When a row's status becomes "Done", the whole row is protected, so
nobody can change it by accident. Change the status back to unlock it.
Only you (the owner) can still edit locked rows.

How to use: ⚡ Automations → "Turn on row locking".

## Settings

Change these lines at the top of `Code.gs` to match your sheet:

```js
const SHEET_NAME    = 'Tasks';          // tab to protect
const STATUS_COLUMN = 'Status';         // header of the status column
const LOCK_WHEN     = 'Done';           // lock a row when its status is this
const WARNING_ONLY  = false;            // true = only show a warning
```

## How to install

1. Open your Google Sheet and click **Extensions → Apps Script**.
2. Delete anything in the editor, then paste the whole contents of [`Code.gs`](Code.gs).
3. Edit the **SETTINGS** block for your sheet, then click **Save**.
4. Reload the spreadsheet. A **⚡ Automations** menu appears.
5. Run it from that menu. The first time, Google asks you to authorize the script: choose your account, click **Advanced → Go to (project) (unsafe)**, then **Allow**. This is normal for your own scripts.

## License

MIT. Free to use and modify. See [LICENSE](../LICENSE).
