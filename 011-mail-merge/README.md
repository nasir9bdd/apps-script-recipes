# Mail Merge from Google Sheets

Apps Script Recipe #11 from [The Software Manual](https://www.youtube.com/playlist?list=PLGHFsC1aF4YM).

▶ **Video walkthrough:** https://youtu.be/kZfhZkFWheA

Sends one personalised email per row of your sheet.
Write {{Header Name}} in the subject or message and it is replaced
with that row's value, exactly as it looks in the sheet.

How to use: ⚡ Automations menu → "Send a test email to me", then "Send emails".
Rows that already have something in the Status column are skipped,
so you can run it again safely after adding new rows.

## Settings

Change these lines at the top of `Code.gs` to match your sheet:

```js
const SHEET_NAME    = 'Mail Merge';   // name of the tab with your list
const EMAIL_COLUMN  = 'Email';        // header of the column with email addresses
const STATUS_COLUMN = 'Status';       // header of the column where "Sent" is written
const SENDER_NAME   = 'Sheets Automations';  // name people see as the sender
const SUBJECT       = 'Hi {{Name}}, your invoice is ready';
const MESSAGE = `Hi {{Name}},

Your invoice for {{Amount}} is ready and is due on {{Due Date}}.

Thank you for working with us!
Best regards`;
```

## How to install

1. Open your Google Sheet and click **Extensions → Apps Script**.
2. Delete anything in the editor, then paste the whole contents of [`Code.gs`](Code.gs).
3. Edit the **SETTINGS** block for your sheet, then click **Save**.
4. Reload the spreadsheet. A **⚡ Automations** menu appears.
5. Run it from that menu. The first time, Google asks you to authorize the script: choose your account, click **Advanced → Go to (project) (unsafe)**, then **Allow**. This is normal for your own scripts.

## License

MIT. Free to use and modify. See [LICENSE](../LICENSE).
