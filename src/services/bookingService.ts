import TelegramBot from "node-telegram-bot-api";

import i18n from "../config/i18n";
import customFetch from "../utils/customFetch";

export const cancelBooking = async (bookingId: string): Promise<boolean> => {
  try {
    const { data } = await customFetch(`/bookings/${bookingId}`, { method: 'DELETE' });
    return data;
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return false;
  }
};

export const handleCancelBooking = async (bot: TelegramBot, callbackQuery: TelegramBot.CallbackQuery) => {
  const chatId = callbackQuery.message?.chat.id!;
  const messageId = callbackQuery.message?.message_id!;
  const data = callbackQuery.data!;

  const bookingId = data.split('cancel_booking_')[1];

  try {
    const result = await cancelBooking(bookingId);
    
    if (result) {
      await bot.editMessageText(i18n.t('booking.canceled'), {
        chat_id: chatId,
        message_id: messageId,
      });
    } else {
      await bot.sendMessage(chatId, i18n.t('booking.cancelError'));
    }
  } catch (error) {
    console.error('Error canceling booking:', error);
    await bot.sendMessage(chatId, i18n.t('booking.cancelError'));
  }
};
