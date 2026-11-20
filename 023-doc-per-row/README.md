# One Google Doc per Row: Contracts, Offer Letters

Apps Script Recipe #23 from [The Software Manual](https://www.youtube.com/playlist?list=PLGHFsC1aF4YM).

▶ **Video walkthrough:** https://youtu.be/XlOh_3K54G0

Copies a Google Docs template for every row, fills in the row's values,
saves it in a Drive folder and puts a link to it in your sheet.
Write {{Column Name}} in the template. {{Today}} becomes today's date.

How to use: paste your template's link in TEMPLATE_URL, then
⚡ Automations → "Create documents". Rows with a link are skipped.

## Settings

Change these lines at the top of `Code.gs` to match your sheet:

```js
const SHEET_NAME   = 'Offers';                       // tab with one row per document
const TEMPLATE_URL =                                 // link to your Docs template
  'PASTE_YOUR_GOOGLE_DOC_LINK_HERE';
const FOLDER_NAME  = 'Offer Letters';                // Drive folder for the documents
const FILE_NAME    = 'Offer Letter - {{Name}}';      // name of each document
const DOC_COLUMN   = 'Document';                     // header where links go
const SHARE_COLUMN = '';                             // email column to share with
```

## How to install

1. Open your Google Sheet and click **Extensions → Apps Script**.
2. Delete anything in the editor, then paste the whole contents of [`Code.gs`](Code.gs).
3. Edit the **SETTINGS** block for your sheet, then click **Save**.
4. Reload the spreadsheet. A **⚡ Automations** menu appears.
5. Run it from that menu. The first time, Google asks you to authorize the script: choose your account, click **Advanced → Go to (project) (unsafe)**, then **Allow**. This is normal for your own scripts.

## License

MIT. Free to use and modify. See [LICENSE](../LICENSE).
