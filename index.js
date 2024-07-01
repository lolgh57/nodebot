const { Telegraf, Markup, Scenes, session } = require("telegraf");

const bot = new Telegraf("7155151107:AAGVs9LJwj8W4L1l5iS37H7McXNwFbsZ4Xo");
// Define scenes
const scenarioTypeScene = new Scenes.BaseScene("scenarioTypeScene");
const superPowerScene = new Scenes.BaseScene("superPowerScene");
const codingLanguageScene = new Scenes.BaseScene("codingLanguageScene");

const stage = new Scenes.Stage([
  scenarioTypeScene,
  superPowerScene,
  codingLanguageScene,
]);

bot.use(session());
bot.use(stage.middleware());

bot.command("start", (ctx) => {
  ctx.session.myData = {};
  ctx.scene.enter("scenarioTypeScene");
});

// Scenario Type Scene
scenarioTypeScene.enter((ctx) => {
  ctx.reply(
    "Привет! Я бот. Я умею рассылать вам сообщения. Какие пожелания?",
    Markup.inlineKeyboard([
      [Markup.button.callback("Хочу суперсилу", "SUPER_ACTION")],
    ])
  );
});

scenarioTypeScene.action("SUPER_ACTION", (ctx) => {
  ctx.answerCbQuery("Вы выбрали 'Хочу суперсилу'");
  ctx.session.myData.preferenceType = "SUPER";
  ctx.scene.enter("superPowerScene");
});

superPowerScene.enter((ctx) => {
  ctx.reply(
    "Какую суперсилу вы хотите?",
    Markup.inlineKeyboard([
      [Markup.button.callback("Хочу программировать", "CODING_ACTION")],
    ])
  );
});

scenarioTypeScene.action("CODING_ACTION", (ctx) => {
  ctx.answerCbQuery("Вы выбрали 'Хочу программировать'");
  ctx.session.myData.preferenceType = "CODING";
  ctx.scene.enter("codingLanguageScene");
});

superPowerScene.on("message", (ctx) => {
  ctx.session.myData.superpower = ctx.message.text;
  ctx.reply(`Вы выбрали суперсилу: ${ctx.message.text}`);
  ctx.scene.leave();
});

superPowerScene.leave((ctx) => {
  ctx.reply("Спасибо за ваше время! Мы постараемся помочь с вашими желаниями.");
});

codingLanguageScene.enter((ctx) => {
  ctx.reply("Какой язык программирования вам интересен?");
});

codingLanguageScene.on("message", (ctx) => {
  ctx.session.myData.language = ctx.message.text;
  ctx.reply(`Вам нравится язык программирования: ${ctx.message.text}`);
  ctx.scene.leave();
});

codingLanguageScene.leave((ctx) => {
  ctx.reply("Спасибо за ваше время! Мы постараемся помочь с вашими желаниями.");
});

// Middleware for unrecognized messages
scenarioTypeScene.use((ctx) => ctx.reply("Пожалуйста, выберите действие"));
superPowerScene.use((ctx) =>
  ctx.reply("Пожалуйста, напишите желаемую суперсилу")
);
codingLanguageScene.use((ctx) =>
  ctx.reply("Пожалуйста, напишите интересующий вас язык программирования")
);

bot.launch();
