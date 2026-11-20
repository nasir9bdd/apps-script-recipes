# Auto-Archive Old Rows

Apps Script Recipe #8 from [The Software Manual](https://www.youtube.com/playlist?list=PLGHFsC1aF4YM).

▶ **Video walkthrough:** https://youtu.be/Q6lPw-If2OA

Moves rows older than a number of days to an Archive tab, so your
main sheet stays short and fast. Can run by itself every night.

How to use: ⚡ Automations → "Archive old rows now", then
"Turn on nightly archiving" to make it automatic.

## Settings

Change these lines at the top of `Code.gs` to match your sheet:

```js
const SHEET_NAME    = 'Orders';        // tab to clean up
const ARCHIVE_SHEET = 'Archive';       // where old rows go (created if missing)
const DATE_COLUMN   = 'Order Date';    // header of the date to check
const OLDER_THAN    = 30;              // days
const ONLY_IF       = { 'Status': 'Delivered' };   // extra rule, or {} for none
const RUN_AT_HOUR   = 2;               // nightly run at this hour, 0 to 23
```

## How to install

1. Open your Google Sheet and click **Extensions → Apps Script**.
2. Delete anything in the editor, then paste the whole contents of [`Code.gs`](Code.gs).
3. Edit the **SETTINGS** block for your sheet, then click **Save**.
4. Reload the spreadsheet. A **⚡ Automations** menu appears.
5. Run it from that menu. The first time, Google asks you to authorize the script: choose your account, click **Advanced → Go to (project) (unsafe)**, then **Allow**. This is normal for your own scripts.

## License

MIT. Free to use and modify. See [LICENSE](../LICENSE).
