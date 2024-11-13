import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';

dotenv.config();

import routes from './routes';

const bot = new TelegramBot(process.env.BOT_TOKEN || '', { polling: true });

bot.setMyCommands([
  { command: '/start', description: 'start' },
  { command: '/book', description: 'Book a service' },
  { command: '/my_booking', description: 'Get my current booking' },
  { command: '/services', description: 'Price list for services' },
  { command: '/masters', description: 'List info about masters' },
  { command: '/language', description: 'Change the language' },
  { command: '/contacts', description: 'Get salon working hours, address, and contact details' },
]);

routes(bot);

export default bot;
