# Log Emails from a Gmail Label into Google Sheets

Apps Script Recipe #36 from [The Software Manual](https://www.youtube.com/playlist?list=PLGHFsC1aF4YM).

▶ **Video walkthrough:** https://youtu.be/C5ZJ_vJY4Gs

Adds one row per email with a Gmail label: date, sender, subject, the
first words of the message and a link back to it. Emails that are
already in the sheet are skipped, so you can run it again any time.

How to use: ⚡ Automations → "Log emails now", or turn on the hourly log.

## Settings

Change these lines at the top of `Code.gs` to match your sheet:

```js
const LABEL       = 'Clients';      // the Gmail label to log
const SHEET_NAME  = 'Email Log';    // tab for the emails (created if missing)
const MAX_THREADS = 100;            // newest conversations checked each time
const SNIPPET     = 80;             // characters of the message to keep
```

## How to install

1. Open your Google Sheet and click **Extensions → Apps Script**.
2. Delete anything in the editor, then paste the whole contents of [`Code.gs`](Code.gs).
3. Edit the **SETTINGS** block for your sheet, then click **Save**.
4. Reload the spreadsheet. A **⚡ Automations** menu appears.
5. Run it from that menu. The first time, Google asks you to authorize the script: choose your account, click **Advanced → Go to (project) (unsafe)**, then **Allow**. This is normal for your own scripts.

## License

MIT. Free to use and modify. See [LICENSE](../LICENSE).
