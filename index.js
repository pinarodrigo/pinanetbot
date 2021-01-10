
const Telegraf = require('telegraf');
const Markup = require("telegraf/markup");
const Stage = require("telegraf/stage");
const session = require("telegraf/session");
const WizardScene = require("telegraf/scenes/wizard");
const config = require('./config/config');
const loveCalculator = require("./api/loveCalculator");
const openhab = require("./api/openhabAmazon");

const bot = new Telegraf(config.env.key)

bot.start((ctx) => ctx.reply('Welcome'))

bot.hears('command', (ctx) => {
    ctx.reply(
        `Hello ${ctx.from.first_name}, I will execute a command in your OpenHAB`,
        Markup.inlineKeyboard([
            Markup.callbackButton("Start", "OPENHAB_COMMAND")
        ]).extra()
    );
});

const sendOpenHABCommand = new WizardScene(
    "openhab_command",
    ctx => {
        ctx.reply('Awaiting command'); // enter device name
        return ctx.wizard.next();
    },
    ctx => {
        ctx.wizard.state.commandName = ctx.message.text; // store yourName in the state to share data between middlewares
        if (ctx.wizard.state.commandName === 'followkids') {
            ctx.reply(
                "Enter the value"
            );
            return ctx.wizard.next();
        } if (ctx.wizard.state.commandName === 'routine') {
            ctx.reply(
                "Enter the value"
            );
            return ctx.wizard.next();
        } else {
            ctx.reply(
                "I'm sorry, command unknown...",
                Markup.inlineKeyboard([
                    Markup.callbackButton("Execute another command", "OPENHAB_COMMAND")
                ]).extra()
            )
        }
    },
    ctx => {
        const commandValue = ctx.message.text; // retrieve partner name from the message which user entered
        const commandName = ctx.wizard.state.commandName; // retrieve your name from state
        if (commandName === 'followkids') {
            openhab
                .changeItemState('Follow_Kids', commandValue)
                .then(res => {
                    ctx.reply(
                        `Command executed succesfully`,
                        Markup.inlineKeyboard([
                            Markup.callbackButton(
                                "Execute another",
                                "OPENHAB_COMMAND"
                            )
                        ]).extra()
                    );
                })
                .catch(err => {
                    ctx.reply(
                        err.message,
                        Markup.inlineKeyboard([
                            Markup.callbackButton("Execute another command", "OPENHAB_COMMAND")
                        ]).extra()
                    )
                    console.error(JSON.stringify(err))
                });
        }
        if (commandName === 'routine') {
            openhab
                .sendItemCommand('Oficina_StartARoutine', commandValue)
                .then(res => {
                    ctx.reply(
                        `Command executed succesfully`,
                        Markup.inlineKeyboard([
                            Markup.callbackButton(
                                "Execute another",
                                "OPENHAB_COMMAND"
                            )
                        ]).extra()
                    );
                })
                .catch(err => {
                    ctx.reply(
                        err.message,
                        Markup.inlineKeyboard([
                            Markup.callbackButton("Execute another command", "OPENHAB_COMMAND")
                        ]).extra()
                    )
                    console.error(JSON.stringify(err))
                });
        }
        return ctx.scene.leave();
    }
);

const stage = new Stage([sendOpenHABCommand], { default: "openhab_command" }); // Scene registration
bot.use(session());
bot.use(stage.middleware());
bot.launch();
