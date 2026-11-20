# Website Uptime Monitor with Email Alerts

Apps Script Recipe #48 from [The Software Manual](https://www.youtube.com/playlist?list=PLGHFsC1aF4YM).

▶ **Video walkthrough:** https://youtu.be/TzpRyfcUBIU

Put web addresses in column A: the script checks each one, writes Up,
Slow or Down with the response time, and emails you when a site goes
down and when it's back up. Only on a change, so no flood of emails.

How to use: ⚡ Automations → "Check sites now", then turn on checks
every 15 minutes.

## Settings

Change these lines at the top of `Code.gs` to match your sheet:

```js
const SHEET_NAME    = 'Sites';             // column A = web addresses
const LOG_SHEET     = 'Uptime Log';        // '' = don't keep a log
const ALERT_EMAIL   = 'you@example.com';   // who gets the alerts
const SLOW_MS       = 3000;                // slower than this = Slow
const EVERY_MINUTES = 15;                  // 5, 10, 15 or 30
```

## How to install

1. Open your Google Sheet and click **Extensions → Apps Script**.
2. Delete anything in the editor, then paste the whole contents of [`Code.gs`](Code.gs).
3. Edit the **SETTINGS** block for your sheet, then click **Save**.
4. Reload the spreadsheet. A **⚡ Automations** menu appears.
5. Run it from that menu. The first time, Google asks you to authorize the script: choose your account, click **Advanced → Go to (project) (unsafe)**, then **Allow**. This is normal for your own scripts.

## License

MIT. Free to use and modify. See [LICENSE](../LICENSE).
