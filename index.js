/**
 * Joquer-Ishly - A WhatsApp Bot
 * Copyright (c) JOQUERHCET
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the MIT License.
 * 
 * Credits:
 * - Baileys Library by @adiwajshing
 * - Pair Code implementation inspired by TechGod143 & DGXEON
 */
require('./settings')
const { Boom } = require('@hapi/boom')
const fs = require('fs')
const chalk = require('chalk')
const FileType = require('file-type')
const path = require('path')
const axios = require('axios')
const { handleMessages, handleGroupParticipantUpdate, handleStatus } = require('./main');
const PhoneNumber = require('awesome-phonenumber')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./lib/exif')
const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetch, await, sleep, reSize } = require('./lib/myfunc')
const { 
    default: makeWASocket,
    useMultiFileAuthState, 
    DisconnectReason, 
    fetchLatestBaileysVersion,
    generateForwardMessageContent,
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    generateMessageID,
    downloadContentFromMessage,
    makeInMemoryStore,
    jidDecode,
    proto,
    jidNormalizedUser,
    makeCacheableSignalKeyStore,
    delay
} = require("@whiskeysockets/baileys")
const NodeCache = require("node-cache")
const pino = require("pino")
const readline = require("readline")
const { parsePhoneNumber } = require("libphonenumber-js")
const { PHONENUMBER_MCC } = require('@whiskeysockets/baileys/lib/Utils/generics')
const { rmSync, existsSync } = require('fs')
const { join } = require('path')

const store = makeInMemoryStore({
    logger: pino().child({
        level: 'silent',
        stream: 'store'
    })
})

let phoneNumber = "255767191393,255752429665"
let owner = JSON.parse(fs.readFileSync('./data/owner.json'))

global.botname = "JOQUER-ISHLY "
global.themeemoji = "•"

const pairingCode = !!phoneNumber || process.argv.includes("--pairing-code")
const useMobile = process.argv.includes("--mobile")

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text) => new Promise((resolve) => rl.question(text, resolve))
         
async function startXeonBotInc() {
    let { version, isLatest } = await fetchLatestBaileysVersion()
    const { state, saveCreds } = await useMultiFileAuthState(`./session`)
    const msgRetryCounterCache = new NodeCache()

    const XeonBotInc = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: !pairingCode,
        browser: ["Ubuntu", "Chrome", "20.0.04"],
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
        },
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: true,
        getMessage: async (key) => {
            let jid = jidNormalizedUser(key.remoteJid)
            let msg = await store.loadMessage(jid, key.id)
            return msg?.message || ""
        },
        msgRetryCounterCache,
        defaultQueryTimeoutMs: undefined,
    })

    store.bind(XeonBotInc.ev)

    // Message handling
    XeonBotInc.ev.on('messages.upsert', async chatUpdate => {
        try {
            const mek = chatUpdate.messages[0]
            if (!mek.message) return
            mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
            if (mek.key && mek.key.remoteJid === 'status@broadcast') {
                await handleStatus(XeonBotInc, chatUpdate);
                return;
            }
            if (!XeonBotInc.public && !mek.key.fromMe && chatUpdate.type === 'notify') return
            if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return
            
            try {
                await handleMessages(XeonBotInc, chatUpdate, true)
            } catch (err) {
                console.error("Error in handleMessages:", err)
                // Only try to send error message if we have a valid chatId
                if (mek.key && mek.key.remoteJid) {
                    await XeonBotInc.sendMessage(mek.key.remoteJid, { 
                        text: '❌ An error occurred while processing your message.',
                        contextInfo: {
                            forwardingScore: 999,
                            isForwarded: true,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: '120363161513685998@newsletter',
                                newsletterName: 'KnightBot MD',
                                serverMessageId: -1
                            }
                        }
                    }).catch(console.error);
                }
            }
        } catch (err) {
            console.error("Error in messages.upsert:", err)
        }
    })

    // Add these event handlers for better functionality
    XeonBotInc.decodeJid = (jid) => {
        if (!jid) return jid
        if (/:\d+@/gi.test(jid)) {
            let decode = jidDecode(jid) || {}
            return decode.user && decode.server && decode.user + '@' + decode.server || jid
        } else return jid
    }

    XeonBotInc.ev.on('contacts.update', update => {
        for (let contact of update) {
            let id = XeonBotInc.decodeJid(contact.id)
            if (store && store.contacts) store.contacts[id] = { id, name: contact.notify }
        }
    })

    XeonBotInc.getName = (jid, withoutContact = false) => {
        id = XeonBotInc.decodeJid(jid)
        withoutContact = XeonBotInc.withoutContact || withoutContact 
        let v
        if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
            v = store.contacts[id] || {}
            if (!(v.name || v.subject)) v = XeonBotInc.groupMetadata(id) || {}
            resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
        })
        else v = id === '0@s.whatsapp.net' ? {
            id,
            name: 'WhatsApp'
        } : id === XeonBotInc.decodeJid(XeonBotInc.user.id) ?
            XeonBotInc.user :
            (store.contacts[id] || {})
        return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
    }

    XeonBotInc.public = true

    XeonBotInc.serializeM = (m) => smsg(XeonBotInc, m, store)

    // Handle pairing code
    if (pairingCode && !XeonBotInc.authState.creds.registered) {
        if (useMobile) throw new Error('Cannot use pairing code with mobile api')

        let phoneNumber
        if (!!global.phoneNumber) {
            phoneNumber = global.phoneNumber
        } else {
            phoneNumber = await question(chalk.bgBlack(chalk.greenBright(`Please type your WhatsApp number 😍\nFor example: +255767191393 : `)))
        }

        phoneNumber = phoneNumber.replace(/[^0-9]/g, '')

        // Request pairing code
        setTimeout(async () => {
            let code = await XeonBotInc.requestPairingCode(phoneNumber)
            code = code?.match(/.{1,4}/g)?.join("-") || code
            console.log(chalk.black(chalk.bgGreen(`Your Pairing Code : `)), chalk.black(chalk.white(code)))
        }, 3000)
    }

    // Connection handling
    XeonBotInc.ev.on('connection.update', async (s) => {
        const { connection, lastDisconnect } = s
        if (connection == "open") {
            console.log(chalk.magenta(` `))
            console.log(chalk.yellow(`🌿Connected to => ` + JSON.stringify(XeonBotInc.user, null, 2)))
            
            // Send message to bot's own number
            const botNumber = XeonBotInc.user.id.split(':')[0] + '@s.whatsapp.net';
            await XeonBotInc.sendMessage(botNumber, { 
                text: `🤖 Bot Connected Successfully!\n\n⏰ Time: ${new Date().toLocaleString()}\n✅ Status: Online and Ready!
                \n Give a Star ⭐ to our bot:\n https://github.com/mruniquehacker/KnightBot-MD\n ✅Make sure to join below channel`,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363161513685998@newsletter',
                        newsletterName: 'KnightBot MD',
                        serverMessageId: -1
                    }
                }
            });

            await delay(1999)
            console.log(chalk.yellow(`\n\n                  ${chalk.bold.blue(`[ ${global.botname || 'KNIGHT BOT'} ]`)}\n\n`))
            console.log(chalk.cyan(`< ================================================== >`))
            console.log(chalk.magenta(`\n${global.themeemoji || '•'} YT CHANNEL: MR UNIQUE HACKER`))
            console.log(chalk.magenta(`${global.themeemoji || '•'} GITHUB: mrunqiuehacker`))
            console.log(chalk.magenta(`${global.themeemoji || '•'} WA NUMBER: ${owner}`))
            console.log(chalk.magenta(`${global.themeemoji || '•'} CREDIT: MR UNIQUE HACKER`))
            console.log(chalk.green(`${global.themeemoji || '•'} 🤖 Bot Connected Successfully! ✅`))
        }
        if (
            connection === "close" &&
            lastDisconnect &&
            lastDisconnect.error &&
            lastDisconnect.error.output.statusCode != 401
        ) {
            startXeonBotInc()
        }
    })

    XeonBotInc.ev.on('creds.update', saveCreds)
    
    // Modify the event listener to log the update object
    XeonBotInc.ev.on('group-participants.update', async (update) => {
        console.log('Group Update Event:', JSON.stringify(update, null, 2));  // Add this line to debug
        await handleGroupParticipantUpdate(XeonBotInc, update);
    });

    // Add status update handlers
    XeonBotInc.ev.on('messages.upsert', async (m) => {
        if (m.messages[0].key && m.messages[0].key.remoteJid === 'status@broadcast') {
            await handleStatus(XeonBotInc, m);
        }
    });

    // Handle status updates
    XeonBotInc.ev.on('status.update', async (status) => {
        await handleStatus(XeonBotInc, status);
    });

    // Handle message reactions (some status updates come through here)
    XeonBotInc.ev.on('messages.reaction', async (status) => {
        await handleStatus(XeonBotInc, status);
    });

    return XeonBotInc
}


// Start the bot with error handling
startXeonBotInc().catch(error => {
    console.error('Fatal error:', error)
    process.exit(1)
})

// Better error handling
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err)
    // Don't exit immediately to allow reconnection
})

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err)
    // Don't exit immediately to allow reconnection
})

let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright(`Update ${__filename}`))
    delete require.cache[file]
    require(file)
})
  const { default: makeWASocket, useSingleFileAuthState } = require('@whiskeysockets/baileys');
   const { Boom } = require('@hapi/boom');
   const axios = require('axios');
   const fs = require('fs');
   const qrcode = require('qrcode-terminal');

   const { state, saveState } = useSingleFileAuthState('auth_info.json');

   const openWeatherApiKey = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with your OpenWeatherMap API key
   const openAiApiKey = 'YOUR_OPENAI_API_KEY'; // Replace with your OpenAI API key

   async function startBot() {
     const sock = makeWASocket({
       auth: state,
       printQRInTerminal: true
     });
sock.ev.on('creds.update', saveState);

     sock.ev.on('messages.upsert', async ({ messages }) => {
       const msg = messages[0];
       if (!msg.message || msg.key.fromMe) return;

       const from = msg.key.remoteJid;
       const text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
       const lower = text.toLowerCase();

       // Greeting
       if (lower === 'hi') {
         await sock.sendMessage(from, { text: '👋 Hello! I am JOQUER-ISHLY. Type *help* to see what I can do.' });
       }
       // Help
       else if (lower === 'help') {
         await sock.sendMessage(from, {
           text: `🤖 *JOQUER-ISHLY* Commands:
   - hi
   - date / time
   - joke
   - weather <city>
   - search <query>
   - ai <message>
   - add <number>
   - remove <number>
   - promote <number>
   - demote <number>`
         });
       }
       // Date & Time
       else if (lower === 'date' || lower === 'time') {
         const now = new Date();
         await sock.sendMessage(from, { text: `🕒 now.toDateString(){now.toLocaleTimeString()}` });
       }
       // Joke
       else if (lower === 'joke') {
         const jokes = [
           "Why do JavaScript developers wear glasses? Because they don't C#.","Why did the developer go broke? Because he used up all his cache.",
           "Why do programmers prefer dark mode? Because light attracts bugs."
         ];
         const joke = jokes[Math.floor(Math.random() * jokes.length)];
         await sock.sendMessage(from, { text: joke });
       }
       // Weather Command
       else if (lower.startsWith('weather ')) {
         const city = lower.split('weather ')[1];
         try {
           const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=city   units=metric   appid={openWeatherApiKey}`);
           const data = response.data;
           await sock.sendMessage(from, {
             text: `🌤️ Weather in *data.name*:
   - Temperature:{data.main.temp}°C
   - Weather: data.weather[0].description`
           );
          catch 
           await sock.sendMessage(from,  text: `❌ Could not retrieve weather for "{city}".` });
         }
       }
       // Search Command
       else if (lower.startsWith('search ')) {
         const query = lower.split('search ')[1];
         await sock.sendMessage(from, {
           text: `🔍 Search results for *query*: https://www.google.com/search?q={encodeURIComponent(query)}`
         });
       }
       // AI Chat Commandelse if (lower.startsWith('ai ')) {
         const prompt = lower.split('ai ')[1];
         try {
           const response = await axios.post('https://api.openai.com/v1/chat/completions', {
             model: 'gpt-3.5-turbo',
             messages: [{ role: 'user', content: prompt }]
           }, {
             headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer openAiApiKey`
             );
           const aiReply = response.data.choices[0].message.content;
           await sock.sendMessage(from,  text: aiReply );
          catch 
           await sock.sendMessage(from,  text: '❌ Error retrieving AI response.' );
         
       // Group Management Commands
       else if (lower.startsWith('add ')) 
         const number = lower.split('add ')[1].replace(//g, ”);
         await sock.groupParticipantsUpdate(from, [`{number}@s.whatsapp.net`], 'add');
       }
       else if (lower.startsWith('remove ')) {
         const number = lower.split('remove ')[1].replace(/\D/g, '');
         await sock.groupParticipantsUpdate(from, [`${number}@s.whatsapp.net`], 'remove');
       }
       else if (lower.startsWith('promote ')) {
         const number = lower.split('promote ')[1].replace(/\D/g, '');await sock.groupParticipantsUpdate(from, [`{number}@s.whatsapp.net`], 'promote');
       }
       else if (lower.startsWith('demote ')) {
         const number = lower.split('demote ')[1].replace(/\D/g, '');
         await sock.groupParticipantsUpdate(from, [`number@s.whatsapp.net`], 'demote');
       
       // Anti-sticker feature with warning
       else if (msg.message?.stickerMessage) 
         const isGroup = msg.key.remoteJid.endsWith('@g.us');
         if (isGroup) 
           try 
             const metadata = await sock.groupMetadata(msg.key.remoteJid);
             const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';

             const botAdmin = metadata.participants.find(p => p.id === botNumber        p.admin);

             if (botAdmin) 
               // Delete the sticker message
               await sock.sendMessage(msg.key.remoteJid,  delete: msg.key );

               // Send a warning to the sender
               const sender = msg.key.participant || msg.key.remoteJid;
               await sock.sendMessage(msg.key.remoteJid, 
                 text: `⚠️ @{sender.split('@')[0]}, stickers are not allowed in this group. Please follow the rules.`,
                 mentions:
