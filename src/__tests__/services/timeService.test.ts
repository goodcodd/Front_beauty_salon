import TelegramBot from 'node-telegram-bot-api';

import {
  handleTimeSelection,
  handleBackToTime,
} from '../../services/timeService';
import i18n from '../../config/i18n';
import { getUserState, updateUserState } from '../../state/userState';
import { generateTimeMenu } from '../../utils/menus';

jest.mock('../../state/userState');
jest.mock('../../utils/menus');

describe('handleTimeSelection', () => {
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

  it('should send an error message if user state is missing', async () => {
    (getUserState as jest.Mock).mockReturnValue(undefined);

    await handleTimeSelection(bot, 123, 456, 'time_10:00');

    expect(sendMessageMock).toHaveBeenCalledWith(123, i18n.t('userStateError'));
  });

  it('should update user state and edit message with booking details', async () => {
    (getUserState as jest.Mock).mockReturnValue({
      user: { id: 1, name: 'Test User' },
      service: { id: 1, name: 'Service 1', duration: 30 },
      master: { id: 1, name: 'Master 1' },
      date: '2024-10-12',
      time: '',
    });

    await handleTimeSelection(bot, 123, 456, 'time_10:00');

    expect(updateUserState).toHaveBeenCalledWith(123, { time: '10:00' });
    expect(editMessageTextMock).toHaveBeenCalledWith(
      'Record details:\nService: Service 1\nMaster: Master 1\nDate: 2024-10-12\nTime: 10:00',
      {
        chat_id: 123,
        message_id: 456,
        reply_markup: {
          inline_keyboard: [
            [
              { text: i18n.t('back'), callback_data: 'back_to_time' },
              { text: i18n.t('confirm'), callback_data: 'book_approve' },
            ],
          ],
        },
      },
    );
  });

  it('should send an error message if booking details are incomplete', async () => {
    (getUserState as jest.Mock).mockReturnValue({
      user: { id: 1, name: 'Test User' },
      service: null,
      master: null,
      date: '',
      time: '',
    });

    await handleTimeSelection(bot, 123, 456, 'time_10:00');

    expect(sendMessageMock).toHaveBeenCalledWith(
      123,
      i18n.t('incompleteBookingDetails'),
    );
  });

  it('should send an error message if there is an exception', async () => {
    (getUserState as jest.Mock).mockReturnValue({
      user: { id: 1, name: 'Test User' },
      service: { id: 1, name: 'Service 1', duration: 30 },
      master: { id: 1, name: 'Master 1' },
      date: '2024-10-12',
      time: '',
    });
    (updateUserState as jest.Mock).mockImplementation(() => {
      throw new Error('Update Error');
    });

    await handleTimeSelection(bot, 123, 456, 'time_10:00');

    expect(sendMessageMock).toHaveBeenCalledWith(123, i18n.t('selectError'));
  });
});

describe('handleBackToTime', () => {
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

    await handleBackToTime(bot, 123, 456);

    expect(sendMessageMock).toHaveBeenCalledWith(123, i18n.t('userStateError'));
  });

  it('should edit message with time menu if user state is valid', async () => {
    (getUserState as jest.Mock).mockReturnValue({
      user: { id: 1, name: 'Test User' },
      service: { id: 1, name: 'Service 1', duration: 30 },
      master: { id: 1, name: 'Master 1' },
      date: '2024-10-12',
      time: '10:00',
    });
    (generateTimeMenu as jest.Mock).mockReturnValue({
      reply_markup: { inline_keyboard: [] },
    });

    await handleBackToTime(bot, 123, 456);

    expect(editMessageTextMock).toHaveBeenCalledWith(
      i18n.t('masterSelected', { master: 'Master 1' }),
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
      master: { id: 1, name: 'Master 1' },
      date: '2024-10-12',
      time: '10:00',
    });
    (generateTimeMenu as jest.Mock).mockImplementation(() => {
      throw new Error('Menu Error');
    });

    await handleBackToTime(bot, 123, 456);

    expect(sendMessageMock).toHaveBeenCalledWith(123, i18n.t('selectError'));
  });
});
