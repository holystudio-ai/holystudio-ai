/**
 * HOLYSTUDIO — приймач заявок для Google Таблиці.
 *
 * Заголовки рядка 1:
 * Дата | Ім'я | Email | Країна | Телефон | Telegram | Звідки дізнались |
 * Роль | Напрямок в AI | Чому менторство | Готовність | Source page
 *
 * Пише рівно 12 клітинок у колонки A–L за фіксованим порядком.
 *
 * Додатково веде вкладку "debug": туди падає сирий JSON кожної заявки.
 * Якщо після тестової анкети вкладка порожня — працює СТАРА версія
 * веб-застосунку, і потрібен Deploy → Manage deployments → Edit →
 * Version: New version → Deploy.
 */

var SCRIPT_VERSION = 'v3';

function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var raw = e && e.postData ? e.postData.contents : '';

  try {
    var lead = JSON.parse(raw);
    var sheet = ss.getSheets()[0];

    var row = [
      new Date(lead.submittedAt || Date.now()),
      lead.name || '',
      lead.email || '',
      lead.country || '',
      lead.phone || '',
      lead.telegram || '',
      lead.source || '',
      lead.role || '',
      lead.interest || '',
      lead.motivation || '',
      lead.readiness || '',
      lead.sourcePage || '',
    ];

    sheet.getRange(sheet.getLastRow() + 1, 1, 1, row.length).setValues([row]);

    writeDebug(ss, raw, lead.sourcePage || '(порожньо)');

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    writeDebug(ss, raw, 'ERROR: ' + err);
    return ContentService.createTextOutput(JSON.stringify({ ok: false }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function writeDebug(ss, raw, sourcePage) {
  var dbg = ss.getSheetByName('debug') || ss.insertSheet('debug');
  dbg.appendRow([new Date(), SCRIPT_VERSION, sourcePage, raw]);
}
