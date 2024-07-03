const { Telegraf, Markup, Scenes, session } = require("telegraf");
const TypingMiddleware = require("./middleware/TypingMiddleware");

const bot = new Telegraf("7155151107:AAGVs9LJwj8W4L1l5iS37H7McXNwFbsZ4Xo");

const typingMiddleware = new TypingMiddleware();

bot.use(typingMiddleware);

const scenarioTypeScene = new Scenes.BaseScene("scenarioTypeScene");
const policyScene = new Scenes.BaseScene("policyScene");
const shopScene = new Scenes.BaseScene("shopScene");

const stage = new Scenes.Stage([scenarioTypeScene, policyScene, shopScene]);

bot.use(session());
bot.use(stage.middleware());

bot.command("start", (ctx) => {
  if (!ctx.session.myData) {
    ctx.session.myData = {};
  }
  ctx.scene.enter("scenarioTypeScene");
});

scenarioTypeScene.enter((ctx) => {
  ctx.replyWithHTML(
    "Привет! Я <b>бот</b>, продающий услуги. Перейди в магазин и выбери услугу!",
    Markup.inlineKeyboard([[Markup.button.callback("Магазин", "SHOP_ACTION")]])
  );
});

scenarioTypeScene.action("SHOP_ACTION", (ctx) => {
  if (ctx.session.myData.agreedToPolicy) {
    ctx.answerCbQuery("Вы перешли в магазин");
    ctx.scene.enter("shopScene");
  } else {
    ctx.answerCbQuery("Примите соглашение с политикой");
    ctx.scene.enter("policyScene");
  }
});

policyScene.enter((ctx) => {
  ctx.reply(
    "Согласны ли вы с условиями политики компании?",
    Markup.inlineKeyboard([
      [
        Markup.button.callback("Да", "AGREE_ACTION"),
        Markup.button.callback("Нет", "DISAGREE_ACTION"),
      ],
    ])
  );
});

policyScene.action("AGREE_ACTION", (ctx) => {
  ctx.session.myData.agreedToPolicy = true;
  ctx.answerCbQuery("Спасибо за согласие с нашей политикой!");
  ctx.scene.enter("shopScene");
});

policyScene.action("DISAGREE_ACTION", (ctx) => {
  ctx.session.myData.agreedToPolicy = false;
  ctx.reply(
    "Вы не согласились с политикой компании. К сожалению, мы не можем продолжить."
  );
  ctx.scene.leave();
});

shopScene.enter((ctx) => {
  ctx.replyWithHTML(
    "Добро пожаловать в магазин!\n\n<b>Услуга</b>: Стать программистом\n<b>Цена</b>: 1000$",
    Markup.inlineKeyboard([
      [
        Markup.button.callback("Купить", "BUY_ACTION"),
        Markup.button.callback("Назад", "BACK_ACTION"),
      ],
    ])
  );
});

shopScene.action("BUY_ACTION", (ctx) => {
  ctx.answerCbQuery("Вы купили услугу!");
  ctx.reply("Спасибо за покупку!");
  ctx.scene.leave();
});

shopScene.action("BACK_ACTION", (ctx) => {
  ctx.answerCbQuery("Вы вернулись в меню");
  ctx.scene.enter("scenarioTypeScene");
});

bot.launch();
