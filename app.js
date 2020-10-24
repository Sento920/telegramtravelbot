const TelegramBot = require('node-telegram-bot-api');
const wiki = require('wikijs').default;
var config = require('./config');
var parseInfo = require("infobox-parser");


// replace the value below with the Telegram token you receive from @BotFather
const token = config.telegrambotid;
const bot = new TelegramBot(token, {polling: true});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {
  const chatId = config.chatid;
  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, 'Input Received, ' + msg.chat.first_name + '.');
  if(msg.chat.id = config.chatid){
    bot.sendMessage(chatId, 'Processing Input, looking for : \"' + msg.text + '\".');
    ProcessData(msg.text);
  } else {
    bot.sendMessage(msg.chat.id, "Identity not verified by developer. Ignoring Request.");
  }

});


function ProcessData(data){ // Here will be where we parse the data and hand off to the wikipedia library.
  console.log('data: ' + data);
  wiki()
    .page(data)
    .then(page => page.info('alterEgo'))
    .then(console.log); // Bruce Wayne
}

