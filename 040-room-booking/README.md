# Room and Slot Booking with a Conflict Check

Apps Script Recipe #40 from [The Software Manual](https://www.youtube.com/playlist?list=PLGHFsC1aF4YM).

▶ **Video walkthrough:** https://youtu.be/kVCcUO-_dSA

People book a room (or a time slot) with your Google Form. If the slot
is free, the booking goes on the room's calendar and they get a
confirmation. If it's taken, they get an email asking for another time.

How to use: make a calendar for the room, link your form to this sheet,
then ⚡ Automations → "Turn on automatic booking".

## Settings

Change these lines at the top of `Code.gs` to match your sheet:

```js
const CALENDAR     = 'Meeting Room';    // the room's calendar
const SHEET_NAME   = 'Room Bookings';   // tab where the form saves answers
const NAME_COLUMN  = 'Name';            // header of the name column
const EMAIL_COLUMN = 'Email';           // header of the email column
const DATE_COLUMN  = 'Date';            // header of the date question
const TIME_COLUMN  = 'Time';            // header of the start time question
const MINUTES      = 60;                // length of a booking
const BOOKED = ['Booked: {{Date}} at {{Time}}',
  'Hi {{Name}},\n\nThe meeting room is yours on {{Date}} at {{Time}}.\n\nSee you!'];
const TAKEN  = ['Sorry, {{Date}} at {{Time}} is taken',
  'Hi {{Name}},\n\nThe room is already booked at that time.\n' +
  'Please send the form again with another time.'];
```

## How to install

1. Open your Google Sheet and click **Extensions → Apps Script**.
2. Delete anything in the editor, then paste the whole contents of [`Code.gs`](Code.gs).
3. Edit the **SETTINGS** block for your sheet, then click **Save**.
4. Reload the spreadsheet. A **⚡ Automations** menu appears.
5. Run it from that menu. The first time, Google asks you to authorize the script: choose your account, click **Advanced → Go to (project) (unsafe)**, then **Allow**. This is normal for your own scripts.

## License

MIT. Free to use and modify. See [LICENSE](../LICENSE).
