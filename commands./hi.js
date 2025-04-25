module.exports = 
  name: '.hi',
  run: async (sock, msg, args) => 
    await sock.sendMessage(msg.key.remoteJid,  text: 'Hello there! 👋' );
  ;
