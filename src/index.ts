import TelegramBot from 'node-telegram-bot-api';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

import routes from './routes';

const bot = new TelegramBot(process.env.BOT_TOKEN || '', { polling: true });
const app = express();

app.use(express.json());

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

app.get('/', (req, res) => {
  res.send('Привет, Vercel с TypeScript!');
});

app.post(`/bot${process.env.BOT_TOKEN}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

export default bot;
