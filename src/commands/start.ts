import TelegramBot, { Message } from 'node-telegram-bot-api';

import i18n from '../config/i18n';
import { setUserState } from "../state/userState";
import customFetch from "../utils/customFetch";

const startCommand = async (bot: TelegramBot, msg: Message) => {
  const chatId = msg.chat.id;
  const { id: telegramId, first_name: name = 'Guest', username = '' } = msg.from || {};

  if (!telegramId) {
    await bot.sendMessage(chatId, i18n.t('telegramIdError'));
    return;
  }

  try {
    const { data: user } = await customFetch(`/telegram-users/telegramId/${telegramId}`);
    let userData = user;

    if (!userData) {
      const { data: newUser } = await customFetch('/telegram-users', {
        method: 'POST',
        body: JSON.stringify({ data: { telegram_id: telegramId, name, username } }),
      });
      userData = newUser;
    }

    const welcomeMessage = i18n.t('welcome', { firstName: name });
    await bot.sendMessage(chatId, welcomeMessage);

    const initialState = {
      user: userData,
      service: null,
      master: null,
      date: '',
      time: '',
    };

    setUserState(chatId, initialState);
  } catch (error) {
    console.error("Error adding user or sending welcome message:", error);
    await bot.sendMessage(chatId, i18n.t('tryLaterError'));
  }
};

export default startCommand;
