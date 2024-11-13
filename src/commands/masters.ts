import TelegramBot, { Message } from 'node-telegram-bot-api';

import { handleMasterService, handleServiceMasterSelection } from "../services/serviceService";
import { handleMasterMasterSelection } from "../services/masterService";

export const handleMatersCallbackQuery = async (bot: TelegramBot, callbackQuery: TelegramBot.CallbackQuery) => {
  const chatId = callbackQuery.message?.chat.id;
  const messageId = callbackQuery.message?.message_id;
  const data = callbackQuery.data;

  if (!chatId || !messageId || !data) return;

  if (data.startsWith('masters_service_')) {
    await handleServiceMasterSelection(bot, chatId, messageId, data);
  } else if (data.startsWith('masters_master_')) {
    await handleMasterMasterSelection(bot, chatId, messageId, data)
  }
};

const mastersCommand = async (bot: TelegramBot, msg: Message) => {
  const chatId = msg.chat.id;

  await handleMasterService(bot, chatId);
};

export default mastersCommand;
