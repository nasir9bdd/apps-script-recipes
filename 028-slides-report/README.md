# Create a Google Slides Report from Sheet Data

Apps Script Recipe #28 from [The Software Manual](https://www.youtube.com/playlist?list=PLGHFsC1aF4YM).

▶ **Video walkthrough:** https://youtu.be/CVgmDrt3Ltg

Builds a new presentation: a title slide, then one slide per row with
the row's details. Every report is listed in a log tab with its link.

How to use: ⚡ Automations → "Create slides report".
Rows with an empty title column are skipped.

## Settings

Change these lines at the top of `Code.gs` to match your sheet:

```js
const SHEET_NAME   = 'Projects';                   // tab with your data
const DECK_NAME    = 'Project Report {{date}}';    // name of each presentation
const DECK_TITLE   = 'Project Update';             // big text on the first slide
const TITLE_COLUMN = 'Project';                    // slide title for each row
const SKIP_COLUMNS = [];                           // headers to leave out
const LOG_SHEET    = 'Reports';                    // tab listing every report
```

## How to install

1. Open your Google Sheet and click **Extensions → Apps Script**.
2. Delete anything in the editor, then paste the whole contents of [`Code.gs`](Code.gs).
3. Edit the **SETTINGS** block for your sheet, then click **Save**.
4. Reload the spreadsheet. A **⚡ Automations** menu appears.
5. Run it from that menu. The first time, Google asks you to authorize the script: choose your account, click **Advanced → Go to (project) (unsafe)**, then **Allow**. This is normal for your own scripts.

## License

MIT. Free to use and modify. See [LICENSE](../LICENSE).
