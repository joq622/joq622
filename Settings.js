const chalk = require("chalk")
const fs = require("fs")

//documents variants
global.doc1 = 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
global.doc2 = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
global.doc3 = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
global.doc4 = 'application/zip'
global.doc5 = 'application/pdf'
global.doc6 = 'application/vnd.android.package-archive'

//owmner v card
global.owner = ['255767191393'] //ur owner number
global.ownernomer = "255767191393" //ur owner number2
global.ownername = "Goodlucky Emmanuel" //ur owner name
global.socialm = "GitHub: joq622" //ur github or insta name
global.location = "Tanzania,Tanga,Maweni" //ur location

//new
global.botname = "JOQUER-ISHLY"
global.ownernumber = '255767191393'
global.ownername = 'Goodlucky Emmanuel
global.ownerNumber = ["255767191393@s.whatsapp.net"]
global.themeemoji = '💗'
global.wm = "Xeon Bot Inc."
global.botscript = 'https://github.com/xIKRATOSx/XeonBotV7' //script link
global.packname = "Sticker By"
global.author = "JOQUER-ISHLY\n\n\nA whatsapp bot developed by\Joquer\n\n\n\n\n\n\n\n       --------______-------\n\n\n\n\n\n\n\nContact No. : +255767191393"
global.creator = "923470027813@s.whatsapp.net"
global.prefa = ['','!','.','#','&']
global.port = '5000'

//media target
global.thum = 'https://telegra.ph/file/1b9fc7f9043bb46ad3098.jpg' //ur thumb pic
global.log0 = 'https://files.catbox.moe/nxiz2p.jpg' //ur logo pic
global.err4r = 'https://telegra.ph/file/1b9fc7f9043bb46ad3098.jpg' //ur error pic
global.thumb = 'https://telegra.ph/file/1b9fc7f9043bb46ad3098.jpg' //ur thumb pic

//menu image maker
global.flaming = 'https://www6.flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=sketch-name&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&text='
global.fluming = 'https://www6.flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=fluffy-logo&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&text='
global.flarun = 'https://www6.flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=runner-logo&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&text='
global.flasmurf = 'https://www6.flamingtext.com/net-fu/proxy_form.cgi?&imageoutput=true&script=smurfs-logo&doScale=true&scaleWidth=800&scaleHeight=500&fontsize=100&text='

//messages
global.mess = {
    success: 'Here you go!',
    admin: 'This feature could be used by admins only!',
    botAdmin: 'Bot Must Be Admin First!',
    premime: 'Premium Special Features If You Want to Register Type Rent',
    owner: 'This feature could be used by owner only',
    group: 'Features Used Only For Groups!',
    private: 'Features Used Only For Private Chat!',
    bot: 'This feature could be used by bot only',
    wait: 'In process...',
    linkm: 'Where is the link?',
    endLimit: 'Your Daily Limit Has Expired, The Limit Will Be Reset Every 12 Hours',
    nsfw: 'The nsfw feature has not been activated, please contact the admin to activate',
}

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update'${__filename}'`))
	delete require.cache[file]
	require(file)
})
