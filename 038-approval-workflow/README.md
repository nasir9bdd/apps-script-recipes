# Approval Workflow with Google Forms and Sheets

Apps Script Recipe #38 from [The Software Manual](https://www.youtube.com/playlist?list=PLGHFsC1aF4YM).

▶ **Video walkthrough:** https://youtu.be/_8MtjKrvCKw

Someone sends a request with your Google Form (time off, a purchase, an
expense...). The approver gets an email right away. In the sheet, they
pick Approved or Rejected, and the person who asked gets the answer.

How to use: link your form to this sheet, set APPROVER, then
⚡ Automations → "Turn on approvals".

## Settings

Change these lines at the top of `Code.gs` to match your sheet:

```js
const APPROVER     = 'manager@example.com';   // gets each new request
const SHEET_NAME   = 'Requests';              // tab where the form saves answers
const NAME_COLUMN  = 'Name';                  // header of the name column
const EMAIL_COLUMN = 'Email';                 // header of the email column
const CHOICES      = ['Approved', 'Rejected'];
const SUBJECT      = 'Your request was {{Decision}}';
const MESSAGE      = 'Hi {{Name}},\n\nYour request was {{Decision}}.\n\n' +
                     'Request: {{Type}}, {{Details}}\n\nThanks!';
```

## How to install

1. Open your Google Sheet and click **Extensions → Apps Script**.
2. Delete anything in the editor, then paste the whole contents of [`Code.gs`](Code.gs).
3. Edit the **SETTINGS** block for your sheet, then click **Save**.
4. Reload the spreadsheet. A **⚡ Automations** menu appears.
5. Run it from that menu. The first time, Google asks you to authorize the script: choose your account, click **Advanced → Go to (project) (unsafe)**, then **Allow**. This is normal for your own scripts.

## License

MIT. Free to use and modify. See [LICENSE](../LICENSE).
