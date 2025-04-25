module.exports = 
  name: '.away',
  run: async (sock, msg, args) => 
    await sock.sendMessage(msg.key.remoteJid,  text: '🤖 Iḿ not available at the moment. Iĺl get back to you soon!' );
  ;
