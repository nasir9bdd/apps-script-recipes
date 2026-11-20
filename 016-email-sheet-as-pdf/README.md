# Email a Sheet as a PDF on a Schedule

Apps Script Recipe #16 from [The Software Manual](https://www.youtube.com/playlist?list=PLGHFsC1aF4YM).

▶ **Video walkthrough:** https://youtu.be/2K64k6gb_oQ

Turns one tab into a PDF and emails it, right now or automatically
every day or every week. For example, a report every Monday at 9.

How to use: ⚡ Automations → "Send PDF now" to test it, then
"Turn on schedule". "Turn off schedule" stops it again.

## Settings

Change these lines at the top of `Code.gs` to match your sheet:

```js
const SHEET_NAME = 'Report';                     // tab to turn into a PDF
const SEND_TO    = 'boss@example.com';           // emails, separated by commas
const SUBJECT    = 'Weekly report - {{date}}';   // {{date}} = today's date
const MESSAGE    = 'Hi,\n\nThe latest report is attached.\n\nHave a great week!';
const REPEAT     = 'weekly';                     // 'daily' or 'weekly'
const DAY        = 'MONDAY';                     // for weekly: MONDAY to SUNDAY
const HOUR       = 9;                            // hour of the day, 0 to 23
const LANDSCAPE  = true;                         // false = portrait pages
```

## How to install

1. Open your Google Sheet and click **Extensions → Apps Script**.
2. Delete anything in the editor, then paste the whole contents of [`Code.gs`](Code.gs).
3. Edit the **SETTINGS** block for your sheet, then click **Save**.
4. Reload the spreadsheet. A **⚡ Automations** menu appears.
5. Run it from that menu. The first time, Google asks you to authorize the script: choose your account, click **Advanced → Go to (project) (unsafe)**, then **Allow**. This is normal for your own scripts.

## License

MIT. Free to use and modify. See [LICENSE](../LICENSE).
