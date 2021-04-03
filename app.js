const TelegramBot = require('node-telegram-bot-api');
const wiki = require('wikijs').default;
var config = require('./config');
var fs = require('fs');
var http = require('http');

// replace the value below with the Telegram token you receive from @BotFather
const token = config.telegrambotid;
const bot = new TelegramBot(token, {polling: true});
var msgId = '0';
var filepath;
var filename;

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
  var sanitized = folderize(input);
  filepath = "./saved_data/" + sanitized;
  filename =  "/" + sanitized + "_wiki_data.txt";
  var fullpath = filepath + filename;        
  getWikiData(input);
  //getGoogleData(input);
  ProcessPageData(fullpath);
}

function folderize(input){// regex for whitespace and symbol characters;
  return input.replace(/\W/g, ""); 
}

function getWikiData(input){
  wiki().page(input).then(
    function resolve(page){ //RESOLVE: Process Data.
      var promises = [];
      promises.push(page.summary());
      promises.push(page.content());
      promises.push(page.coordinates());
      Promise.all(promises).then(values => {
        if(config.save_to_file){
          fs.promises.mkdir(filepath, { recursive: true }).catch(console.error);
          fs.writeFile( filepath + filename, JSON.stringify(values), function (err) {
            if (err) throw err;
            console.log('Saved to ' + filename);
          });
        }else{
          //Print to console.
          console.log(JSON.stringify(values));
        }
      });
    }, 
    function reject(){ // Reject: We spit the user an error message, and let them handle it.
      console.log('Rejected');
      bot.sendMessage(msgId, 'We didn\'t find an article for ' + input + '. Please Try a new search. ');
    }
  );
}

function getGoogleData(input){
}


function ProcessPageData(filepath){
  //default Path: 
  var backup = '.\\saved_data\\RiverFallsWisconsin\\RiverFallsWisconsin_wiki_data.txt';
  if(filepath == ''){
    filepath = backup;
  }


  fs.readFile(filepath, 'utf8' , (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    // File is a saved JSON object, so Data should already be a parsed object.
    console.log("~Data~\n\n\n" + data);
  })
}