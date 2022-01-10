const crypto = require('crypto');
const config = require('../config');
/**
 * hash method
 *
 * @param {String} e.g.: 'md5', 'sha1'
 * @param {String|Buffer} s
 * @param {String} [format] 'hex'，'base64'. default is 'hex'.
 *@ return {string} encoded value
 * @private
 */
const hash = (method, s, format) => {
    const salt = config.code || '';
    s = s + ":" + salt;
    let sum = crypto.createHash(method);
    let isBuffer = Buffer.isBuffer(s);
    if(!isBuffer && typeof s === 'object') {
        s = JSON.stringify(sortObject(s));
    }
    sum.update(s, isBuffer ? 'binary' : 'utf8');
    return sum.digest(format || 'hex');
};

/**
 - MD5 coding
 -  3. @param {String|Buffer} s
 - @param {String} [format] 'hex'，'base64'. default is 'hex'.
 - @return {String} md5 hash string
 - @public
 */
const md5 = (s, format) => {
    return hash('md5', s, format);
};

// const createToken = () => {
//     return token
// }
module.exports = {
    md5
    // createToken,
    // decodeToken
};
