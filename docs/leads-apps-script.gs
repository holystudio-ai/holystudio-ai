/**
 * HOLYSTUDIO — приймач заявок для Google Таблиці.
 *
 * Заголовки рядка 1:
 * Дата | Ім'я | Email | Країна | Телефон | Telegram | Звідки дізнались |
 * Роль | Напрямок в AI | Чому менторство | Готовність | Source page
 *
 * Пише рівно 12 клітинок у колонки A–L за фіксованим порядком.
 *
 * УВАГА: після будь-якої зміни коду треба оновити ІСНУЮЧЕ розгортання:
 * Deploy → Управління розгортаннями → ✏️ → Версія: Нова версія → Розгорнути.
 * Нове розгортання створювати НЕ можна — у нього інший /exec URL,
 * і сайт продовжить стукати в старе.
 *
 * Помилки пишуться у вкладку "debug". Успішні заявки туди не потрапляють.
 */

var DATE_FORMAT = 'dd.MM.yyyy HH:mm:ss';

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

    var rowIndex = sheet.getLastRow() + 1;
    sheet.getRange(rowIndex, 1, 1, row.length).setValues([row]);
    // Column formatting would otherwise hide the time part.
    sheet.getRange(rowIndex, 1).setNumberFormat(DATE_FORMAT);

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    var dbg = ss.getSheetByName('debug') || ss.insertSheet('debug');
    dbg.appendRow([new Date(), 'ERROR: ' + err, raw]);

    return ContentService.createTextOutput(JSON.stringify({ ok: false }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
