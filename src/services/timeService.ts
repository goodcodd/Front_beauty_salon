import TelegramBot from 'node-telegram-bot-api';

import { getUserState, updateUserState } from '../state/userState';
import { generateTimeMenu } from '../utils/menus';
import i18n from '../config/i18n';

export const handleTimeSelection = async (
  bot: TelegramBot,
  chatId: number,
  messageId: number,
  data: string,
) => {
  try {
    const userState = getUserState(chatId);

    if (!userState) {
      await bot.sendMessage(chatId, i18n.t('userStateError'));
      return;
    }

    const time = data.split('time_')[1];
    updateUserState(chatId, { time });

    const { service, date, master } = userState;

    if (!service || !date || !master) {
      await bot.sendMessage(chatId, i18n.t('incompleteBookingDetails'));
      return;
    }

    await bot.editMessageText(
      i18n.t('recordDetails', {
        service: service.name,
        master: master.name,
        date,
        time,
      }),
      {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: {
          inline_keyboard: [
            [
              { text: i18n.t('back'), callback_data: 'back_to_time' },
              { text: i18n.t('confirm'), callback_data: 'book_approve' },
            ],
          ],
        },
      },
    );
  } catch (error) {
    console.error('Error handling time selection:', error);
    await bot.sendMessage(chatId, i18n.t('selectError'));
  }
};

export const handleBackToTime = async (
  bot: TelegramBot,
  chatId: number,
  messageId: number,
) => {
  try {
    const userState = getUserState(chatId);

    if (!userState?.service || !userState?.master) {
      await bot.sendMessage(chatId, i18n.t('userStateError'));
      return;
    }

    const menu = generateTimeMenu(userState.service.duration);
    await bot.editMessageText(
      i18n.t('masterSelected', { master: userState.master.name }),
      {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: menu.reply_markup,
      },
    );
  } catch (error) {
    console.error('Error handling back to time selection:', error);
    await bot.sendMessage(chatId, i18n.t('selectError'));
  }
};
