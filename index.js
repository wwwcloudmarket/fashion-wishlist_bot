require('dotenv').config();  // Загружаем переменные окружения
const express = require('express');
const { Telegraf } = require('telegraf');
const app = express();
const port = process.env.PORT || 3000;

// Инициализация Telegram-бота
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Подключение к базе данных (например, PostgreSQL)
const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL
});

client.connect()
  .then(() => console.log('Connected to the database'))
  .catch((err) => console.error('Connection error', err.stack));

// Приветственное сообщение для пользователей
bot.start((ctx) => {
  ctx.reply('Привет! Я помогу создать твой wishlist.');
});

// Логика добавления товара в wishlist
bot.command('add', (ctx) => {
  const item = ctx.message.text.split(' ').slice(1).join(' ');  // Берем название товара после команды /add
  if (item) {
    const userId = ctx.from.id;
    // Добавление товара в базу данных
    client.query('INSERT INTO wishlist (user_id, item) VALUES ($1, $2)', [userId, item])
      .then(() => ctx.reply(`Товар "${item}" добавлен в твой wishlist!`))
      .catch((err) => ctx.reply(`Ошибка при добавлении товара: ${err.message}`));
  } else {
    ctx.reply('Укажите товар для добавления в wishlist.');
  }
});

// Команда для отображения wishlist пользователя
bot.command('wishlist', (ctx) => {
  const userId = ctx.from.id;
  client.query('SELECT * FROM wishlist WHERE user_id = $1', [userId])
    .then((res) => {
      if (res.rows.length === 0) {
        ctx.reply('Ваш wishlist пуст!');
      } else {
        const items = res.rows.map(row => row.item).join('\n');
        ctx.reply(`Ваш wishlist:\n${items}`);
      }
    })
    .catch((err) => ctx.reply(`Ошибка при получении wishlist: ${err.message}`));
});

// Запуск бота
bot.launch();

// API для отображения информации (например, для базы данных товаров)
app.get('/', (req, res) => {
  res.send('Fashion Wishlist API is running!');
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
