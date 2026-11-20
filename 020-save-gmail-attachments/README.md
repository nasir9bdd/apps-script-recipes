# Save Gmail Attachments to Drive and Log Them

Apps Script Recipe #20 from [The Software Manual](https://www.youtube.com/playlist?list=PLGHFsC1aF4YM).

▶ **Video walkthrough:** https://youtu.be/IFU8etxFxxA

Finds emails with attachments (any Gmail search), saves the files in a
Drive folder with one subfolder per month, and lists them in your sheet.
Saved emails get a label, so each file is saved only once.

How to use: ⚡ Automations → "Save attachments now" to test it, then
"Turn on hourly check".

## Settings

Change these lines at the top of `Code.gs` to match your sheet:

```js
const SEARCH      = 'has:attachment subject:receipt';   // any Gmail search
const FOLDER_NAME = 'Gmail Attachments';                // Drive folder for the files
const BY_MONTH    = true;                               // subfolders like 2026-11
const SHEET_NAME  = 'Attachments';                      // tab for the list
const DONE_LABEL  = 'Saved to Drive';                   // label for saved emails
```

## How to install

1. Open your Google Sheet and click **Extensions → Apps Script**.
2. Delete anything in the editor, then paste the whole contents of [`Code.gs`](Code.gs).
3. Edit the **SETTINGS** block for your sheet, then click **Save**.
4. Reload the spreadsheet. A **⚡ Automations** menu appears.
5. Run it from that menu. The first time, Google asks you to authorize the script: choose your account, click **Advanced → Go to (project) (unsafe)**, then **Allow**. This is normal for your own scripts.

## License

MIT. Free to use and modify. See [LICENSE](../LICENSE).
