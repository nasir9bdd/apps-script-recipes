# Daily Weather Forecast in Google Sheets

Apps Script Recipe #43 from [The Software Manual](https://www.youtube.com/playlist?list=PLGHFsC1aF4YM).

▶ **Video walkthrough:** https://youtu.be/7JFejStSQ30

Type city names in column A: the script fills in today's forecast for
each one: high and low temperature, chance of rain and the sky. It uses
Open-Meteo, a free weather service: no sign-up and no API key.

How to use: ⚡ Automations → "Get the forecast now", or turn on daily
updates to have a fresh forecast every morning.

## Settings

Change these lines at the top of `Code.gs` to match your sheet:

```js
const SHEET_NAME  = 'Weather';     // column A = city names, row 1 = headers
const UNITS       = 'celsius';     // 'celsius' or 'fahrenheit'
const UPDATE_HOUR = 6;             // daily update around this hour
```

## How to install

1. Open your Google Sheet and click **Extensions → Apps Script**.
2. Delete anything in the editor, then paste the whole contents of [`Code.gs`](Code.gs).
3. Edit the **SETTINGS** block for your sheet, then click **Save**.
4. Reload the spreadsheet. A **⚡ Automations** menu appears.
5. Run it from that menu. The first time, Google asks you to authorize the script: choose your account, click **Advanced → Go to (project) (unsafe)**, then **Allow**. This is normal for your own scripts.

## License

MIT. Free to use and modify. See [LICENSE](../LICENSE).
