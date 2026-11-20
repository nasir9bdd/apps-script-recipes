# Track YouTube Channel Stats in Google Sheets

Apps Script Recipe #42 from [The Software Manual](https://www.youtube.com/playlist?list=PLGHFsC1aF4YM).

▶ **Video walkthrough:** https://youtu.be/Z_2PfL-dy44

Put YouTube channels in column A (their @handle or channel ID): the
script fills in the name, subscribers, total views and number of videos.
Every update is also saved in a history tab, so you can watch them grow.

Needs the YouTube service: in the editor, click + next to Services,
pick "YouTube Data API v3" and click Add.

How to use: ⚡ Automations → "Update stats now", or turn on daily updates.

## Settings

Change these lines at the top of `Code.gs` to match your sheet:

```js
const SHEET_NAME    = 'Channels';        // column A = @handle or channel ID
const HISTORY_SHEET = 'Stats History';   // '' = don't keep a history
const UPDATE_HOUR   = 7;                 // daily update around this hour
```

## How to install

1. Open your Google Sheet and click **Extensions → Apps Script**.
2. Delete anything in the editor, then paste the whole contents of [`Code.gs`](Code.gs).
3. Edit the **SETTINGS** block for your sheet, then click **Save**.
4. Reload the spreadsheet. A **⚡ Automations** menu appears.
5. Run it from that menu. The first time, Google asks you to authorize the script: choose your account, click **Advanced → Go to (project) (unsafe)**, then **Allow**. This is normal for your own scripts.

## License

MIT. Free to use and modify. See [LICENSE](../LICENSE).
