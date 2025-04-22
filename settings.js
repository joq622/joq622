//-------------------[ BOT SETTINGS ]------------------// 

// @project_name : JOQUER-ISHLY
// @author : GOODLUCKY
// @instagram : lucky.goldenjoquer77
// @github : JOQ622
// @tiktok : Goodlucky Mserekale
// @whatsapp : +255767191393

//----------[ JOQUER-ISHLY CONFIGURATION ]------------//

const fs = require('fs')
const { color } = require('./lib/color')
if (fs.existsSync('.env')) require('dotenv').config({ path: __dirname + '/.env' })

//-----------------[ SESSION ID ]----------------------//

global.SESSION_ID = process.env.SESSION_ID || ''
// JOQUER-ISHLY session identifier. Format example:.............

//---------------------[ BOT NAME ]---------------------//

global.botname = process.env.BOT_NAME || 'CypherX'
// The bot’s display name. Defaults to "JOQUER-ISHLY" if not set

//------------------[ OWNER DETAILS ]------------------//

global.ownernumber = process.env.OWNER_NUMBER || '255767191393'
//Enter your phone number (with country code without + and spaces)

global.ownername = process.env.OWNER_NAME || 'JOQUER'
// Enter your name here

//-----------[ STICKER CONFIGURATION ]--------------//

global.packname = process.env.STICKER_PACK_NAME || "JOQUERHCET"
// Packname name displayed on created stickers

global.author = process.env.STICKER_AUTHOR_NAME || "G"
// Author name shown on created stickers

//----------------[ TIMEZONE CONFIG ]-----------------//

global.timezones = process.env.TIMEZONE || "Africa/Nairobi"
// The timezone used for time-based features. Ensure accuracy for correct time responses

//------------------[ DATABASE CONNECTION ]------------------//

global.postgresqls = process.env.DATABASE_URL || ""
// PostgreSQL connection string. Required for Heroku or external DB setups
//Not necessarily needed on panels and localhosts

//------------[ CONTEXTUAL PROFILE LINK ]----------//

global.plink = process.env.PLINK || ""
// Public profile or context link for the bot (e.g., Instagram, WhatsApp, YouTube etc.)

//------------------[ WATERMARK TEXT ]---------------//

global.wm = process.env.GL_WM || "©Joquer_ishly is on fire!🔥"
// Watermark text displayed on generated content or done tasks 

//------------------[ MENU IMAGE ]----------------------//

global.menuimage = process.env.MENU_IMAGE || ["https://files.catbox.moe/n6guny.jpg", "https://files.catbox.moe/n6guny.jpg"]; 
//Set your desired menu image link here...reply to an image with .tourl to get image link
//Set as many as you wish 

//----------------[ RESPONSE MESSAGES ]-------------//

global.mess = {
  done: 'Mission completed successfully.', 
  success: 'Operation successful.', 
  owner: 'This command is restricted to the owner and sudos only.', 
  group: 'This command can only be used in group chats.', 
  admin: 'Bot requires admin privileges to perform this action.', 
  notadmin: 'Only group admins can use this command.', 
  error: 'An error occurred. Please try again later.', 
  wait: 'Processing your request. Please wait...', 
  nolink: 'No valid link detected. Please provide a proper link.', 
  notext: 'No input detected. Please provide the necessary text.', 
  ban: 'You are currently banned from using the bot.', 
  unban: 'You have been unbanned and can now use the bot.', 
}

//--------------[ DEVELOPER SETTINGS ]---------------//
/* Do not change anything here!!! Or I’ll send JOQUER-ISHLY after you... 😈👣 */

//--------------------[ WATCHER ]-----------------------//
// Who’s watching the watchers? 🤔
// Let’s keep track of any changes like a hawk in a top hat. 

let file = require.resolve(__filename)
fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log(color(`Updated '${__filename}'`, 'red')) 
  delete require.cache[file]
  require(file)
})

//----------------------[ JOQUER-ISHLY ]----------------------//
// JOQUER-ISHLY is like a lion. It might ignore you, but it knows what you’re up to. ♎️
// It only responds when it feels like it. It’s the true master of mystery.
// Please proceed with caution. Our code doesn’t bite, but it might give you an awkward look.