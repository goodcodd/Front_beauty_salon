import TelegramBot from "node-telegram-bot-api";

import servicesCommand from "../../commands/services";
import i18n from "../../config/i18n";

jest.mock('../../db');
jest.mock('../../state/userState');

describe('servicesCommand', () => {
  let bot: TelegramBot;
  let sendPhotoMock: jest.Mock;
  let sendMessageMock: jest.Mock;
  
  beforeEach(() => {
    bot = new TelegramBot('test-token', { polling: false });
    sendPhotoMock = jest.fn();
    sendMessageMock = jest.fn();
    bot.sendPhoto = sendPhotoMock;
    bot.sendMessage = sendMessageMock;
  });
  
  it('should send a photo with the price list', async () => {
    const msg = {
      chat: {
        id: 123,
      },
    } as any;

    await servicesCommand(bot, msg);
    
    expect(sendPhotoMock).toHaveBeenCalledTimes(1);
    expect(sendPhotoMock).toHaveBeenCalledWith(123, './src/assets/price_list.jpg', {
      caption: i18n.t('priceListCaption') || '',
    }, {
      contentType: 'image/jpeg',
    });
  });
  
  it('should send an error message if there is an exception', async () => {
    const msg = {
      chat: {
        id: 123,
      },
    } as any;
    
    sendPhotoMock.mockRejectedValue(new Error('Photo Error'));

    await servicesCommand(bot, msg);
    
    expect(sendMessageMock).toHaveBeenCalledTimes(1);
    expect(sendMessageMock).toHaveBeenCalledWith(123, i18n.t('priceListError'));
  });
});
