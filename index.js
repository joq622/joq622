const fs = require('fs');
const path = require('path');
const makeWASocket = require('@adiwajshing/baileys').default;
const { useSingleFileAuthState } = require('@adiwajshing/baileys');

// Load authentication state
const { state, saveState } = useSingleFileAuthState('./auth_info.json');

// Create the WhatsApp socket
const sock = makeWASocket({
    auth: state,
});

// Save authentication state on updates
sock.ev.on('creds.update', saveState);

// Load commands dynamically from the commands folder
const commands = new Map();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if (command.name && command.execute) {
        commands.set(command.name, command);
    } else {
        console.warn(`[WARNING] The command at ${filePath} is missing a required "name" or "execute" property.`);
    }
}

// Event listener for messages
sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;

    for (const message of messages) {
        if (!message.message) continue;

        const from = message.key.remoteJid;
        const isGroup = from.endsWith('@g.us');
        const body = message.message.conversation || message.message.extendedTextMessage?.text || '';

        // Split the message content into command and arguments
        const args = body.trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        // Check if the command exists
        if (!commands.has(commandName)) continue;

        const command = commands.get(commandName);

        try {
            await command.execute(sock, message, args, isGroup); // Pass sock, message, args, and isGroup to the command
        } catch (error) {
            console.error(`Error executing command "${commandName}":`, error);
            await sock.sendMessage(from, { text: 'There was an error processing your command.' });
        }
    }
});

// Start the bot
console.log('QUEEN AISHA is now online!');
