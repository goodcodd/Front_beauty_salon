import TelegramBot from 'node-telegram-bot-api';

import {
  startCommand,
  servicesCommand,
  languageCommand,
  bookCommand,
  contactsCommand,
  mastersCommand,
  myBookingCommand,
} from './commands';
import { handleMatersCallbackQuery } from './commands/masters';
import { handleBookCallbackQuery } from './commands/book';
import { handleLanguageCallbackQuery } from './commands/language';
import { handleBookCancelCallbackQuery } from './commands/myBooking';

export default (bot: TelegramBot) => {
  bot.onText(/\/start/, (msg) => startCommand(bot, msg));
  bot.onText(/\/services/, (msg) => servicesCommand(bot, msg));
  bot.onText(/\/language/, (msg) => languageCommand(bot, msg));
  bot.onText(/\/book/, (msg) => bookCommand(bot, msg));
  bot.onText(/\/my_booking/, (msg) => myBookingCommand(bot, msg));
  bot.onText(/\/contacts/, (msg) => contactsCommand(bot, msg));
  bot.onText(/\/masters/, (msg) => mastersCommand(bot, msg));
  bot.on('callback_query', (callbackQuery) => {
    handleMatersCallbackQuery(bot, callbackQuery);
    handleBookCallbackQuery(bot, callbackQuery);
    handleLanguageCallbackQuery(bot, callbackQuery);
    handleBookCancelCallbackQuery(bot, callbackQuery);
  });
};
