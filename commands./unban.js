const { bannedUsers } = require('./ban');

module.exports = {
  name: '.unban',
  run: async (sock, msg, args) => {
    const number = args.replace(/\D/g, '');const index = bannedUsers.indexOf(number);
    if (index !== -1) bannedUsers.splice(index, 1);
    await sock.sendMessage(msg.key.remoteJid,  text: `✅ User{number} has been unbanned.` });
  }
};
