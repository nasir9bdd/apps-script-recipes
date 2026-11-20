# Dependent Dropdowns on Every Row

Apps Script Recipe #5 from [The Software Manual](https://www.youtube.com/playlist?list=PLGHFsC1aF4YM).

▶ **Video walkthrough:** https://youtu.be/IqbAhxGyQWw

Pick a Category, and the Item dropdown in the same row shows only the
items of that category. Works on every row, even new ones.

How to use: on a "Lists" tab, put each category in row 1 and its items
below it. Then ⚡ Automations → "Set up dropdowns" once.

## Settings

Change these lines at the top of `Code.gs` to match your sheet:

```js
const SHEET_NAME       = 'Requests';   // tab with the dropdowns
const MAIN_COLUMN      = 'Category';   // first dropdown
const DEPENDENT_COLUMN = 'Item';       // second dropdown, depends on the first
const LISTS_SHEET      = 'Lists';      // categories in row 1, items below
```

## How to install

1. Open your Google Sheet and click **Extensions → Apps Script**.
2. Delete anything in the editor, then paste the whole contents of [`Code.gs`](Code.gs).
3. Edit the **SETTINGS** block for your sheet, then click **Save**.
4. Reload the spreadsheet. A **⚡ Automations** menu appears.
5. Run it from that menu. The first time, Google asks you to authorize the script: choose your account, click **Advanced → Go to (project) (unsafe)**, then **Allow**. This is normal for your own scripts.

## License

MIT. Free to use and modify. See [LICENSE](../LICENSE).
