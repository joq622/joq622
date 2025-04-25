const { bannedUsers } = require('./ban');

module.exports = {
  name: '.banned',
  run: async (sock, msg, args) => {
    let text = '🚫 *Banned List:*\n\n';
    bannedUsers.forEach((user, index) => {
      text += `index + 1.{user}\n`;
    });
    await sock.sendMessage(msg.key.remoteJid, { text });
  }
};
