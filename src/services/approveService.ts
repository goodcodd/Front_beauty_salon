import TelegramBot from "node-telegram-bot-api";
import moment from "moment/moment";

import { getUserState } from "../state/userState";
import i18n from "../config/i18n";
import customFetch from "../utils/customFetch";

export const handleSigningSelection = async (bot: TelegramBot, chatId: number, messageId: number) => {
  const userState = getUserState(chatId);

  if (!userState) {
    await bot.sendMessage(chatId, i18n.t('userStateError'));
    return;
  }

  const { service, user, date, master, time } = userState;

  if (!service || !master || !date || !time) {
    await bot.sendMessage(chatId, i18n.t('userStateError'));
    return;
  }

  const datetime = moment(`${date} ${time}`, 'DD-MM-YYYY HH:mm').toISOString();

  try {
    const isAvailable = await customFetch(`/bookings/available?masterId=${master.id}&datetime=${datetime}`);

    if (!isAvailable) {
      await bot.sendMessage(chatId, i18n.t('masterAlreadyBooked', { master: master.name, date, time }));
      return;
    }
    console.log(service, user, date, master, time)
    const { data, error } = await customFetch(`/bookings`, {
      method: 'POST',
      body: JSON.stringify({
        data: {
          chat_id: chatId,
          telegram_user: user.documentId,
          service: service.documentId,
          master: master.documentId,
          datetime,
        }
      }),
    });
    console.log('error', error);
    if (!data) {
      await bot.sendMessage(chatId, i18n.t('appointmentError'));
      return
    }
    await bot.deleteMessage(chatId, messageId);
    await bot.sendMessage(chatId, i18n.t('appointmentConfirmed', { service: service.name, master: master.name, date, time }));
  } catch (error) {
    console.log('error', error);
    await bot.sendMessage(chatId, i18n.t('appointmentError'));
  }
};
