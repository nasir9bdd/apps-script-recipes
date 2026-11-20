# Automatic Due-Date Reminder Emails

Apps Script Recipe #13 from [The Software Manual](https://www.youtube.com/playlist?list=PLGHFsC1aF4YM).

▶ **Video walkthrough:** https://youtu.be/mqI6PuH3RUE

Emails each person a reminder a few days before their task is due,
and again if it becomes overdue. Runs every morning by itself.

How to use: ⚡ Automations → "Send reminders now" to test it, then
"Turn on daily reminders". Rows marked Done are skipped.

## Settings

Change these lines at the top of `Code.gs` to match your sheet:

```js
const SHEET_NAME      = 'Tasks';           // tab with your tasks
const DUE_COLUMN      = 'Due Date';        // header of the due date column
const EMAIL_COLUMN    = 'Email';           // header with the person's email
const STATUS_COLUMN   = 'Status';          // rows with DONE_VALUE are skipped
const DONE_VALUE      = 'Done';
const REMINDER_COLUMN = 'Reminder';        // the script writes what it sent here
const DAYS_BEFORE     = 2;                 // remind this many days before
const SEND_HOUR       = 8;                 // daily check at this hour, 0 to 23
const SUBJECT = 'Reminder: "{{Task}}" {{due}}';  // {{due}} = "is due tomorrow"...
const MESSAGE = 'Hi {{Owner}},\n\nJust a reminder: "{{Task}}" {{due}} ({{Due Date}}).'
              + '\n\nThanks!';
```

## How to install

1. Open your Google Sheet and click **Extensions → Apps Script**.
2. Delete anything in the editor, then paste the whole contents of [`Code.gs`](Code.gs).
3. Edit the **SETTINGS** block for your sheet, then click **Save**.
4. Reload the spreadsheet. A **⚡ Automations** menu appears.
5. Run it from that menu. The first time, Google asks you to authorize the script: choose your account, click **Advanced → Go to (project) (unsafe)**, then **Allow**. This is normal for your own scripts.

## License

MIT. Free to use and modify. See [LICENSE](../LICENSE).
