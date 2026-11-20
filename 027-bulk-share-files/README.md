# Bulk Share or Unshare Drive Files from a Sheet

Apps Script Recipe #27 from [The Software Manual](https://www.youtube.com/playlist?list=PLGHFsC1aF4YM).

▶ **Video walkthrough:** https://youtu.be/z_u0J424adA

Shows who can open every file in a Drive folder (a sharing audit), and
changes the link sharing of many files at once, from a dropdown.

How to use: ⚡ Automations → "1. Check sharing", pick a value in
"Change To", then ⚡ Automations → "2. Apply changes".

## Settings

Change these lines at the top of `Code.gs` to match your sheet:

```js
const FOLDER     = 'Photo Shoot';   // folder name, or paste the folder's link
const SHEET_NAME = 'Sharing';       // tab for the audit
const SUBFOLDERS = false;           // true = also check files in subfolders
```

## How to install

1. Open your Google Sheet and click **Extensions → Apps Script**.
2. Delete anything in the editor, then paste the whole contents of [`Code.gs`](Code.gs).
3. Edit the **SETTINGS** block for your sheet, then click **Save**.
4. Reload the spreadsheet. A **⚡ Automations** menu appears.
5. Run it from that menu. The first time, Google asks you to authorize the script: choose your account, click **Advanced → Go to (project) (unsafe)**, then **Allow**. This is normal for your own scripts.

## License

MIT. Free to use and modify. See [LICENSE](../LICENSE).
