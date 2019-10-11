const SpellChecker = require ('spellchecker');
const TeleBot = require('telebot');
const config = require('./config.js')

// Load Dictionary
//const dict = SpellChecker.getDictionarySync(config.lang)
const spellChecker = new SpellChecker.Spellchecker()

// Start the bot
const bot = new TeleBot(config.telegramSecret);
bot.on('text', checkSpell);
bot.start();

// Counters
let lastTimeMilis = 0
let mistakes = 0
const timeBetweenErrors = 10000 // 10s

function checkSpell(msg) {
    let words = msg.text.split(" ");
    let mistakes = SpellChecker.checkSpelling(msg.text)
    let corrections = []
    for (let mistake of mistakes) {
        let word = msg.text.substring(mistake.start, mistake.end)
        let correctedWord = SpellChecker.getCorrectionsForMisspelling(word)
        corrections.push(word + " -> " + correctedWord[0])
    }
    if (corrections.length > 0) {
        msg.reply.text(getBadWord() + " \n" + corrections.join("\n"))
    }
}

function getBadWord(){
    currentMilis = new Date().getTime()
    if ((currentMilis - lastTimeMilis) < timeBetweenErrors) {
        switch(mistakes) {
            case 2:
                mistakes++
                return getRandomWord(config.tier2)
            case 3:
                mistakes++
                return getRandomWord(config.tier3)
            case 4:
                mistakes++
                return getRandomWord(config.tier4)
            case 5:
                return getRandomWord(config.tier5)
            default:
                mistakes++
                return getRandomWord(config.tier1)
          }
    }else{
        lastTimeMilis = currentMilis
        mistakes = 1
        return getRandomWord(config.tier1)
    }
}

function getRandomWord(tier){
    max = tier.length
    return tier[Math.floor(Math.random() * max)]
}