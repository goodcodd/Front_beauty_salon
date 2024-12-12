import TelegramBot from 'node-telegram-bot-api';

import { getUserState, updateUserState } from '../state/userState';
import i18n from '../config/i18n';
import { generateMasterMenu, generateTimeMenu } from '../utils/menus';
import customFetch from '../utils/customFetch';
import qs from 'qs';

const parseMasterPhoto = async (url: string) => {
  try {
    const photoUrl = `${process.env.API_BASE}${url}`;
    const response = await fetch(photoUrl);
    console.log('photoUrl', photoUrl);
    console.log('response', response);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer)
  } catch (error) {
    console.error('Error sending photo to Telegram:', error);
  }
};

export const fetchMasterById = async (
  masterId: string,
  locale: string = 'en',
) => {
  const str = qs.stringify(
    {
      populate: ['photo'],
      locale,
    },
    { addQueryPrefix: true },
  );
  const { data } = await customFetch(`/masters/${masterId}${str}`);

  return data;
};

export const handleMasterSelection = async (
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

    const masterId = data.split('master_')[1];
    const master = await fetchMasterById(masterId, i18n.language);

    if (!master) {
      await bot.sendMessage(chatId, i18n.t('masterFoundError'));
      return;
    }

    updateUserState(chatId, { master });

    await bot.editMessageText(
      i18n.t('masterSelected', { master: master.name }),
      {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: generateTimeMenu(userState.service.duration).reply_markup,
      },
    );
  } catch (error) {
    console.error('Error handling master selection:', error);
    await bot.sendMessage(chatId, i18n.t('selectError'));
  }
};

export const handleBackToMaster = async (
  bot: TelegramBot,
  chatId: number,
  messageId: number,
) => {
  const userState = getUserState(chatId);

  if (!userState?.service) {
    await bot.sendMessage(chatId, i18n.t('userStateError'));
    return;
  }

  const menu = await generateMasterMenu(
    userState.service.id,
    true,
    i18n.language,
  );

  await bot.editMessageText(i18n.t('dateSelected', { date: userState.date }), {
    chat_id: chatId,
    message_id: messageId,
    reply_markup: menu.reply_markup,
  });
};

export const handleMasterMasterSelection = async (
  bot: TelegramBot,
  chatId: number,
  messageId: number,
  data: string,
) => {
  try {
    const masterId = data.split('masters_master_')[1];
    const master = await fetchMasterById(masterId, i18n.language);

    if (!master) {
      await bot.sendMessage(chatId, i18n.t('masterFoundError'));
      return;
    }
    const photo = await parseMasterPhoto(master.photo.url);
    if (photo) {
      await bot.deleteMessage(chatId, messageId);
      await bot.sendPhoto(
        chatId,
        photo,
        { caption: master.description },
        { contentType: master.photo.mime },
      );
    }
  } catch (error) {
    console.error('Error handling master selection:', error);
    await bot.sendMessage(chatId, i18n.t('selectError'));
  }
};
