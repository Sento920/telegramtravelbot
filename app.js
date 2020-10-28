const TelegramBot = require('node-telegram-bot-api');
const wiki = require('wikijs').default;
var config = require('./config');
var fs = require('fs');


// replace the value below with the Telegram token you receive from @BotFather
const token = config.telegrambotid;
const bot = new TelegramBot(token, {polling: true});
var msgId = '0';
const save_to_file = true;

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {
  const chatId = config.chatid;
  msgId = msg.chat.id; // Set global Telegram ID we can pass along the data process.
  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, 'Input Received, ' + msg.chat.first_name + '.');
  if(msg.chat.id = config.chatid){
    bot.sendMessage(chatId, 'Processing Input, looking for : \"' + msg.text + '\".');
    GatherData(msg.text, msgId);
  } else {
    bot.sendMessage(msg.chat.id, 'Identity not verified by developer. Ignoring Request.');
  }
});


function GatherData(input, msgId){ // Here will be where we parse the data and hand off to the wikipedia library.
  console.log('\nIncoming data: ' + input);
  wiki().page(input).then(
    function resolve(page){ //RESOLVE: Process Data.
      var promises = [];
      promises.push(page.summary());
      promises.push(page.content());
      promises.push(page.coordinates());
      Promise.all(promises).then(values => {
        if(save_to_file){
          var filename = "./saved_data/" + input + ".txt";
          fs.writeFile( filename, JSON.stringify(values), function (err) {
            if (err) throw err;
            console.log('Saved to ' + filename);
          });
        }


      });
    }, 
    function reject(){ // Reject: We spit the user an error message, and let them handle it.
      console.log('Rejected');
      bot.sendMessage(msgId, 'We didn\'t find an article for ' + input + '. Please Try a new search. ');
    });

}

