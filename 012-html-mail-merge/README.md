# Mail Merge with Beautiful HTML Emails

Apps Script Recipe #12 from [The Software Manual](https://www.youtube.com/playlist?list=PLGHFsC1aF4YM).

▶ **Video walkthrough:** https://youtu.be/tmtd0MuCeAU

Design your email as a normal Gmail draft (bold text, colors, links,
buttons, attachments), then send one personal copy to every row.
Write {{Column Name}} anywhere in the draft to insert that row's value.

How to use: create the Gmail draft, put its subject in DRAFT_SUBJECT,
then ⚡ Automations → "Send emails". Rows with a status are skipped.
Free Gmail accounts can send about 100 emails a day.

## Settings

Change these lines at the top of `Code.gs` to match your sheet:

```js
const SHEET_NAME    = 'Contacts';                   // tab with one person per row
const DRAFT_SUBJECT = 'News for {{First Name}}';    // subject of your Gmail draft
const EMAIL_COLUMN  = 'Email';                      // header of the email column
const STATUS_COLUMN = 'Status';                     // the script writes "Sent" here
const SENDER_NAME   = 'Bright Studio';              // name people see as the sender
```

## How to install

1. Open your Google Sheet and click **Extensions → Apps Script**.
2. Delete anything in the editor, then paste the whole contents of [`Code.gs`](Code.gs).
3. Edit the **SETTINGS** block for your sheet, then click **Save**.
4. Reload the spreadsheet. A **⚡ Automations** menu appears.
5. Run it from that menu. The first time, Google asks you to authorize the script: choose your account, click **Advanced → Go to (project) (unsafe)**, then **Allow**. This is normal for your own scripts.

## License

MIT. Free to use and modify. See [LICENSE](../LICENSE).
