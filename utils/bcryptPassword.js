var bcrypt = require('bcrypt');
var Promise = require('bluebird');
Promise.promisifyAll(bcrypt);
const saltRound = 10;
/**
 * 加盐加密
 * [@param](/user/param) password {string} 原始密码
 * [@return](/user/return) hash {object} 加密密码
 * [@author](/user/author) gh
 */
var encrypt = async function(password) {
    var salt = await bcrypt.genSaltAsync(saltRound);
    var hash = await bcrypt.hashAsync(password, salt);
    return hash;
};
/**
 * 密码对比
 * [@param](/user/param) password {string} 原始密码
 * [@param](/user/param) hash {string} 加密密码
 * [@return](/user/return) res {boolean} 比对结果 true:密码匹配 | false:密码不匹配
 * [@author](/user/author) gh
 */
var validate = async function(password, hash) {
    var res = await bcrypt.compareAsync(password, hash);
    return res
};
module.exports = {
    encrypt,
    validate
}