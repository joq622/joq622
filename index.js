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
       const bannedUsers = new Set();

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
           "Why do JavaScript developers wear glasses? Because they don't C#.",
"Why did the developer go broke? Because he used up all his cache.",
           "Why do programmers prefer dark mode? Because light attracts bugs."
         ];
         const joke = jokes[Math.floor(Math.random() * jokes.length)];
         await sock.sendMessage(from, { text: joke });
       }
       // Weather Command
       const axios = require('axios');  // Make sure axios is imported
const openWeatherApiKey = 'your-api-key'; // Replace with your OpenWeather API key

// Function to get weather data and send it in a message
async function getWeather(city, sock, from) {
  try {
    // Send a GET request to the OpenWeather API
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=city   units=metric   appid={openWeatherApiKey}`);
    const data = response.data;

    // Send the weather info as a message
    await sock.sendMessage(from, {
      text: `🌤️ Weather in *data.name*:
      - Temperature:{data.main.temp}°C
      - Weather: ${data.weather[0].description}`
    });
  } catch (error) {console.error('Error fetching weather data:', error);
    await sock.sendMessage(from, {
      text: 'Sorry, I couldn\'t fetch the weather data at the moment.'
    });
  }
}   
       // Search Command
       if (lower.startsWith('search ')) {
         const query = lower.split('search ')[1];
         await sock.sendMessage(from, {
           text: `🔍 Search results for *query*: https://www.google.com/search?q={encodeURIComponent(query)}`
         });
       }
       // AI Chat Command
       if (lower.startsWith('ai ')) {
  const query = lower.split('ai ')[1];
  const response = await axios.post('https://api.openai.com/v1/chat/completions', {
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: query }],
  }, {
    headers: {
      'Authorization': `Bearer ${openai_api_key}`,
      'Content-Type': 'application/json'
    }
  });

  const aiReply = response.data.choices[0].message.content;
  await sock.sendMessage(from, { text: aiReply });
       }
       // Group Management Commands
       if (lower.startsWith('add ')) 
         const number = lower.split('add ')[1].replace(//g, ”);
         await sock.groupParticipantsUpdate(from, [`{number}@s.whatsapp.net`], 'add');
       }
       if (lower.startsWith('remove ')) {
         const number = lower.split('remove ')[1].replace(/\D/g, '');
         await sock.groupParticipantsUpdate(from, [`${number}@s.whatsapp.net`], 'remove');
       }
       if (lower.startsWith('promote ')) {
         const number = lower.split('promote ')[1].replace(/\D/g, '');
await sock.groupParticipantsUpdate(from, [`{number}@s.whatsapp.net`], 'promote');
       }
       if (lower.startsWith('demote ')) {
         const number = lower.split('demote ')[1].replace(/\D/g, '');
         await sock.groupParticipantsUpdate(from, [`number@s.whatsapp.net`], 'demote');
       
       // Anti-sticker feature with warning
       if (msg.message?.stickerMessage) 
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


// const { WAConnection } = require('@adiwajshing/baileys');
// const conn = new WAConnection();

// Commands object to store all command handlers
const commands = {};

// Example Command: View Once commands['vv'] = (message) => {
  // Logic to handle view once messages
  console.log('Handling view once message:', message);
  // Your implementation here
};

// Example Command: Play commands['play'] = (message) => {
  // Logic to handle play command
  console.log('Handling play command:', message);
  // Your implementation here
};

// Example Command: Video
commands['video'] = (message) => {
  // Logic to handle video command
  console.log('Handling video command:', message);
  // Your implementation here
};

// Example Command: Anti-sticker
commands['antisticker'] = (message) => {
  // Logic to handle anti-sticker command
  console.log('Handling anti-sticker command:', message);
  // Your implementation here
};

// Function to handle incoming messages
function handleMessage(message) {
  // Extract command from the message
  const command = extractCommand(message);

  // Check if the command exists in the commands object
  if (commands[command]) {
    commands[command](message);
  } else {
    console.log('Unknown command:', command);
  }
}

// Placeholder function to extract command from the message
function extractCommand(message) {
  // Your logic to extract command from the message
  // For example, if message starts with '!', extract the command
  if (message.startsWith('!')) {
    return message.slice(1).split(' ')[0];
  }
  return '';
}

// Simulate receiving a message
const incomingMessage = '!play Despacito';
handleMessage(incomingMessage);
```
