/*

FROM ABOUT [ MFA ]

BASE ESM WANGSAPP
YT: @Fauzialifatah

INFORMASI:
https://whatsapp.com/channel/0029VawsCnQ9mrGkOuburC1z

*/

import './config.js';
import * as baileys from '@whiskeysockets/baileys';
import qrcode from 'qrcode-terminal';
import fs from 'fs';
import pino from 'pino';
import PhoneNumber from 'awesome-phonenumber';
import readline from 'readline';
import { smsg } from './lib/myfunction.js';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const { proto, makeWASocket, useMultiFileAuthState, makeInMemoryStore, jidDecode } = baileys;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const usePairingCode = true;
const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) });

const question = (text) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve) => {
    rl.question(text, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
};

async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState('./Session');
  const mfa = makeWASocket({
    logger: pino({ level: "silent" }),
    printQRInTerminal: !usePairingCode,
    auth: state,
    browser: ["Ubuntu", "Chrome", "20.0.04"]
  });

  if (usePairingCode && !mfa.authState.creds.registered) {
    const phoneNumber = await question('Masukan Nomer Yang Aktif Awali Dengan 62:\n');
    const code = await mfa.requestPairingCode(phoneNumber.trim());
    console.log(`Pairing code: ${code}`);
  }

  store.bind(mfa.ev);

  mfa.decodeJid = (jid) => {
    if (!jid) return jid;
    if (/:\d+@/gi.test(jid)) {
      let decode = jidDecode(jid) || {};
      return (decode.user && decode.server) ? `${decode.user}@${decode.server}` : jid;
    } else return jid;
  };

  mfa.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== 401;
      console.log('Koneksi terputus, mencoba menyambung ulang...', shouldReconnect);
      if (shouldReconnect) connectToWhatsApp();
    } else if (connection === 'open') {
      console.log('Bot berhasil terhubung!');
    }
  });

  mfa.ev.on('creds.update', saveCreds);

  mfa.ev.on('messages.upsert', async (chatUpdate) => {
    try {
      let mek = chatUpdate.messages?.[0];
      if (!proto?.WebMessageInfo || !mek?.message || !mek.key) return;

      mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage')
        ? mek.message.ephemeralMessage.message
        : mek.message;

      if (mek.key?.remoteJid === 'status@broadcast') return;
      if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return;
      if (mek.key.id.startsWith('Pondaaa_')) return;

      const m = smsg(mfa, mek, store);
      const { default: handlemsg } = await import('./msg.js');
      handlemsg(mfa, m, chatUpdate, store);
    } catch (err) {
      console.log(chalk.redBright("Error on messages.upsert:"), err);
    }
  });

  mfa.getName = async (jid, withoutContact = false) => {
    const id = mfa.decodeJid(jid);
    withoutContact = mfa.withoutContact || withoutContact;
    let v;

    if (id.endsWith("@g.us")) {
      return new Promise(async (resolve) => {
        v = store.contacts[id] || {};
        if (!(v.name || v.subject)) v = await mfa.groupMetadata(id) || {};
        resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'));
      });
    } else {
      v = id === '0@s.whatsapp.net' ? { id, name: 'WhatsApp' } :
        id === mfa.decodeJid(mfa.user.id) ? mfa.user :
          (store.contacts[id] || {});

      return (withoutContact ? '' : v.name) || v.subject || v.verifiedName ||
        PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international');
    }
  };

  mfa.sendContact = async (jid, kon, quoted = '', opts = {}) => {
    let list = [];
    for (let i of kon) {
      list.push({
        displayName: await mfa.getName(i + '@s.whatsapp.net'),
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await mfa.getName(i + '@s.whatsapp.net')}\nFN:${await mfa.getName(i + '@s.whatsapp.net')}\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
      });
    }
    mfa.sendMessage(jid, { contacts: { displayName: `${list.length} Kontak`, contacts: list }, ...opts }, { quoted });
  };
}

connectToWhatsApp();

fs.watchFile(__filename, () => {
  fs.unwatchFile(__filename);
  console.log(chalk.redBright(`Update ${__filename}`));
  import(`${import.meta.url}?update=${Date.now()}`).then(() => {
    console.log('Kode diperbarui!');
  }).catch(err => console.error('Gagal memperbarui:', err));
});
