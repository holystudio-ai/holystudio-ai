/**
 * HOLYSTUDIO — приймач заявок для Google Таблиці.
 *
 * Пише в колонки за НАЗВОЮ заголовка в першому рядку.
 *
 * Очікувані заголовки (рядок 1), як у бойовій таблиці:
 * Дата | Source page | Ім'я | Email | Країна | Телефон | Telegram |
 * Звідки дізнались | Роль | Напрямок в AI | Чому менторство | Готовність
 *
 * Після зміни коду: Deploy → Manage deployments → Edit → New version → Deploy.
 */

var COLUMN_MAP = {
  'Дата': function (lead) { return new Date(lead.submittedAt || Date.now()); },
  'Source page': function (lead) { return lead.sourcePage || ''; },
  "Ім'я": function (lead) { return lead.name || ''; },
  'Email': function (lead) { return lead.email || ''; },
  'Країна': function (lead) { return lead.country || ''; },
  'Телефон': function (lead) { return lead.phone || ''; },
  'Telegram': function (lead) { return lead.telegram || ''; },
  'Звідки дізнались': function (lead) { return lead.source || ''; },
  'Роль': function (lead) { return lead.role || ''; },
  'Напрямок в AI': function (lead) { return lead.interest || ''; },
  'Чому менторство': function (lead) { return lead.motivation || ''; },
  'Готовність': function (lead) { return lead.readiness || ''; },
};

function doPost(e) {
  var lead = JSON.parse(e.postData.contents);
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  var lastCol = Math.max(sheet.getLastColumn(), 1);
  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];

  var row = headers.map(function (header) {
    var key = String(header || '').trim();
    var getter = COLUMN_MAP[key];
    return getter ? getter(lead) : '';
  });

  sheet.appendRow(row);

  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
