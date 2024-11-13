import TelegramBot, { InlineKeyboardButton, Message } from 'node-telegram-bot-api';

import i18n from '../config/i18n';

export const languageOptions: { [key: string]: string } = {
  en: 'English',
  uk: 'Українська',
};

export const handleLanguageCallbackQuery = async (bot: TelegramBot, callbackQuery: TelegramBot.CallbackQuery) => {
  const chatId = callbackQuery.message?.chat.id;
  const messageId = callbackQuery.message?.message_id;
  const data = callbackQuery.data;
  
  if (!chatId || !messageId || !data) return;

  if (data && data.startsWith('set_lang_')) {
    const selectedLang = data.split('_')[2];

    if (languageOptions[selectedLang]) {
      await i18n.changeLanguage(selectedLang, async () => {
        bot.editMessageText(i18n.t('languageChanged', { language: languageOptions[selectedLang] }), {
          chat_id: chatId,
          message_id: callbackQuery.message?.message_id,
        });
      });
    }
  }
};

const languageCommand = async (bot: TelegramBot, msg: Message) => {
  const chatId = msg.chat.id;
  
  const buttons: InlineKeyboardButton[] = Object.keys(languageOptions).map((lang) => ({
    text: languageOptions[lang],
    callback_data: `set_lang_${lang}`
  }));

  await bot.sendMessage(chatId, i18n.t('selectLanguage'), {
    reply_markup: {
      inline_keyboard: [buttons]
    }
  });
};

export default languageCommand;
