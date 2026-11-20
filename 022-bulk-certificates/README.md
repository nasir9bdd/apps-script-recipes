# Bulk Certificates from Google Sheets

Apps Script Recipe #22 from [The Software Manual](https://www.youtube.com/playlist?list=PLGHFsC1aF4YM).

▶ **Video walkthrough:** https://youtu.be/qMh29gWe78Q

Makes one certificate per row from a Google Slides template, saves it
as a PDF in Drive and emails it to that person.

How to use: write {{Header Name}} placeholders on a Google Slides slide,
paste its link in TEMPLATE_URL, then ⚡ Automations → "Create certificates".
Rows that already have something in the Status column are skipped.

## Settings

Change these lines at the top of `Code.gs` to match your sheet:

```js
const SHEET_NAME    = 'Certificates';               // tab with one person per row
const TEMPLATE_URL  =                               // link to your Slides template
  'PASTE_YOUR_GOOGLE_SLIDES_LINK_HERE';
const FOLDER_NAME   = 'Certificates (PDF)';         // Drive folder for the PDFs
const FILE_NAME     = 'Certificate - {{Name}}';     // name of each PDF
const STATUS_COLUMN = 'Status';                     // header where "Sent" is written
const SEND_EMAIL    = true;                         // false = only make the PDFs
const EMAIL_COLUMN  = 'Email';                      // header with email addresses
const SUBJECT       = 'Your certificate, {{Name}}!';
const MESSAGE       = 'Hi {{Name}},\n\nCongratulations on completing {{Course}}!'
                    + '\nYour certificate is attached.\n\nBest wishes';
```

## How to install

1. Open your Google Sheet and click **Extensions → Apps Script**.
2. Delete anything in the editor, then paste the whole contents of [`Code.gs`](Code.gs).
3. Edit the **SETTINGS** block for your sheet, then click **Save**.
4. Reload the spreadsheet. A **⚡ Automations** menu appears.
5. Run it from that menu. The first time, Google asks you to authorize the script: choose your account, click **Advanced → Go to (project) (unsafe)**, then **Allow**. This is normal for your own scripts.

## License

MIT. Free to use and modify. See [LICENSE](../LICENSE).
