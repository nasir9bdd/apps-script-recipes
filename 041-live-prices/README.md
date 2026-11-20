# Live Currency and Crypto Prices in Google Sheets

Apps Script Recipe #41 from [The Software Manual](https://www.youtube.com/playlist?list=PLGHFsC1aF4YM).

▶ **Video walkthrough:** https://youtu.be/eOyWaN9CfCM

Type currency or crypto codes (EUR, GBP, BTC, ETH...) in column A: the
script fills in the price, the change since the last update and the
time. Every update is also saved in a history tab, so you can chart it.
Prices come from a free public API (Coinbase), no key or sign-up needed.

How to use: ⚡ Automations → "Update prices now", or turn on hourly updates.

## Settings

Change these lines at the top of `Code.gs` to match your sheet:

```js
const SHEET_NAME    = 'Prices';          // column A = codes, row 1 = headers
const BASE          = 'USD';             // prices are shown in this currency
const HISTORY_SHEET = 'Price History';   // '' = don't keep a history
const EVERY_HOURS   = 1;                 // 1, 2, 4, 6, 8 or 12
```

## How to install

1. Open your Google Sheet and click **Extensions → Apps Script**.
2. Delete anything in the editor, then paste the whole contents of [`Code.gs`](Code.gs).
3. Edit the **SETTINGS** block for your sheet, then click **Save**.
4. Reload the spreadsheet. A **⚡ Automations** menu appears.
5. Run it from that menu. The first time, Google asks you to authorize the script: choose your account, click **Advanced → Go to (project) (unsafe)**, then **Allow**. This is normal for your own scripts.

## License

MIT. Free to use and modify. See [LICENSE](../LICENSE).
