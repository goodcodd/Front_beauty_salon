import TelegramBot, { Message, CallbackQuery } from 'node-telegram-bot-api';

import { handleMasterService, handleServiceMasterSelection } from "../../services/serviceService";
import { handleMasterMasterSelection } from "../../services/masterService";
import mastersCommand, { handleMatersCallbackQuery } from '../../commands/masters';

jest.mock('../../services/serviceService', () => ({
  handleMasterService: jest.fn(),
  handleServiceMasterSelection: jest.fn(),
}));
jest.mock('../../services/masterService', () => ({
  handleMasterMasterSelection: jest.fn(),
}));

describe('handleMatersCallbackQuery', () => {
  let bot: jest.Mocked<TelegramBot>;
  let callbackQuery: CallbackQuery;
  
  beforeEach(() => {
    jest.clearAllMocks();

    bot = {} as jest.Mocked<TelegramBot>;

    callbackQuery = {
      message: { chat: { id: 12345 }, message_id: 67890 },
      data: '',
    } as CallbackQuery;
  });
  
  it('should call handleServiceMasterSelection when data starts with "masters_service_"', async () => {
    callbackQuery.data = 'masters_service_1';
    
    await handleMatersCallbackQuery(bot, callbackQuery);

    expect(handleServiceMasterSelection).toHaveBeenCalledWith(
      bot,
      12345,
      67890,
      'masters_service_1'
    );
    expect(handleMasterMasterSelection).not.toHaveBeenCalled();
  });
  
  it('should call handleMasterMasterSelection when data starts with "masters_master_"', async () => {
    callbackQuery.data = 'masters_master_1';
    
    await handleMatersCallbackQuery(bot, callbackQuery);
    
    expect(handleMasterMasterSelection).toHaveBeenCalledWith(
      bot,
      12345,
      67890,
      'masters_master_1'
    );
    expect(handleServiceMasterSelection).not.toHaveBeenCalled();
  });
  
  it('should not call any functions if chatId, messageId, or data are missing', async () => {
    callbackQuery.message = undefined;
    await handleMatersCallbackQuery(bot, callbackQuery);

    expect(handleServiceMasterSelection).not.toHaveBeenCalled();
    expect(handleMasterMasterSelection).not.toHaveBeenCalled();
  });
});

describe('mastersCommand', () => {
  let bot: jest.Mocked<TelegramBot>;
  let msg: Message;
  
  beforeEach(() => {
    bot = {} as jest.Mocked<TelegramBot>;
    
    msg = {
      chat: { id: 12345 },
    } as Message;
  });
  
  it('should call handleMasterService with correct chatId', async () => {
    await mastersCommand(bot, msg);
    
    expect(handleMasterService).toHaveBeenCalledWith(bot, 12345);
  });
});
