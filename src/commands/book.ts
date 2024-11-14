import TelegramBot, { Message } from 'node-telegram-bot-api';

import {
  handleBookService,
  handleServiceBookSelection,
} from '../services/serviceService';
import { handleBackToDate, handleDateSelection } from '../services/dateService';
import {
  handleBackToMaster,
  handleMasterSelection,
} from '../services/masterService';
import { handleTimeSelection, handleBackToTime } from '../services/timeService';
import { handleSigningSelection } from '../services/approveService';
import customFetch from '../utils/customFetch';
import { setUserState } from '../state/userState';

export const handleBookCallbackQuery = async (
  bot: TelegramBot,
  callbackQuery: TelegramBot.CallbackQuery,
) => {
  const chatId = callbackQuery.message?.chat.id;
  const messageId = callbackQuery.message?.message_id;
  const data = callbackQuery.data;

  if (!chatId || !messageId || !data) return;

  await bot.sendChatAction(chatId, 'typing');

  if (data.startsWith('service_')) {
    await handleServiceBookSelection(bot, chatId, messageId, data);
  } else if (data === 'back_to_service') {
    await handleBookService(bot, chatId, messageId);
  } else if (data.startsWith('date_')) {
    await handleDateSelection(bot, chatId, messageId, data);
  } else if (data === 'back_to_date') {
    await handleBackToDate(bot, chatId, messageId, 0);
  } else if (data.startsWith('master_')) {
    await handleMasterSelection(bot, chatId, messageId, data);
  } else if (data.startsWith('back_to_master')) {
    await handleBackToMaster(bot, chatId, messageId);
  } else if (data.startsWith('time_')) {
    await handleTimeSelection(bot, chatId, messageId, data);
  } else if (data.startsWith('back_to_time')) {
    await handleBackToTime(bot, chatId, messageId);
  } else if (data.startsWith('next_week_')) {
    await handleBackToDate(
      bot,
      chatId,
      messageId,
      parseInt(data.split('_')[2]),
    );
  } else if (data.startsWith('prev_week_')) {
    await handleBackToDate(
      bot,
      chatId,
      messageId,
      parseInt(data.split('_')[2]),
    );
  } else if (data === 'book_approve') {
    await handleSigningSelection(bot, chatId, messageId);
  }
};

const bookCommand = async (bot: TelegramBot, msg: Message) => {
  const chatId = msg.chat.id;
  const { id: telegramId } = msg.from || {};

  if (telegramId) {
    try {
      const { data: user } = await customFetch(
        '/telegram-users/telegramId/' + telegramId,
      );
      const initialState = {
        user,
        service: null,
        master: null,
        date: '',
        time: '',
      };

      setUserState(chatId, initialState);
      await handleBookService(bot, chatId);
    } catch (error) {
      console.error('error', error);
    }
  }
};

export default bookCommand;
