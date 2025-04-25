module.exports = {
  name: '.tagall',
  run: async (sock, msg, args) => {
    const groupMetadata = await sock.groupMetadata(msg.key.remoteJid);
    const members = groupMetadata.participants.map(p => p.id);

    await sock.sendMessage(msg.key.remoteJid, {
      text: args || '👋 Hello everyone!',
      mentions: members
    });
  }
};
