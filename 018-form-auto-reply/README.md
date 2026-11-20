# Auto-Reply to Every Google Form Submission

Apps Script Recipe #18 from [The Software Manual](https://www.youtube.com/playlist?list=PLGHFsC1aF4YM).

▶ **Video walkthrough:** https://youtu.be/mR_0h5fZfSk

Sends a personal confirmation email to everyone who fills in your
Google Form, using their own answers. Works for any form that saves
its responses to this spreadsheet.

How to use: ⚡ Automations → "Turn on auto-replies".
Free Gmail accounts can send about 100 emails a day.

## Settings

Change these lines at the top of `Code.gs` to match your sheet:

```js
const EMAIL_QUESTION = 'Email';              // the question that asks for an email
const SUBJECT        = 'You are in, {{Name}}!';
const MESSAGE        = 'Hi {{Name}},\n\nThanks for signing up for {{Workshop}}.'
                     + ' We will send you the details soon.\n\nSee you there!';
const STATUS_COLUMN  = 'Reply';              // added next to the answers
```

## How to install

1. Open your Google Sheet and click **Extensions → Apps Script**.
2. Delete anything in the editor, then paste the whole contents of [`Code.gs`](Code.gs).
3. Edit the **SETTINGS** block for your sheet, then click **Save**.
4. Reload the spreadsheet. A **⚡ Automations** menu appears.
5. Run it from that menu. The first time, Google asks you to authorize the script: choose your account, click **Advanced → Go to (project) (unsafe)**, then **Allow**. This is normal for your own scripts.

## License

MIT. Free to use and modify. See [LICENSE](../LICENSE).
