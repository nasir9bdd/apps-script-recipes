# Auto-Grade a Quiz and Email the Results

Apps Script Recipe #35 from [The Software Manual](https://www.youtube.com/playlist?list=PLGHFsC1aF4YM).

▶ **Video walkthrough:** https://youtu.be/OxnYM7mhuT4

Grades every answer of your quiz form against an answer key in your
sheet, writes the score and Pass or Fail next to it, and emails each
person their result with the right answers to the questions they missed.

How to use: put the questions and correct answers in an "Answer Key" tab,
then ⚡ Automations → "Grade new answers", or turn on auto-grading.

## Settings

Change these lines at the top of `Code.gs` to match your sheet:

```js
const SHEET_NAME   = 'Quiz Answers';   // tab where the form saves the answers
const KEY_SHEET    = 'Answer Key';     // column A = question, B = right answer
const NAME_COLUMN  = 'Name';           // header of the name column
const EMAIL_COLUMN = 'Email';          // header of the email column
const PASS_MARK    = 70;               // % needed to pass
const SUBJECT      = 'Your quiz result: {{Score}}';
```

## How to install

1. Open your Google Sheet and click **Extensions → Apps Script**.
2. Delete anything in the editor, then paste the whole contents of [`Code.gs`](Code.gs).
3. Edit the **SETTINGS** block for your sheet, then click **Save**.
4. Reload the spreadsheet. A **⚡ Automations** menu appears.
5. Run it from that menu. The first time, Google asks you to authorize the script: choose your account, click **Advanced → Go to (project) (unsafe)**, then **Allow**. This is normal for your own scripts.

## License

MIT. Free to use and modify. See [LICENSE](../LICENSE).
