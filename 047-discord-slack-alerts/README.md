# Discord and Slack Alerts from Google Sheets

Apps Script Recipe #47 from [The Software Manual](https://www.youtube.com/playlist?list=PLGHFsC1aF4YM).

▶ **Video walkthrough:** https://youtu.be/Hm6CjmmdQok

When someone changes the Status of a row, the script posts a message to
your Discord or Slack channel, like "Order #1043 is now Shipped".
It uses an incoming webhook: a private link to one channel.

How to use: create a webhook in Discord (Channel settings > Integrations)
or Slack (Incoming Webhooks app), then ⚡ Automations → "Set webhook link"
and "Turn on alerts". The link is stored privately, not in the code.

## Settings

Change these lines at the top of `Code.gs` to match your sheet:

```js
const SHEET_NAME   = 'Orders';                 // tab to watch
const WATCH_COLUMN = 'Status';                 // alert when this column changes
const ALERT_ON     = [];                       // e.g. ['Shipped'] or [] = any value
const MESSAGE      = '{{Order}} is now **{{Status}}** ({{Customer}})';
```

## How to install

1. Open your Google Sheet and click **Extensions → Apps Script**.
2. Delete anything in the editor, then paste the whole contents of [`Code.gs`](Code.gs).
3. Edit the **SETTINGS** block for your sheet, then click **Save**.
4. Reload the spreadsheet. A **⚡ Automations** menu appears.
5. Run it from that menu. The first time, Google asks you to authorize the script: choose your account, click **Advanced → Go to (project) (unsafe)**, then **Allow**. This is normal for your own scripts.

## License

MIT. Free to use and modify. See [LICENSE](../LICENSE).
