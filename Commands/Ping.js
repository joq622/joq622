module.exports = {
    name: 'ping', // The name of the command
    description: 'Replies with Pong!', // Optional description
    async execute(sock, message, args, isGroup) {
        const from = message.key.remoteJid;
        await sock.sendMessage(from, { text: 'Pong!' });
    },
};
