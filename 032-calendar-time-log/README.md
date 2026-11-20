# Calendar Events to a Sheet for Time Tracking

Apps Script Recipe #32 from [The Software Manual](https://www.youtube.com/playlist?list=PLGHFsC1aF4YM).

▶ **Video walkthrough:** https://youtu.be/zxde-guIgwg

Lists the events of a calendar in your sheet, with the hours of each
one, and adds up the hours per client. Name events "Client: task",
for example "Bright Co: design review".

How to use: ⚡ Automations → "Export events". Turn on the daily export
to keep the sheet up to date. The tab is rebuilt each time.

## Settings

Change these lines at the top of `Code.gs` to match your sheet:

```js
const CALENDAR   = 'Client Work';   // calendar name, or '' for your main calendar
const DAYS_BACK  = 7;               // events from the last 7 days
const SHEET_NAME = 'Time Log';      // tab for the events (replaced each time)
const SEPARATOR  = ':';             // text before this is the client
const ALL_DAY    = false;           // true = also list all-day events
```

## How to install

1. Open your Google Sheet and click **Extensions → Apps Script**.
2. Delete anything in the editor, then paste the whole contents of [`Code.gs`](Code.gs).
3. Edit the **SETTINGS** block for your sheet, then click **Save**.
4. Reload the spreadsheet. A **⚡ Automations** menu appears.
5. Run it from that menu. The first time, Google asks you to authorize the script: choose your account, click **Advanced → Go to (project) (unsafe)**, then **Allow**. This is normal for your own scripts.

## License

MIT. Free to use and modify. See [LICENSE](../LICENSE).
