import TelegramBot from 'node-telegram-bot-api';

import { handleSigningSelection } from '../../services/approveService';
import i18n from '../../config/i18n';
import { getUserState } from '../../state/userState';

jest.mock('../../state/userState');

describe('handleSigningSelection', () => {
  let bot: TelegramBot;
  let sendMessageMock: jest.Mock;
  let deleteMessageMock: jest.Mock;

  beforeEach(() => {
    bot = new TelegramBot('test-token', { polling: false });
    sendMessageMock = jest.fn();
    deleteMessageMock = jest.fn();
    bot.sendMessage = sendMessageMock;
    bot.deleteMessage = deleteMessageMock;
  });

  it('should send an error message if user state is missing', async () => {
    (getUserState as jest.Mock).mockReturnValue(undefined);

    await handleSigningSelection(bot, 123, 456);

    expect(sendMessageMock).toHaveBeenCalledWith(123, i18n.t('userStateError'));
  });

  it('should send an error message if user state is incomplete', async () => {
    (getUserState as jest.Mock).mockReturnValue({
      user: { id: 1, name: 'Test User' },
      service: null,
      master: null,
      date: '',
      time: '',
    });

    await handleSigningSelection(bot, 123, 456);

    expect(sendMessageMock).toHaveBeenCalledWith(123, i18n.t('userStateError'));
  });
});
