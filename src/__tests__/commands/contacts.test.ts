import TelegramBot, { Message } from 'node-telegram-bot-api';

import i18n from '../../config/i18n';
import contacts from '../../mocks/contacts';
import contactsCommand from '../../commands/contacts';

jest.mock('../../config/i18n', () => ({
  t: jest.fn().mockReturnValue('Contact information'),
}));

describe('contactsCommand', () => {
  let bot: jest.Mocked<TelegramBot>;
  let msg: Message;

  beforeEach(() => {
    bot = {
      sendMessage: jest.fn(),
    } as unknown as jest.Mocked<TelegramBot>;

    msg = {
      chat: { id: 12345 },
    } as Message;
  });

  it('should send contact information message', async () => {
    await contactsCommand(bot, msg);

    expect(i18n.t).toHaveBeenCalledWith('contactsInfo', {
      schedule: contacts.schedule,
      address: contacts.address,
      phone: contacts.phone,
      email: contacts.email,
    });
    expect(bot.sendMessage).toHaveBeenCalledWith(
      msg.chat.id,
      'Contact information',
    );
  });

  it('should handle errors in sendMessage gracefully', async () => {
    bot.sendMessage.mockRejectedValueOnce(new Error('Failed to send message'));

    await expect(contactsCommand(bot, msg)).rejects.toThrow(
      'Failed to send message',
    );
    expect(bot.sendMessage).toHaveBeenCalledWith(
      msg.chat.id,
      'Contact information',
    );
  });
});
