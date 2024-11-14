import TelegramBot from 'node-telegram-bot-api';

import {
  handleDateSelection,
  handleBackToDate,
} from '../../services/dateService';
import i18n from '../../config/i18n';
import { getUserState, updateUserState } from '../../state/userState';
import { generateDateMenu, generateMasterMenu } from '../../utils/menus';

jest.mock('../../state/userState');
jest.mock('../../utils/menus');

describe('handleDateSelection', () => {
  let bot: TelegramBot;
  let sendMessageMock: jest.Mock;
  let editMessageTextMock: jest.Mock;

  beforeEach(() => {
    bot = new TelegramBot('test-token', { polling: false });
    sendMessageMock = jest.fn();
    editMessageTextMock = jest.fn();
    bot.sendMessage = sendMessageMock;
    bot.editMessageText = editMessageTextMock;
  });

  it('should send an error message if user state is missing or incomplete', async () => {
    (getUserState as jest.Mock).mockReturnValue(undefined);

    await handleDateSelection(bot, 123, 456, 'date_2024-10-12');

    expect(sendMessageMock).toHaveBeenCalledWith(123, i18n.t('userStateError'));
  });

  it('should update user state and edit message with master menu', async () => {
    (getUserState as jest.Mock).mockReturnValue({
      user: { id: 1, name: 'Test User' },
      service: { id: 1, name: 'Service 1', duration: 30 },
      master: null,
      date: '',
      time: '',
    });
    (generateMasterMenu as jest.Mock).mockResolvedValue({
      reply_markup: { inline_keyboard: [] },
    });

    await handleDateSelection(bot, 123, 456, 'date_2024-10-12');

    expect(updateUserState).toHaveBeenCalledWith(123, { date: '2024-10-12' });
    expect(editMessageTextMock).toHaveBeenCalledWith(
      i18n.t('dateSelected', { date: '2024-10-12' }),
      {
        chat_id: 123,
        message_id: 456,
        reply_markup: { inline_keyboard: [] },
      },
    );
  });

  it('should send an error message if there is an exception', async () => {
    (getUserState as jest.Mock).mockReturnValue({
      user: { id: 1, name: 'Test User' },
      service: { id: 1, name: 'Service 1', duration: 30 },
      master: null,
      date: '',
      time: '',
    });
    (generateMasterMenu as jest.Mock).mockRejectedValue(
      new Error('Menu Error'),
    );

    await handleDateSelection(bot, 123, 456, 'date_2024-10-12');

    expect(sendMessageMock).toHaveBeenCalledWith(123, i18n.t('selectError'));
  });
});

describe('handleBackToDate', () => {
  let bot: TelegramBot;
  let sendMessageMock: jest.Mock;
  let editMessageTextMock: jest.Mock;

  beforeEach(() => {
    bot = new TelegramBot('test-token', { polling: false });
    sendMessageMock = jest.fn();
    editMessageTextMock = jest.fn();
    bot.sendMessage = sendMessageMock;
    bot.editMessageText = editMessageTextMock;
  });

  it('should send an error message if user state is missing or incomplete', async () => {
    (getUserState as jest.Mock).mockReturnValue(undefined);

    await handleBackToDate(bot, 123, 456, 0);

    expect(sendMessageMock).toHaveBeenCalledWith(123, i18n.t('userStateError'));
  });

  it('should edit message with date menu', async () => {
    (getUserState as jest.Mock).mockReturnValue({
      user: { id: 1, name: 'Test User' },
      service: { id: 1, name: 'Service 1', duration: 30 },
      master: null,
      date: '',
      time: '',
    });
    (generateDateMenu as jest.Mock).mockReturnValue({
      reply_markup: { inline_keyboard: [] },
    });

    await handleBackToDate(bot, 123, 456, 1);

    expect(editMessageTextMock).toHaveBeenCalledWith(
      i18n.t('serviceSelected', { service: 'Service 1' }),
      {
        chat_id: 123,
        message_id: 456,
        reply_markup: { inline_keyboard: [] },
      },
    );
  });
});
