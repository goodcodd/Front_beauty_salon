import TelegramBot from 'node-telegram-bot-api';

import { updateUserState } from '../state/userState';
import { generateDateMenu, generateServiceMenu } from '../utils/menus';
import i18n from '../config/i18n';
import customFetch from '../utils/customFetch';
import qs from 'qs';

export const fetchServiceById = async (
  serviceId: string,
  locale: string = 'en',
) => {
  const { data } = await customFetch(`/services/${serviceId}?locale=${locale}`);

  return data;
};

export const handleServiceBookSelection = async (
  bot: TelegramBot,
  chatId: number,
  messageId: number,
  data: string,
) => {
  try {
    const serviceId = data.split('service_')[1];
    const service = await fetchServiceById(serviceId, i18n.language);

    if (!service) {
      await bot.sendMessage(chatId, i18n.t('serviceFoundError'));
      return;
    }

    updateUserState(chatId, { service });

    await bot.editMessageText(
      i18n.t('serviceSelected', { service: service.name }),
      {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: generateDateMenu().reply_markup,
      },
    );
  } catch (error) {
    console.error('Error handling service selection:', error);
    await bot.sendMessage(chatId, i18n.t('selectError'));
  }
};

export const handleBookService = async (
  bot: TelegramBot,
  chatId: number,
  messageId?: number,
) => {
  try {
    await bot.sendChatAction(chatId, 'typing');
    const menu = await generateServiceMenu(i18n.language);

    if (messageId) {
      await bot.editMessageText(i18n.t('selectService'), {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: menu.reply_markup,
      });
    } else {
      await bot.sendMessage(chatId, i18n.t('selectService'), menu);
    }
  } catch (error) {
    console.error('Error generating service menu:', error);
    await bot.sendMessage(chatId, i18n.t('menuLoadError'));
  }
};

export const handleMasterService = async (bot: TelegramBot, chatId: number) => {
  try {
    const { data } = await customFetch(`/services?locale=${i18n.language}`);

    const menu = data.map((service: { name: string; id: number }) => [
      { text: service.name, callback_data: `masters_service_${service.id}` },
    ]);

    await bot.sendMessage(chatId, i18n.t('selectService'), {
      reply_markup: {
        inline_keyboard: menu,
      },
    });
  } catch (error) {
    console.error('Error generating service menu:', error);
    await bot.sendMessage(chatId, i18n.t('menuLoadError'));
  }
};

export const handleServiceMasterSelection = async (
  bot: TelegramBot,
  chatId: number,
  messageId: number,
  data: string,
) => {
  try {
    const serviceId = data.split('masters_service_')[1];
    const service = await fetchServiceById(serviceId, i18n.language);

    if (!service) {
      await bot.sendMessage(chatId, i18n.t('serviceFoundError'));
      return;
    }

    const body = qs.stringify({
      filters: {
        service: serviceId,
      },
      locale: i18n.language,
    });
    const { data: masters } = await customFetch('/masters', { body });
    const inlineKeyboard = masters.map(
      (master: { id: number; name: string }) => [
        { text: master.name, callback_data: `masters_master_${master.id}` },
      ],
    );

    await bot.editMessageText(
      i18n.t('master.serviceSelected', { service: service.name }),
      {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: {
          inline_keyboard: inlineKeyboard,
        },
      },
    );
  } catch (error) {
    console.error('Error handling service selection:', error);
    await bot.sendMessage(chatId, i18n.t('selectError'));
  }
};
