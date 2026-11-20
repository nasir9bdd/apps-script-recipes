# Google Calendar Events from a Sheet

Apps Script Recipe #31 from [The Software Manual](https://www.youtube.com/playlist?list=PLGHFsC1aF4YM).

▶ **Video walkthrough:** https://youtu.be/W76B_97l7eU

Adds every row as an event in Google Calendar. Change a row and sync
again: the same event is updated, never duplicated.

How to use: ⚡ Automations → "Sync events to Calendar".
Columns: Title, Date, Start, End, Location, Description, Event ID.
Leave Start empty for an all-day event.

## Settings

Change these lines at the top of `Code.gs` to match your sheet:

```js
const SHEET_NAME     = 'Events';      // tab with one event per row
const CALENDAR_NAME  = '';            // '' = your main calendar, or a calendar's name
const ID_COLUMN      = 'Event ID';    // the script keeps track of events here
const DEFAULT_LENGTH = 60;            // minutes, used when End is empty
```

## How to install

1. Open your Google Sheet and click **Extensions → Apps Script**.
2. Delete anything in the editor, then paste the whole contents of [`Code.gs`](Code.gs).
3. Edit the **SETTINGS** block for your sheet, then click **Save**.
4. Reload the spreadsheet. A **⚡ Automations** menu appears.
5. Run it from that menu. The first time, Google asks you to authorize the script: choose your account, click **Advanced → Go to (project) (unsafe)**, then **Allow**. This is normal for your own scripts.

## License

MIT. Free to use and modify. See [LICENSE](../LICENSE).
