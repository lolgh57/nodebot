const { Telegraf, Markup } = require("telegraf");

const bot = new Telegraf("7155151107:AAGVs9LJwj8W4L1l5iS37H7McXNwFbsZ4Xo");

bot.command("start", (ctx) => {
  ctx.reply(
    "Привет! Я бот. Я умею рассылать вам сообщения.",
    Markup.inlineKeyboard([
      [Markup.button.callback("Отправить текст", "send_text")],
      [Markup.button.callback("Изменить сообщение", "edit_message")],
    ])
  );
});

bot.on("text", (ctx) => {
  if (
    ctx.message.reply_to_message &&
    ctx.message.reply_to_message.text ===
      "Привет! Я бот. Я умею рассылать вам сообщения."
  ) {
    ctx.reply(
      "Выберите действие:",
      Markup.inlineKeyboard([
        [Markup.button.callback("Отправить текст", "send_text")],
        [Markup.button.callback("Изменить сообщение", "edit_message")],
      ])
    );
  }
});

bot.action("send_text", (ctx) => {
  ctx.reply("Какой-нибудь текст");
});

bot.action("edit_message", async (ctx) => {
  await ctx.editMessageText(
    "Выберите действие:\n\nЭто сообщение было изменено!",
    Markup.inlineKeyboard([
      [Markup.button.callback("Отправить текст", "send_text")],
      [Markup.button.callback("Изменить сообщение", "edit_message")],
    ])
  );
});

bot.launch();
