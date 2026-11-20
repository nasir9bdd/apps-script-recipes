# Birthday and Anniversary Emails on Autopilot

Apps Script Recipe #37 from [The Software Manual](https://www.youtube.com/playlist?list=PLGHFsC1aF4YM).

▶ **Video walkthrough:** https://youtu.be/KI0cVzKH_fI

Every morning, the script checks your list. When it's someone's birthday
or anniversary, they get a personal email. Each greeting is sent only once
a year, and the sheet shows what was sent and when.

How to use: ⚡ Automations → "Send today's greetings" to test it, then
"Turn on daily greetings".

## Settings

Change these lines at the top of `Code.gs` to match your sheet:

```js
const SHEET_NAME   = 'Birthdays';     // tab with your people
const NAME_COLUMN  = 'Name';          // header of the name column
const EMAIL_COLUMN = 'Email';         // header of the email column
const SEND_HOUR    = 8;               // send around 8 AM
const GREETINGS = {                   // date column: [subject, message]
  'Birthday':    ['Happy birthday, {{Name}}! 🎂',
                  'Hi {{Name}},\n\nHappy birthday! Have a wonderful day.\n\nMaya'],
  'Anniversary': ['Happy {{Years}}-year anniversary, {{Name}}! 🎉',
                  'Hi {{Name}},\n\nThank you for {{Years}} great years!\n\nMaya'],
};
```

## How to install

1. Open your Google Sheet and click **Extensions → Apps Script**.
2. Delete anything in the editor, then paste the whole contents of [`Code.gs`](Code.gs).
3. Edit the **SETTINGS** block for your sheet, then click **Save**.
4. Reload the spreadsheet. A **⚡ Automations** menu appears.
5. Run it from that menu. The first time, Google asks you to authorize the script: choose your account, click **Advanced → Go to (project) (unsafe)**, then **Allow**. This is normal for your own scripts.

## License

MIT. Free to use and modify. See [LICENSE](../LICENSE).
