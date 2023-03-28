
const telegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options.js')
const token = '6060153895:AAE5xK8R17hMvfyw0vIJy97vnHvH378SkYM';

const bot = new telegramApi(token, {polling: true});

const chats = {}


const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9, а тебе нужно её угадать!')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Получить информацию о пользователе'},
        {command: '/game', description: 'Игра угадай цифру'},
    ])
    
    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
    
        if(text === '/start') {
            await bot.sendMessage(chatId, 'Добро пожаловать')
            return bot.sendSticker(chatId, 'https://chpic.su/_data/stickers/m/Myrvito/Myrvito_001.webp')
        }
        if(text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`);
        }
        if(text === '/game') {
            return startGame(chatId);
        }

        return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй ещё раз')
    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if(data === '/again') {
            return startGame(chatId);
        }
        
        if(+data === chats[chatId]) {
            return bot.sendMessage(chatId, `Поздравляю, ты отгадал(а) цифру ${chats[chatId]}`, againOptions)
        } else {
            return bot.sendMessage(chatId, `К сожалению ты не угадал(а), бот загадал цифру ${chats[chatId]}`, againOptions)
        }

    })
}

start()