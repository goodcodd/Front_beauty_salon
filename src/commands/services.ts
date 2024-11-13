import TelegramBot, { Message } from 'node-telegram-bot-api';
import i18n from '../config/i18n';

const servicesCommand = async (bot: TelegramBot, msg: Message) => {
  const chatId = msg.chat.id;
  const imagePath = './src/assets/price_list.jpg';

  try {
    await bot.sendPhoto(chatId, imagePath, { caption: i18n.t('priceListCaption') || '' }, { contentType: 'image/jpeg' });
  } catch (error) {
    console.error('Error sending photo:', error);
    await bot.sendMessage(chatId, i18n.t('priceListError'));
  }
};

export default servicesCommand;
