# Bulk Email Safely: Quota Check, Batches, Send Log

Apps Script Recipe #19 from [The Software Manual](https://www.youtube.com/playlist?list=PLGHFsC1aF4YM).

▶ **Video walkthrough:** https://youtu.be/X67ifiEFWd4

Sends a long list of emails in small batches. It checks your daily Gmail
quota first, and when the quota runs out it simply continues tomorrow.
Every row gets a status, so nobody gets the same email twice.

How to use: ⚡ Automations → "Start sending". The rest runs by itself.
Daily limit: about 100 recipients on free Gmail, 1,500 on Workspace.

## Settings

Change these lines at the top of `Code.gs` to match your sheet:

```js
const SHEET_NAME    = 'Subscribers';                // tab with one email per row
const EMAIL_COLUMN  = 'Email';
const STATUS_COLUMN = 'Status';                     // "Sent" + time goes here
const SUBJECT       = '{{Name}}, here is our November newsletter';
const MESSAGE       = 'Hi {{Name}},\n\nHere is what happened this month...';
const BATCH_SIZE    = 50;                           // emails per batch
const WAIT_MINUTES  = 10;                           // pause between batches
const KEEP_QUOTA    = 5;                            // emails to keep for yourself
```

## How to install

1. Open your Google Sheet and click **Extensions → Apps Script**.
2. Delete anything in the editor, then paste the whole contents of [`Code.gs`](Code.gs).
3. Edit the **SETTINGS** block for your sheet, then click **Save**.
4. Reload the spreadsheet. A **⚡ Automations** menu appears.
5. Run it from that menu. The first time, Google asks you to authorize the script: choose your account, click **Advanced → Go to (project) (unsafe)**, then **Allow**. This is normal for your own scripts.

## License

MIT. Free to use and modify. See [LICENSE](../LICENSE).
