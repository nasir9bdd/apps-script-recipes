# PDF Invoices from Google Sheets

Apps Script Recipe #21 from [The Software Manual](https://www.youtube.com/playlist?list=PLGHFsC1aF4YM).

▶ **Video walkthrough:** https://youtu.be/FI-qG26DlMs

Creates one PDF per row from a Google Docs template, saves it in a Drive
folder and puts a link to it in your sheet. It can also email each PDF.

How to use: write {{Header Name}} placeholders in a Google Doc, paste its
link in TEMPLATE_URL, then ⚡ Automations → "Create PDF invoices".
Rows that already have a link in the PDF column are skipped.

## Settings

Change these lines at the top of `Code.gs` to match your sheet:

```js
const SHEET_NAME   = 'Invoices';                   // tab with one invoice per row
const TEMPLATE_URL =                               // link to your Docs template
  'PASTE_YOUR_GOOGLE_DOC_LINK_HERE';
const FOLDER_NAME  = 'Invoices (PDF)';             // Drive folder for the PDFs
const FILE_NAME    = 'Invoice {{Invoice}} - {{Client}}';  // name of each PDF
const PDF_COLUMN   = 'PDF';                        // header where links go
const SEND_EMAIL   = false;                        // true = also email each PDF
const EMAIL_COLUMN = 'Email';                      // header with the client's email
const SUBJECT      = 'Invoice {{Invoice}} from Bright Studio';
const MESSAGE      = 'Hi {{Client}},\n\nYour invoice is attached.\n\nThank you!';
```

## How to install

1. Open your Google Sheet and click **Extensions → Apps Script**.
2. Delete anything in the editor, then paste the whole contents of [`Code.gs`](Code.gs).
3. Edit the **SETTINGS** block for your sheet, then click **Save**.
4. Reload the spreadsheet. A **⚡ Automations** menu appears.
5. Run it from that menu. The first time, Google asks you to authorize the script: choose your account, click **Advanced → Go to (project) (unsafe)**, then **Allow**. This is normal for your own scripts.

## License

MIT. Free to use and modify. See [LICENSE](../LICENSE).
