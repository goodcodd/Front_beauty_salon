import TelegramBot from 'node-telegram-bot-api';

import { getUserState, updateUserState } from '../state/userState';
import { generateDateMenu, generateMasterMenu } from '../utils/menus';
import i18n from '../config/i18n';

export const handleDateSelection = async (
  bot: TelegramBot,
  chatId: number,
  messageId: number,
  data: string,
) => {
  try {
    const userState = getUserState(chatId);

    if (!userState?.service) {
      await bot.sendMessage(chatId, i18n.t('userStateError'));
      return;
    }

    const date = data.split('date_')[1];
    updateUserState(chatId, { date });

    const menu = await generateMasterMenu(
      userState.service.id,
      true,
      i18n.language,
    );

    await bot.editMessageText(i18n.t('dateSelected', { date }), {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: menu.reply_markup,
    });
  } catch (error) {
    console.error('Error handling date selection:', error);
    await bot.sendMessage(chatId, i18n.t('selectError'));
  }
};

export const handleBackToDate = async (
  bot: TelegramBot,
  chatId: number,
  messageId: number,
  weekOffset: number,
) => {
  const userState = getUserState(chatId);

  if (!userState?.service) {
    await bot.sendMessage(chatId, i18n.t('userStateError'));
    return;
  }

  await bot.editMessageText(
    i18n.t('serviceSelected', { service: userState.service.name }),
    {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: generateDateMenu(weekOffset).reply_markup,
    },
  );
};
