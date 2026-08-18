/**
 * HOLYSTUDIO — приймач заявок для Google Таблиці.
 *
 * Пише рівно 12 клітинок у фіксованому порядку A–L.
 * Не використовує appendRow: він викидає порожні Email/Країна/Source page
 * і зсуває ім'я в колонку B.
 *
 * Заголовки рядка 1 мають бути:
 * Дата | Source page | Ім'я | Email | Країна | Телефон | Telegram |
 * Звідки дізнались | Роль | Напрямок в AI | Чому менторство | Готовність
 *
 * Після зміни коду обов'язково:
 * Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy.
 * Save в редакторі недостатньо — Google продовжить стару версію.
 */

function doPost(e) {
  var lead = JSON.parse(e.postData.contents);
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

  var row = [
    new Date(lead.submittedAt || Date.now()),
    lead.sourcePage || '',
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
  ];

  sheet.getRange(sheet.getLastRow() + 1, 1, 1, row.length).setValues([row]);

  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
