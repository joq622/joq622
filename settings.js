const fs = require('fs')
const chalk = require('chalk')

//contact details
global.ownernomer = "255752429665"
global.ownername = "Joquer"
global.ytname = "YT:none"
global.socialm = "GitHub: Joq622"
global.location = "Tanzania, Tanga,Maweni "

global.ownernumber = '255752429665'  //creator number
global.ownername = 'Joquer'
//owner name
global.botname = 'JOQUER-ISHLY'
//name of the bot

//sticker details
global.packname = 'Sticker By'
global.author ='Joquer'

//console view/theme
global.themeemoji = '🪀'
global.wm = "⁷⁷⁷⁷⁷⁷⁷"

//theme link
global.link = ''

//custom prefix
global.prefa = ['','!','.','#','&']

//false=disable and true=enable
global.autoRecording = true//auto recording
global.autoTyping = true //auto typing
global.autorecordtype = true //auto typing + recording
global.autoread = true //auto read messages
global.autobio = false //auto update bio
global.anti91 = false //auto block +91 
global.autoswview = true //auto view status/story
global.typemenu = 'v2'

//text bug
global.xbugtex = {
xtxt: '🚨ɪᴄᴏɴɪᴄ ᴛᴇᴄʜ🚨',
}
module.exports = {
    // ... other settings ...
    security: {
        antiSpam: true,
        maxMessages: 10, // Messages per 10 seconds
        blockDuration: 300 // 5 minutes in seconds
    }
};
//reply messages
global.mess = {
    done: 'Done !',
    prem: 'This feature can be used by premium user only',
    admin: 'This feature can be used by admin only',
    botAdmin: 'This feature can only be used when the bot is a group admin ',
    owner: 'This feature can be used by owner only',
    group: 'This feature is only for groups',
    private: 'This feature is only for private chats',
    wait: 'In process... ',    
    error: 'Error!',
}

global.thumb = fs.readFileSync('./JokerMedia/thumb.jpg')

let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright(`Update'${__filename}'`))
    delete require.cache[file]
    require(file)
})
