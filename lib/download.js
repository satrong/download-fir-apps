const Axios = require('axios');
const Path = require('path');
const Fs = require('fs-extra');
const crypto = require('crypto');

const md5 = str => crypto.createHash('md5').update(str).digest('hex');

module.exports = async (dirname, url, ext = '.apk', name) => {
    const pathname = Path.join(dirname, `${name}.${ext}`);
    const path = Path.join(__dirname, '../uploads', pathname);
    await Fs.ensureDir(path.replace(/\/[^\/]+$/, ''));
    const writer = Fs.createWriteStream(path);

    const response = await Axios({
        url,
        method: 'GET',
        responseType: 'stream',
        timeout: 1000 * 60 * 2,
    })

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', () => resolve(pathname))
        writer.on('error', reject)
    });
};
