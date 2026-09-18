// Serverless endpoint for Vercel deployment
import type { Request, Response } from "express";

export default async function handler(req: Request, res: Response) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  // Allow CORS if needed
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { name, phone, service, duration, comment } = req.body || {};

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        error: "Будь ласка, вкажіть ваше ім'я та номер телефону",
      });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (botToken && chatId) {
      const messageText =
        `🎵 *Нова заявка на урок!* (Творчий простір Катерини Жанько)\n\n` +
        `👤 *Ім'я:* ${name}\n` +
        `📞 *Телефон:* ${phone}\n` +
        `🎼 *Напрямок:* ${service || "Вокал"}\n` +
        `⏱ *Тривалість:* ${duration || "55 хв"}\n` +
        (comment ? `💬 *Коментар:* ${comment}\n` : "") +
        `\n📅 *Дата:* ${new Date().toLocaleString("uk-UA", { timeZone: "Europe/Kyiv" })}`;

      const telegramResponse = await fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: chatId,
            text: messageText,
            parse_mode: "Markdown",
          }),
        }
      );

      const telegramResult = (await telegramResponse.json()) as {
        ok: boolean;
        description?: string;
      };

      if (!telegramResponse.ok || !telegramResult.ok) {
        console.error("Telegram API error:", telegramResult);
        return res.json({
          success: true,
          telegramSent: false,
          errorDescription:
            telegramResult.description || "Не вдалося надіслати в Telegram",
        });
      }

      return res.json({
        success: true,
        telegramSent: true,
      });
    } else {
      console.log(
        `[Заявка на урок] Ім'я: ${name}, Телефон: ${phone}, Напрямок: ${service}, Тривалість: ${duration}. (TELEGRAM_BOT_TOKEN або TELEGRAM_CHAT_ID не налаштовані в змінних середовища)`
      );

      return res.json({
        success: true,
        telegramSent: false,
        configured: false,
        note: "Налаштуйте TELEGRAM_BOT_TOKEN та TELEGRAM_CHAT_ID для сповіщень у Telegram.",
      });
    }
  } catch (error) {
    console.error("Помилка обробки заявки:", error);
    return res.status(500).json({
      success: false,
      error: "Внутрішня помилка сервера при відправці заявки",
    });
  }
}
