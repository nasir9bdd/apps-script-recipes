# Combine Many Tabs or Files into One Master Sheet

Apps Script Recipe #29 from [The Software Manual](https://www.youtube.com/playlist?list=PLGHFsC1aF4YM).

▶ **Video walkthrough:** https://youtu.be/e8sL11N6tI4

Copies the rows of every tab (or of every spreadsheet in a Drive folder)
into one master tab. Columns are matched by header, even if the order
is different, and a "Source" column says where each row came from.

How to use: ⚡ Automations → "Combine now". Run it again any time,
or turn on the hourly update. The master tab is rebuilt each time.

## Settings

Change these lines at the top of `Code.gs` to match your sheet:

```js
const MASTER_SHEET = 'All Sales';   // the combined tab (replaced each time)
const FOLDER       = '';            // '' = tabs in this file, or a folder name/link
const SKIP_TABS    = ['Settings'];  // tabs to leave out
const ADD_SOURCE   = true;          // true = add a "Source" column
```

## How to install

1. Open your Google Sheet and click **Extensions → Apps Script**.
2. Delete anything in the editor, then paste the whole contents of [`Code.gs`](Code.gs).
3. Edit the **SETTINGS** block for your sheet, then click **Save**.
4. Reload the spreadsheet. A **⚡ Automations** menu appears.
5. Run it from that menu. The first time, Google asks you to authorize the script: choose your account, click **Advanced → Go to (project) (unsafe)**, then **Allow**. This is normal for your own scripts.

## License

MIT. Free to use and modify. See [LICENSE](../LICENSE).
