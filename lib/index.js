const { ShortIds } = require('./db');
const utils = require('./utils');
const Axios = require('axios');
const download = require('./download');

const sleep = (t) => new Promise(resolve => {
    setTimeout(resolve, t * 1000);
});

let max = 100;
let count = 0;
(async () => {
    while (max > 0) {
        const shortId = await utils.getShortId(ShortIds, 'short');
        try {
            const json = await Axios.get(`https://download.fir.im/${shortId}`).then(res => res.data);
            if (typeof json === 'object' && json.app) {
                const { short, type, id, token, name } = json.app;
                await new ShortIds({ short, type, status: 1 }).save();
                const url = `https://download.fir.im/apps/${id}/install?download_token=${token}&release_id=${id}`;
                const filename = `${name}-${short}`;
                if (type === 'ios') {
                    const xml = await Axios.get(url).then(res => res.data);
                    const matched = xml.match(/<!\[CDATA\[([^\]]+\?auth_key=[^\]]+)/);
                    if (matched) {
                        await download('ipa', matched[1], 'ipa', filename);
                        max--;
                        console.log('ipa', short, 'success.');
                    }
                } else {
                    await download('apk', url, 'apk', filename);
                    console.log('apk', short, 'success.');
                }
            } else {
                await new ShortIds({ short, type, status: 0 }).save();
            }
        } catch (err) {
            await new ShortIds({ short: shortId, type: '', status: 0 }).save();
            console.log(count++, shortId, err.message);
        }
        await sleep(1);
    }
    console.log('finished.');
})();