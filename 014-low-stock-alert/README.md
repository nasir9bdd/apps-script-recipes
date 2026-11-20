# Email Alert When a Number Crosses a Limit

Apps Script Recipe #14 from [The Software Manual](https://www.youtube.com/playlist?list=PLGHFsC1aF4YM).

▶ **Video walkthrough:** https://youtu.be/zS7KyMzzn-M

Sends you an email as soon as a value drops below its limit, e.g. low
stock, a budget running out or a score below target. One email per
drop: it alerts again only after the value has gone back up.

How to use: ⚡ Automations → "Turn on alerts". Then just edit your sheet.

## Settings

Change these lines at the top of `Code.gs` to match your sheet:

```js
const SHEET_NAME   = 'Inventory';    // tab to watch
const VALUE_COLUMN = 'Stock';        // the number to watch
const LIMIT_COLUMN = 'Min Stock';    // alert when the value is below this
const ALERT_COLUMN = 'Alert';        // the script notes sent alerts here
const SEND_TO      = 'me';           // 'me' = your own email, or any addresses
const SUBJECT      = 'Low stock: {{Item}} ({{Stock}} left)';
const MESSAGE      = '{{Item}} is down to {{Stock}}. The minimum is {{Min Stock}}.'
                   + '\n\nTime to reorder!';
```

## How to install

1. Open your Google Sheet and click **Extensions → Apps Script**.
2. Delete anything in the editor, then paste the whole contents of [`Code.gs`](Code.gs).
3. Edit the **SETTINGS** block for your sheet, then click **Save**.
4. Reload the spreadsheet. A **⚡ Automations** menu appears.
5. Run it from that menu. The first time, Google asks you to authorize the script: choose your account, click **Advanced → Go to (project) (unsafe)**, then **Allow**. This is normal for your own scripts.

## License

MIT. Free to use and modify. See [LICENSE](../LICENSE).
