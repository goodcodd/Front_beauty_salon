import TelegramBot, { Message } from "node-telegram-bot-api";
import moment from "moment";

import { fetchServiceById } from "../services/serviceService";
import { fetchMasterById } from "../services/masterService";
import { handleCancelBooking } from "../services/bookingService";
import i18n from "../config/i18n";

export const handleBookCancelCallbackQuery = async (bot: TelegramBot, callbackQuery: TelegramBot.CallbackQuery) => {
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
    // try {
    //   const user = await findUserByTelegramId(telegramId);
    //
    //   if (!user) {
    //     await bot.sendMessage(chatId, i18n.t('booking.userNotFound'));
    //     return;
    //   }
    //
    //   const booking = await findBookingByUserId(user.id);
    //
    //   if (booking) {
    //     const master = await fetchMasterById(booking.master_id);
    //     const service = await fetchServiceById(booking.service_id);
    //     const formattedDate = moment(booking.date).format('YYYY-MM-DD');
    //
    //     const bookingDetails = `
    //       ${i18n.t('booking.yourBooking')}
    //       - ${i18n.t('booking.date')}: ${formattedDate}
    //       - ${i18n.t('booking.time')}: ${booking.time}
    //       - ${i18n.t('booking.master')}: ${master?.name || i18n.t('booking.noInfo')}
    //       - ${i18n.t('booking.service')}: ${service?.name || i18n.t('booking.noInfo')}
    //       - ${i18n.t('booking.bookingId')}: ${booking.id}
    //     `;
    //     const options = {
    //       reply_markup: {
    //         inline_keyboard: [
    //           [
    //             { text: i18n.t('booking.cancelButton'), callback_data: `cancel_booking_${booking.id}` }
    //           ]
    //         ]
    //       }
    //     };
    //
    //     await bot.sendMessage(chatId, bookingDetails, options);
    //   } else {
    //     await bot.sendMessage(chatId, i18n.t('booking.noBooking'));
    //   }
    // } catch (error) {
    //   console.error('Error retrieving booking information:', error);
    //   await bot.sendMessage(chatId, i18n.t('booking.error'));
    // }
  } else {
    await bot.sendMessage(chatId, i18n.t('booking.userNotFound'));
  }
};

export default myBookingCommand;
