/*

FROM ABOUT [ MFA ]

BASE ESM WANGSAPP
YT: @Fauzialifatah

INFORMASI:
https://whatsapp.com/channel/0029VawsCnQ9mrGkOuburC1z

*/

import './config.js';
import chalk from 'chalk';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import util from 'util';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function (mfa, m) {
    try {
        let body = "";
        if (m.message) {
            body =
                m.message.conversation ||
                m.message.imageMessage?.caption ||
                m.message.videoMessage?.caption ||
                m.message.extendedTextMessage?.text ||
                m.message.buttonsResponseMessage?.selectedButtonId ||
                m.message.listResponseMessage?.singleSelectReply?.selectedRowId ||
                m.message.templateButtonReplyMessage?.selectedId ||
                m.text || "";
        }

        const prefixMatch = body.match(/^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi);
        const prefix = prefixMatch ? prefixMatch[0] : "";
        const isCmd = body.startsWith(prefix);
        const command = isCmd ? body.replace(prefix, '').trim().split(/ +/).shift().toLowerCase() : "";
        const args = body.trim().split(/ +/).slice(1);
        const pushname = m.pushName || "No Name";
        const sender = m.key?.remoteJid || "unknown";

        // ===== Debug Console Logs =====
        console.log(chalk.yellowBright(`\n📥 Pesan Masuk dari: ${pushname} (${sender})`));
        console.log(chalk.greenBright(`💬 Isi Pesan: ${body}`));
        if (isCmd) {
            console.log(chalk.cyanBright(`⚙️ Perintah Dikenali: ${command}`));
            console.log(chalk.gray(`📎 Argumen: ${args.join(" ") || "(kosong)"}`));
        }

        switch (command) {
            case 'menu':
                await mfa.sendMessage(sender, {
                    text: `Hello kak ${pushname}\n*Menu Bot:*\n1. ping\n2. owner\n3. info`
                });
                break;

            case 'ping':
                await mfa.sendMessage(sender, { text: 'Pong! Bot aktif.' });
                break;
            default:
        }

    } catch (err) {
        const errId = `6281340019858@s.whatsapp.net`;
        try {
            await mfa.sendMessage(errId, { text: util.format(err) }, { quoted: m });
        } catch (e) {
            console.log(chalk.red('Gagal mengirim error ke admin:'), e);
        }
        console.log(chalk.redBright('❌ Error:\n'), err);
    }
}

fs.watchFile(__filename, () => {
    fs.unwatchFile(__filename);
    console.log(chalk.redBright(`Update ${__filename}`));
    import(`${import.meta.url}?update=${Date.now()}`).then(module => {
        console.log('Kode diperbarui!');
    }).catch(err => console.error('Gagal memperbarui:', err));
});
