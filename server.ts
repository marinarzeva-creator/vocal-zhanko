import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      telegramConfigured: Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID)
    });
  });

  // Secure booking submission endpoint
  app.post("/api/booking", async (req, res) => {
    try {
      const { name, phone, service, duration, comment } = req.body || {};

      if (!name || !phone) {
        return res.status(400).json({
          success: false,
          error: "Будь ласка, вкажіть ваше ім'я та номер телефону"
        });
      }

      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      const chatId = process.env.TELEGRAM_CHAT_ID;

      if (botToken && chatId) {
        const messageText =
          `🎵 *Нова заявка на урок!* (Творчий простір Катерини Жанько)\n\n` +
          `👤 *Ім'я:* ${name}\n` +
          `📞 *Телефон:* ${phone}\n` +
          `🎼 *Напрямок:* ${service || 'Вокал'}\n` +
          `⏱ *Тривалість:* ${duration || '55 хв'}\n` +
          (comment ? `💬 *Коментар:* ${comment}\n` : '') +
          `\n📅 *Дата:* ${new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kyiv' })}`;

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

        const telegramResult = (await telegramResponse.json()) as { ok: boolean; description?: string };

        if (!telegramResponse.ok || !telegramResult.ok) {
          console.error("Telegram API error:", telegramResult);
          return res.json({
            success: true,
            telegramSent: false,
            errorDescription: telegramResult.description || "Не вдалося надіслати в Telegram",
          });
        }

        return res.json({
          success: true,
          telegramSent: true,
        });
      } else {
        // Log locally if tokens are not yet provided
        console.log(
          `[Заявка на урок] Ім'я: ${name}, Телефон: ${phone}, Напрямок: ${service}, Тривалість: ${duration}. (TELEGRAM_BOT_TOKEN або TELEGRAM_CHAT_ID ще не налаштовані в змінних середовища)`
        );

        return res.json({
          success: true,
          telegramSent: false,
          configured: false,
          note: "Збережено на сервері. Налаштуйте TELEGRAM_BOT_TOKEN та TELEGRAM_CHAT_ID для миттєвих повідомлень у месенджері.",
        });
      }
    } catch (error) {
      console.error("Помилка обробки заявки:", error);
      return res.status(500).json({
        success: false,
        error: "Внутрішня помилка сервера при відправці заявки",
      });
    }
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
