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

/**
 * 插入数据
 */

const insertData = async (ctx, table, data) => {
  const keyArr = []
  const valArr = []
  const now = new Date().toLocaleString()
  data.add_time = now
  for (let key in data) {
    keyArr.push(key)
    valArr.push(data[key])
  }


  const [rows, fields] = await ctx.db.execute(`INSERT INTO ${table} (${keyArr.join(', ')}) VALUES(${new Array(keyArr.length).fill('?').join(',')})`, valArr)
  return rows
}

// const createToken = () => {
//     return token
// }
module.exports = {
    md5,
    insertData
    // createToken,
    // decodeToken
};
