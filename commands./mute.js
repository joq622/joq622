module.exports = {
  name: '.mute',
  run: async (sock, msg, args) => {await sock.groupSettingUpdate(msg.key.remoteJid, 'announcement');
    await sock.sendMessage(msg.key.remoteJid, { text: '*🔇 Group has been muted. Only admins can send messages.*' });
  }
};
