// index.js
const { default: makeWASocket, useSingleFileAuthState, DisconnectReason } = require('@adiwajshing/baileys');
const { Boom } = require('@hapi/boom');
const fs = require('fs');
const path = require('path');

// Load authentication state
const { state, saveState } = useSingleFileAuthState('./auth_info.json');

// In-memory storage for banned users
const bannedUsers = new Set();

// Initialize the WhatsApp connection
const startBot = async () => {
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
  });

  // Save authentication state on updates
  sock.ev.on('creds.update', saveState);

  // Handle incoming messages
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const from = msg.key.remoteJid;
    const sender = msg.key.participant || msg.key.remoteJid;
const messageContent = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
    const command = messageContent.trim().toLowerCase();

    // Check if the sender is banned
    if (bannedUsers.has(sender)) {
      await sock.sendMessage(from, { text: 'You are banned from using this bot.' });
      return;
    }

    // Command handling
    if (command === '.tagall') {
      // Tag all group members
      const groupMetadata = await sock.groupMetadata(from);
      const participants = groupMetadata.participants.map(p => p.id);
      const mentions = participants;
      const text = 'Hello everyone!';
      await sock.sendMessage(from, { text, mentions });
    } else if (command.startsWith('.ban')) {
      // Ban a user
      const number = command.split(' ')[1];
      if (number) {
        const jid = number.includes('@s.whatsapp.net') ? number : `number@s.whatsapp.net`;
        bannedUsers.add(jid);
        await sock.sendMessage(from,  text: `User{number} has been banned.` });
      } else {
        await sock.sendMessage(from, { text: 'Please provide a number to ban.' });
      }
    } else if (command.startsWith('.unban')) {
      // Unban a user
      const number = command.split(' ')[1];
      if (number) {
const jid = number.includes('@s.whatsapp.net') ? number : `number@s.whatsapp.net`;
        bannedUsers.delete(jid);
        await sock.sendMessage(from,  text: `User{number} has been unbanned.` });
      } else {
        await sock.sendMessage(from, { text: 'Please provide a number to unban.' });
      }
    } else if (command === '.banned') {
      // List banned users
      if (bannedUsers.size === 0) {
        await sock.sendMessage(from, { text: 'No users are currently banned.' });
      } else {
        const bannedList = Array.from(bannedUsers).join('\n');
        await sock.sendMessage(from, { text: `Banned users:\nbannedList` );
       else if (command === '.kick') 
      // Simulate kicking a user (joke command)
      await sock.sendMessage(from,  text: 'Just kidding! I cant́ kick anyone without admin rights.' );
     else if (command === '.remove') 
      // Remove a user from the group (requires admin rights)
      const number = command.split(' ')[1];
      if (number) 
        const jid = number.includes('@s.whatsapp.net') ? number : `{number}@s.whatsapp.net`;
        await sock.groupParticipantsUpdate(from, [jid], 'remove');
      } else {
        await sock.sendMessage(from, { text: 'Please provide a number to remove.' });
      }
} else if (command === '.mute') {
      // Mute the group (only admins can send messages)
      await sock.groupSettingUpdate(from, 'announcement');
      await sock.sendMessage(from, { text: 'Group has been muted. Only admins can send messages.' });
    } else if (command === '.unmute') {
      // Unmute the group (all participants can send messages)
      await sock.groupSettingUpdate(from, 'not_announcement');
      await sock.sendMessage(from, { text: 'Group has been unmuted. All participants can send messages.' });
    }
  });

  // Handle connection updates
  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect.error = Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('Connection closed due to', lastDisconnect.error, ', reconnecting:', shouldReconnect);
      if (shouldReconnect) {
        startBot();
      }
    } else if (connection === 'open') {
      console.log('Connected to WhatsApp');
    }
  });
};
