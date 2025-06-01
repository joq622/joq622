/*

FROM ABOUT [ MFA ]

BASE ESM WANGSAPP
YT: @Fauzialifatah

INFORMASI:
https://whatsapp.com/channel/0029VawsCnQ9mrGkOuburC1z

*/

export const ownerNumber = '255767191393;
export const namabot = 'QUEEN AISHA';

import chalk from 'chalk';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

fs.watchFile(__filename, () => {
    fs.unwatchFile(__filename);
    console.log(chalk.redBright(`Update ${__filename}`));
    import(`${import.meta.url}?update=${Date.now()}`)
        .then(() => console.log('Kode diperbarui!'))
        .catch(err => console.error('Gagal memperbarui:', err));
});
