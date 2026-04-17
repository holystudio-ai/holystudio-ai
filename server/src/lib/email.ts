import { Resend } from 'resend';
import { config } from '../config.js';

let resendInstance: Resend | null = null;

function getResend(): Resend {
    if (!resendInstance) {
        resendInstance = new Resend(config.RESEND_API_KEY);
    }
    return resendInstance;
}

const TELEGRAM_BOT = 'HOLYSTUDIO_AI_bot';

function buildReminderHtml(siteUrl: string): string {
    return `
<!DOCTYPE html>
<html lang="uk">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background-color:#000000;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#000000;padding:40px 16px;">
<tr><td align="center">
<table width="500" cellpadding="0" cellspacing="0" style="max-width:500px;width:100%;border:3px solid #ffffff;background-color:#000000;">
<tr><td style="padding:28px 28px 0 28px;">
  <img src="https://holystudio.ai/logo.png" alt="HOLYSTUDIO" height="32" style="height:32px;display:block;" />
</td></tr>
<tr><td style="padding:24px 28px 0 28px;">
  <h1 style="margin:0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:22px;font-weight:900;text-transform:uppercase;letter-spacing:-0.5px;color:#ffffff;line-height:1.2;">
    Ти ще не завершив оплату 🔥
  </h1>
</td></tr>
<tr><td style="padding:16px 28px 0 28px;">
  <p style="margin:0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:1.6;color:#cccccc;">
    Ми помітили, що ти залишив процес оплати інтенсиву з AI-креативів. Не пропусти шанс навчитися створювати фото та відео кінематографічної якості!
  </p>
</td></tr>
<tr><td style="padding:28px 28px;">
  <table width="100%" cellpadding="0" cellspacing="0">
  <tr><td align="center">
    <a href="${siteUrl}" target="_blank" style="display:block;width:100%;background-color:#a855f7;color:#ffffff;text-align:center;padding:16px 0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;font-weight:900;text-transform:uppercase;text-decoration:none;letter-spacing:-0.3px;border:3px solid #ffffff;">
      Завершити оплату
    </a>
  </td></tr>
  </table>
</td></tr>
<tr><td style="padding:0 28px;">
  <div style="border-top:1px solid #333333;"></div>
</td></tr>
<tr><td style="padding:20px 28px 28px 28px;">
  <p style="margin:0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;color:#666666;text-align:center;line-height:1.5;">
    Якщо виникли питання — напиши нам
    <a href="https://www.instagram.com/holystudio.ai/" style="color:#a855f7;text-decoration:underline;">@holystudio.ai</a>
    в Instagram
  </p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`.trim();
}

function buildAccessHtml(orderReference: string, botLink?: string): string {
    const finalBotLink = botLink || `https://t.me/${TELEGRAM_BOT}`;
    return `
<!DOCTYPE html>
<html lang="uk">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background-color:#000000;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#000000;padding:40px 16px;">
<tr><td align="center">
<table width="500" cellpadding="0" cellspacing="0" style="max-width:500px;width:100%;border:3px solid #ffffff;background-color:#000000;">
<tr><td style="padding:28px 28px 0 28px;">
  <img src="https://holystudio.ai/logo.png" alt="HOLYSTUDIO" height="32" style="height:32px;display:block;" />
</td></tr>
<tr><td style="padding:24px 28px 0 28px;">
  <h1 style="margin:0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:22px;font-weight:900;text-transform:uppercase;letter-spacing:-0.5px;color:#ffffff;line-height:1.2;">
    Оплата пройшла успішно! 🎉
  </h1>
</td></tr>
<tr><td style="padding:16px 28px 0 28px;">
  <p style="margin:0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:1.6;color:#cccccc;">
    Дякуємо за покупку інтенсиву з AI-креативів! Щоб отримати доступ до курсу, натисни кнопку нижче — тебе буде перенаправлено до нашого Telegram-бота.
  </p>
</td></tr>
<tr><td style="padding:28px 28px 12px 28px;">
  <table width="100%" cellpadding="0" cellspacing="0">
  <tr><td align="center">
    <a href="${finalBotLink}" target="_blank" style="display:block;width:100%;background-color:#2AABEE;color:#ffffff;text-align:center;padding:16px 0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;font-weight:900;text-transform:uppercase;text-decoration:none;letter-spacing:-0.3px;border:3px solid #ffffff;">
      ✈️ Отримати доступ до курсу
    </a>
  </td></tr>
  </table>
</td></tr>
<tr><td style="padding:0 28px 20px 28px;">
  <p style="margin:0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;color:#666666;text-align:center;">
    Номер замовлення: ${orderReference}
  </p>
</td></tr>
<tr><td style="padding:0 28px;">
  <div style="border-top:1px solid #333333;"></div>
</td></tr>
<tr><td style="padding:20px 28px 28px 28px;">
  <p style="margin:0;font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;color:#666666;text-align:center;line-height:1.5;">
    Якщо виникли питання — напиши нам
    <a href="https://www.instagram.com/holystudio.ai/" style="color:#a855f7;text-decoration:underline;">@holystudio.ai</a>
    в Instagram
  </p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`.trim();
}

export async function sendReminderEmail(to: string): Promise<boolean> {
    try {
        const resend = getResend();
        const from = config.RESEND_FROM;
        const siteUrl = config.SITE_URL;

        const { error } = await resend.emails.send({
            from, to,
            subject: 'Завершіть оплату інтенсиву — HOLYSTUDIO',
            html: buildReminderHtml(siteUrl),
        });

        if (error) {
            console.error('[Resend] Error sending to', to, error);
            return false;
        }

        console.log('[Resend] Reminder sent to', to);
        return true;
    } catch (err) {
        console.error('[Resend] Exception sending to', to, err);
        return false;
    }
}

export async function sendAccessEmail(to: string, orderReference: string, botLink?: string): Promise<boolean> {
    try {
        const resend = getResend();
        const from = config.RESEND_FROM;

        const { error } = await resend.emails.send({
            from, to,
            subject: 'Доступ до курсу — HOLYSTUDIO 🎉',
            html: buildAccessHtml(orderReference, botLink),
        });

        if (error) {
            console.error('[Resend] Error sending access email to', to, error);
            return false;
        }

        console.log('[Resend] Access email sent to', to);
        return true;
    } catch (err) {
        console.error('[Resend] Exception sending access email to', to, err);
        return false;
    }
}

