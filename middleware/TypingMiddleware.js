const { Telegraf, Composer } = require("telegraf");

class TypingMiddleware extends Composer {
  constructor() {
    super();
    this.use(this.typingMessages.bind(this));
  }

  async typingMessages(ctx, next) {
    const originalSendMessage = ctx.telegram.sendMessage.bind(ctx.telegram);

    ctx.telegram.sendMessage = async (chatId, text, options) => {
      await ctx.telegram.sendChatAction(chatId, "typing");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return originalSendMessage(chatId, text, options);
    };

    await next();
  }
}

module.exports = TypingMiddleware;
