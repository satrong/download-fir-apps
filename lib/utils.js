/**
 * 十进制转62进制
 * @param {Number} number 十进制的值
 * @return {String} 返回62进制的值
 */
exports.string10to62 = number => {
    const chars = '0123456789abcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ'.split('');
    const radix = chars.length;
    let qutient = +number;
    const arr = [];
    do {
        const mod = qutient % radix;
        qutient = (qutient - mod) / radix;
        arr.unshift(chars[mod]);
    } while (qutient);
    return arr.join('');
};

/**
 * GUID
 * @param {Number} max 生成guid的长度
 * @return {string} 返回GUID
 */
exports.GUID = max => {
    function rnd() {
        return exports.string10to62(Math.floor(Math.random() * 65536));
    }

    max = max || 40;
    let str = '';
    for (let i = 0; i < (max / 3) + 1; i++) {
        str += rnd();
    }
    return str.substring(0, max);
};

/**
 * 生成shortID
 * @param {MongooseModel} model mongooseModel
 * @param {String} key 查找字段名
 * @param {Number} len 生成的id长度
 * @return {String} shortid
 */
exports.getShortId = async (model, key = 'apps.shortId', len = 4) => {
    let guid;
    let i = true;
    while (i) {
        guid = exports.GUID(len);
        const result = await model.findOne({ [key]: guid }).select({ _id: true });
        i = !!result;
    }
    return guid;
};