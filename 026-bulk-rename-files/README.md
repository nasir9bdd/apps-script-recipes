# Bulk Rename Files in Google Drive

Apps Script Recipe #26 from [The Software Manual](https://www.youtube.com/playlist?list=PLGHFsC1aF4YM).

▶ **Video walkthrough:** https://youtu.be/RHdhr_GqKDk

Lists every file in a Drive folder in your sheet. Type the new names
next to the old ones, and rename them all with one click.

How to use: ⚡ Automations → "1. List files", fill in "New Name",
then ⚡ Automations → "2. Rename files". Empty "New Name" = no change.

## Settings

Change these lines at the top of `Code.gs` to match your sheet:

```js
const FOLDER     = 'Photo Shoot';   // folder name, or paste the folder's link
const SHEET_NAME = 'Rename';        // tab for the list
const KEEP_EXTENSION = true;        // true = ".jpg" is kept if you leave it out
```

## How to install

1. Open your Google Sheet and click **Extensions → Apps Script**.
2. Delete anything in the editor, then paste the whole contents of [`Code.gs`](Code.gs).
3. Edit the **SETTINGS** block for your sheet, then click **Save**.
4. Reload the spreadsheet. A **⚡ Automations** menu appears.
5. Run it from that menu. The first time, Google asks you to authorize the script: choose your account, click **Advanced → Go to (project) (unsafe)**, then **Allow**. This is normal for your own scripts.

## License

MIT. Free to use and modify. See [LICENSE](../LICENSE).
