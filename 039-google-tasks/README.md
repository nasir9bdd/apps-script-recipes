# Send Sheet Rows to Google Tasks

Apps Script Recipe #39 from [The Software Manual](https://www.youtube.com/playlist?list=PLGHFsC1aF4YM).

▶ **Video walkthrough:** https://youtu.be/15psGttWUak

Every row of your to-do list becomes a Google Task, with its due date
and notes, so it shows up in Gmail, Calendar and the Tasks app on your
phone. Tick a task as done, and the sheet shows it too.

Needs the Google Tasks service: in the editor, click + next to Services,
pick "Google Tasks API" and click Add.

## Settings

Change these lines at the top of `Code.gs` to match your sheet:

```js
const SHEET_NAME   = 'To-Do';           // tab with your tasks
const LIST_NAME    = 'From my sheet';   // task list (created if missing)
const TITLE_COLUMN = 'Task';            // header of the task column
const DUE_COLUMN   = 'Due';             // header of the due date column
const NOTES_COLUMN = 'Notes';           // header of the notes column ('' = none)
```

## How to install

1. Open your Google Sheet and click **Extensions → Apps Script**.
2. Delete anything in the editor, then paste the whole contents of [`Code.gs`](Code.gs).
3. Edit the **SETTINGS** block for your sheet, then click **Save**.
4. Reload the spreadsheet. A **⚡ Automations** menu appears.
5. Run it from that menu. The first time, Google asks you to authorize the script: choose your account, click **Advanced → Go to (project) (unsafe)**, then **Allow**. This is normal for your own scripts.

## License

MIT. Free to use and modify. See [LICENSE](../LICENSE).
