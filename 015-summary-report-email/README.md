# Daily or Weekly Summary Report by Email

Apps Script Recipe #15 from [The Software Manual](https://www.youtube.com/playlist?list=PLGHFsC1aF4YM).

▶ **Video walkthrough:** https://youtu.be/PNdldjeA_A0

Emails you the key numbers from your sheet on a schedule: the total,
the number of rows, the average, and a table with a total per group.

How to use: ⚡ Automations → "Send report now" to test it, then
"Turn on scheduled report".

## Settings

Change these lines at the top of `Code.gs` to match your sheet:

```js
const SHEET_NAME    = 'Sales';               // tab with your data
const DATE_COLUMN   = 'Date';                // only rows from the last DAYS days
const AMOUNT_COLUMN = 'Amount';              // the number to add up
const GROUP_COLUMN  = 'Product';             // one table row per value here
const DAYS          = 7;                     // 7 = last week, 1 = yesterday
const CURRENCY      = '$';
const SEND_TO       = 'me';                  // 'me' = your own email
const SUBJECT       = 'Weekly sales report';
const SEND_DAY      = 'MONDAY';              // a weekday, or 'EVERY DAY'
const SEND_HOUR     = 8;                     // 0-23, so 8 = 8 AM
```

## How to install

1. Open your Google Sheet and click **Extensions → Apps Script**.
2. Delete anything in the editor, then paste the whole contents of [`Code.gs`](Code.gs).
3. Edit the **SETTINGS** block for your sheet, then click **Save**.
4. Reload the spreadsheet. A **⚡ Automations** menu appears.
5. Run it from that menu. The first time, Google asks you to authorize the script: choose your account, click **Advanced → Go to (project) (unsafe)**, then **Allow**. This is normal for your own scripts.

## License

MIT. Free to use and modify. See [LICENSE](../LICENSE).
