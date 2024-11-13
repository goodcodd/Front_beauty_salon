import TelegramBot, { Message } from 'node-telegram-bot-api';

import i18n from '../config/i18n';
import contacts from '../mocks/contacts';

const contactsCommand = async (bot: TelegramBot, msg: Message) => {
  const chatId = msg.chat.id;
  const contactInfo = i18n.t('contactsInfo', {
    schedule: contacts.schedule,
    address: contacts.address,
    phone: contacts.phone,
    email: contacts.email
  });
  
  await bot.sendMessage(chatId, contactInfo);
};

export default contactsCommand;
