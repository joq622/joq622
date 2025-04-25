module.exports = 
  name: '.kick',
  run: async (sock, msg, args) => 
    await sock.sendMessage(msg.key.remoteJid,  text: `😜 Kicked{args} (just joking!)` });
  }
};
