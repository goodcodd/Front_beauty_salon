import TelegramBot from 'node-telegram-bot-api';
import { VercelRequest, VercelResponse } from '@vercel/node';

import routes from './routes';
import { development, production } from './core';

const BOT_TOKEN = process.env.BOT_TOKEN || '';
const ENVIRONMENT = process.env.NODE_ENV || '';

const bot = new TelegramBot(BOT_TOKEN);

bot.setMyCommands([
  { command: '/start', description: 'start' },
  { command: '/book', description: 'Book a service' },
  { command: '/my_booking', description: 'Get my current booking' },
  { command: '/services', description: 'Price list for services' },
  { command: '/masters', description: 'List info about masters' },
  { command: '/language', description: 'Change the language' },
  {
    command: '/contacts',
    description: 'Get salon working hours, address, and contact details',
  },
]);

routes(bot);

//prod mode (Vercel)
export const startVercel = async (req: VercelRequest, res: VercelResponse) => {
  await production(req, res, bot);
};
//dev mode
ENVIRONMENT !== 'production' && development(bot);
