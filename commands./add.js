module.exports = 
  name: '.add',
  run: async (sock, msg, args) => 
    const number = args.replace(//g, ”);
    await sock.groupParticipantsUpdate(msg.key.remoteJid, [`{number}@s.whatsapp.net`], 'add');
  }
};
