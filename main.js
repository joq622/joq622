const {
  default: makeWASocket,
  useSingleFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeInMemoryStore,
} = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const P = require('pino');
const fs = require('fs');

// Session Auth State
const { state, saveState } = useSingleFileAuthState('./auth.json');

// Logging
const store = makeInMemoryStore({ logger: P().child({ level: 'silent', stream: 'store' }) });
store.readFromFile('./store.json');
setInterval(() => {
  store.writeToFile('./store.json');
}, 10_000);

// Connect Function
async function startSock() {
  const { version, isLatest } = await fetchLatestBaileysVersion();
  console.log(`Baileys version: ${version}, latest: ${isLatest}`);

  const sock = makeWASocket({
    version,
    logger: P({ level: 'silent' }),
    printQRInTerminal: true,
    auth: state,
    browser: ['SkycastleBot', 'Safari', '1.0.0'],
  });

  store.bind(sock.ev);
  sock.ev.on('creds.update', saveState);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
      if (reason === DisconnectReason.loggedOut) {
        console.log('Logged out. Delete auth.json and restart.');
      } else {
        startSock();
      }
    } else if (connection === 'open') {
      console.log('Bot connected.');
    }
  });

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const m = messages[0];
    if (!m.message || m.key.fromMe) return;

    const sender = m.key.remoteJid;
    const msgBody =
      m.message.conversation ||
      m.message.extendedTextMessage?.text ||
      m.message.imageMessage?.caption ||
      '';

    console.log(`[${sender}]: ${msgBody}`);

    if (msgBody.toLowerCase() === '!ping') {
      await sock.sendMessage(sender, { text: 'pong' });
    }

    if (msgBody.toLowerCase() === '!menu') {
      await sock.sendMessage(sender, {
        text: '*Skycastle Bot Menu*\n\n!ping - check bot\n!menu - show this',
      });
    }
  });

  return sock;
}

startSock();
