/**
 * Build a Google Form from a List of Questions (Apps Script Recipes #33)
 * Write your questions in a sheet: the question, its type, the options
 * and whether it's required. One click builds the whole Google Form.
 * Run it again after a change, and the same form is rebuilt.
 *
 * Types: Short answer, Paragraph, Multiple choice, Checkboxes, Dropdown,
 * Scale, Date. Separate options with commas.
 *
 * License: MIT. Free to use and modify.
 */

// ================= SETTINGS: change these =================
const SHEET_NAME  = 'Questions';            // tab with your questions
const FORM_TITLE  = 'Customer Survey';      // title of the form
const DESCRIPTION = 'It takes one minute. Thank you!';
const COLLECT_EMAILS = false;               // true = ask for the email address
// ===========================================================


/** Adds the ⚡ Automations menu when the spreadsheet opens. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('⚡ Automations')
    .addItem('Build the form', 'buildForm')
    .addToUi();
}

function buildForm() {
  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('No tab called "' + SHEET_NAME + '". Check SETTINGS.');
  const values = sheet.getDataRange().getDisplayValues();
  const head = values[0].map(h => h.trim().toLowerCase());
  const col = name => head.indexOf(name);

  const form = form_();
  form.setTitle(FORM_TITLE).setDescription(DESCRIPTION)
    .setCollectEmail(COLLECT_EMAILS);
  form.getItems().forEach(item => form.deleteItem(item));   // start clean

  let count = 0;
  values.slice(1).forEach(row => {
    const title = row[col('question')].trim();
    if (!title) return;
    const type = (row[col('type')] || 'Short answer').trim().toLowerCase();
    const options = row[col('options')].split(',').map(o => o.trim()).filter(String);
    const required = /^(yes|true|x)$/i.test(row[col('required')].trim());
    let item;
    if (type === 'paragraph') item = form.addParagraphTextItem();
    else if (type === 'multiple choice') item = form.addMultipleChoiceItem()
      .setChoiceValues(options);
    else if (type === 'checkboxes') item = form.addCheckboxItem()
      .setChoiceValues(options);
    else if (type === 'dropdown') item = form.addListItem().setChoiceValues(options);
    else if (type === 'scale') item = form.addScaleItem()
      .setBounds(1, Number(options[0]) || 5);
    else if (type === 'date') item = form.addDateItem();
    else item = form.addTextItem();
    item.setTitle(title).setRequired(required);
    count++;
  });

  const links = [['=HYPERLINK("' + form.getEditUrl() + '", "Edit form")'],
                 ['=HYPERLINK("' + form.getPublishedUrl() + '", "Open live form")']];
  const width = head.indexOf('') < 0 ? head.length : head.indexOf('');
  const where = sheet.getRange(1, width + 2, 2, 1);  // after one empty column
  where.setFormulas(links);
  ss.toast('Form built with ' + count + ' questions', '⚡ Automations', 10);
}

/** The form made last time (rebuilt in place), or a new one. */
function form_() {
  const props = PropertiesService.getDocumentProperties();
  const id = props.getProperty('FORM_ID');
  if (id) {
    try { return FormApp.openById(id); } catch (e) { /* deleted: make a new one */ }
  }
  const form = FormApp.create(FORM_TITLE);
  props.setProperty('FORM_ID', form.getId());
  return form;
}
