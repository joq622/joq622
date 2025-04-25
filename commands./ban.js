const bannedUsers = [];

module.exports = {
  name: '.ban',
  run: async (sock, msg, args) => {
    const number = args.replace(/\D/g, '');
    if (!bannedUsers.includes(number)) bannedUsers.push(number);
    await sock.sendMessage(msg.key.remoteJid, { text: `🚫 User ${number} has been banned.` });
  },
  bannedUsers
};
