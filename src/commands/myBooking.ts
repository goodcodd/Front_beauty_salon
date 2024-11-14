import TelegramBot, { Message } from 'node-telegram-bot-api';
import moment from 'moment';

import { handleCancelBooking } from '../services/bookingService';
import i18n from '../config/i18n';
import customFetch from '../utils/customFetch';
import qs from 'qs';
import { getUserState } from '../state/userState';

export const handleBookCancelCallbackQuery = async (
  bot: TelegramBot,
  callbackQuery: TelegramBot.CallbackQuery,
) => {
  const chatId = callbackQuery.message?.chat.id;
  const messageId = callbackQuery.message?.message_id;
  const data = callbackQuery.data;

  if (!chatId || !messageId || !data) return;

  if (data.startsWith('cancel_booking_')) {
    await handleCancelBooking(bot, callbackQuery);
  }
};

const myBookingCommand = async (bot: TelegramBot, msg: Message) => {
  const chatId = msg.chat.id;
  const { id: telegramId } = msg.from || {};

  if (telegramId) {
    try {
      const userState = getUserState(chatId);

      if (!userState) {
        await bot.sendMessage(chatId, i18n.t('booking.userNotFound'));
        return;
      }

      const str = qs.stringify(
        {
          filters: {
            chat_id: chatId,
          },
          populate: ['master', 'service'],
        },
        { addQueryPrefix: true },
      );

      const { data } = await customFetch(`/bookings${str}`);

      if (data?.length) {
        const promises = data.map(
          (booking: {
            datetime: string;
            time: string;
            id: number;
            documentId: string;
            master: { name: string };
            service: { name: string };
          }) => {
            const date = moment(booking.datetime).format('YYYY-MM-DD');
            const time = moment(booking.datetime).format('HH:mm:ss');

            const bookingDetails = `
            ${i18n.t('booking.yourBooking')}
            - ${i18n.t('booking.date')}: ${date}
            - ${i18n.t('booking.time')}: ${time}
            - ${i18n.t('booking.master')}: ${booking.master.name}
            - ${i18n.t('booking.service')}: ${booking.service.name}
            - ${i18n.t('booking.bookingId')}: ${booking.id}
          `;
            const options = {
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: i18n.t('booking.cancelButton'),
                      callback_data: `cancel_booking_${booking.documentId}`,
                    },
                  ],
                ],
              },
            };

            return bot.sendMessage(chatId, bookingDetails, options);
          },
        );

        await Promise.all(promises);
      } else {
        await bot.sendMessage(chatId, i18n.t('booking.noBooking'));
      }
    } catch (error) {
      console.error('Error retrieving booking information:', error);
      await bot.sendMessage(chatId, i18n.t('booking.error'));
    }
  } else {
    await bot.sendMessage(chatId, i18n.t('booking.userNotFound'));
  }
};

export default myBookingCommand;
