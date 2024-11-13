import TelegramBot, { Message, CallbackQuery } from 'node-telegram-bot-api';
import i18n from '../../config/i18n';
import languageCommand, { handleLanguageCallbackQuery } from '../../commands/language';

jest.mock('../../config/i18n', () => ({
  t: jest.fn(),
  changeLanguage: jest.fn(),
}));

describe('handleLanguageCallbackQuery', () => {
  let bot: jest.Mocked<TelegramBot>;
  let callbackQuery: CallbackQuery;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    bot = {
      editMessageText: jest.fn(),
    } as unknown as jest.Mocked<TelegramBot>;
    
    callbackQuery = {
      message: { chat: { id: 12345 }, message_id: 67890 },
      data: 'set_lang_en',
    } as CallbackQuery;
    
    (i18n.changeLanguage as jest.Mock).mockImplementation((lang, callback) => callback());
  });
  
  it('should call i18n.changeLanguage with correct language code and edit message', async () => {
    (i18n.t as unknown as jest.Mock).mockReturnValueOnce('Language changed');
    
    await handleLanguageCallbackQuery(bot, callbackQuery);
    
    expect(i18n.changeLanguage).toHaveBeenCalledWith('en', expect.any(Function));
    expect(bot.editMessageText).toHaveBeenCalledWith('Language changed', {
      chat_id: 12345,
      message_id: 67890,
    });
  });
  
  it('should not call any functions if data is missing or does not start with "set_lang_"', async () => {
    callbackQuery.data = undefined;
    await handleLanguageCallbackQuery(bot, callbackQuery);
    
    expect(i18n.changeLanguage).not.toHaveBeenCalled();
    expect(bot.editMessageText).not.toHaveBeenCalled();
  });
});

describe('languageCommand', () => {
  let bot: jest.Mocked<TelegramBot>;
  let msg: Message;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    bot = {
      sendMessage: jest.fn(),
    } as unknown as jest.Mocked<TelegramBot>;
    
    msg = {
      chat: { id: 12345 },
    } as Message;
  });
  
  it('should send a message with language options', async () => {
    (i18n.t as unknown as jest.Mock).mockReturnValueOnce('Select your language');
    await languageCommand(bot, msg);
    
    expect(bot.sendMessage).toHaveBeenCalledWith(12345, 'Select your language', {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'English', callback_data: 'set_lang_en' },
            { text: 'Українська', callback_data: 'set_lang_ua' }
          ]
        ]
      }
    });
  });
});
