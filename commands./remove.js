module.exports = {
  name: '.remove',
  run: async (sock, msg, args) => {
    const number = args.replace(/\D/g, '');
    await sock.groupParticipantsUpdate(msg.key.remoteJid, [`number@s.whatsapp.net`], 'remove');
  ;
