# Build a Google Form from a List of Questions

Apps Script Recipe #33 from [The Software Manual](https://www.youtube.com/playlist?list=PLGHFsC1aF4YM).

▶ **Video walkthrough:** https://youtu.be/809YxUonU-I

Write your questions in a sheet: the question, its type, the options
and whether it's required. One click builds the whole Google Form.
Run it again after a change, and the same form is rebuilt.

Types: Short answer, Paragraph, Multiple choice, Checkboxes, Dropdown,
Scale, Date. Separate options with commas.

## Settings

Change these lines at the top of `Code.gs` to match your sheet:

```js
const SHEET_NAME  = 'Questions';            // tab with your questions
const FORM_TITLE  = 'Customer Survey';      // title of the form
const DESCRIPTION = 'It takes one minute. Thank you!';
const COLLECT_EMAILS = false;               // true = ask for the email address
```

## How to install

1. Open your Google Sheet and click **Extensions → Apps Script**.
2. Delete anything in the editor, then paste the whole contents of [`Code.gs`](Code.gs).
3. Edit the **SETTINGS** block for your sheet, then click **Save**.
4. Reload the spreadsheet. A **⚡ Automations** menu appears.
5. Run it from that menu. The first time, Google asks you to authorize the script: choose your account, click **Advanced → Go to (project) (unsafe)**, then **Allow**. This is normal for your own scripts.

## License

MIT. Free to use and modify. See [LICENSE](../LICENSE).
