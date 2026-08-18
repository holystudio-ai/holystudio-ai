/**
 * HOLYSTUDIO — приймач заявок для Google Таблиці.
 *
 * Source page стоїть ОСТАННЬОЮ колонкою, щоб не зсувати ім'я/телефон.
 *
 * Заголовки рядка 1:
 * Дата | Ім'я | Email | Країна | Телефон | Telegram | Звідки дізнались |
 * Роль | Напрямок в AI | Чому менторство | Готовність | Source page
 *
 * У таблиці: виріж колонку "Source page" з B і вставь її після "Готовність".
 *
 * Після зміни коду:
 * Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy.
 */

function doPost(e) {
  var lead = JSON.parse(e.postData.contents);
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

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

  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
