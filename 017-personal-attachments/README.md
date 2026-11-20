# Send Emails with Personal Attachments from Drive

Apps Script Recipe #17 from [The Software Manual](https://www.youtube.com/playlist?list=PLGHFsC1aF4YM).

▶ **Video walkthrough:** https://youtu.be/RcJapDcVcqc

Emails every row its own file from Google Drive: an invoice, a report,
a certificate. Write the file's name (or its Drive link) in the sheet.

How to use: ⚡ Automations → "Send emails with files".
Rows that already have a status are skipped.
Free Gmail accounts can send about 100 emails a day.

## Settings

Change these lines at the top of `Code.gs` to match your sheet:

```js
const SHEET_NAME    = 'Clients';                    // tab with one email per row
const EMAIL_COLUMN  = 'Email';                      // header of the email column
const FILE_COLUMN   = 'File';                       // file name or Drive link
const FOLDER_NAME   = 'Invoices (PDF)';             // where to look for file names
const STATUS_COLUMN = 'Status';                     // the script writes "Sent" here
const SUBJECT       = 'Your invoice {{Invoice}}';
const MESSAGE       = 'Hi {{Name}},\n\nYour invoice {{Invoice}} is attached.'
                    + '\n\nThank you!\nBright Studio';
```

## How to install

1. Open your Google Sheet and click **Extensions → Apps Script**.
2. Delete anything in the editor, then paste the whole contents of [`Code.gs`](Code.gs).
3. Edit the **SETTINGS** block for your sheet, then click **Save**.
4. Reload the spreadsheet. A **⚡ Automations** menu appears.
5. Run it from that menu. The first time, Google asks you to authorize the script: choose your account, click **Advanced → Go to (project) (unsafe)**, then **Allow**. This is normal for your own scripts.

## License

MIT. Free to use and modify. See [LICENSE](../LICENSE).
