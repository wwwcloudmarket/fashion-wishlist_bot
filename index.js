// index.js
require('dotenv').config(); // Загружаем переменные окружения из .env
const express = require('express');
const { Telegraf } = require('telegraf');
const { Client } = require('pg'); // Если используем PostgreSQL (Supabase)

// Инициализация приложения
const app = express();
const port = process.env.PORT || 3000;

// Инициализация Telegram-бота
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply('Привет! Я помогу создать твой wishlist.');
});

bot.help((ctx) => {
  ctx.reply('Используй команды для взаимодействия.');
});

bot.launch();

// Настройка базы данных (если используется PostgreSQL)
const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect()
  .then(() => console.log('Connected to the database'))
  .catch((err) => console.error('Connection error', err.stack));

// Настройка API
app.get('/', (req, res) => {
  res.send('Hello from Fashion Wishlist Bot API!');
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
