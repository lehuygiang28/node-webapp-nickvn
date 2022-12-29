const bcrypt = require('bcrypt');
const saltRounds = 5;

/***
 * Encrypt data using bcrypt with a salt rounds 5
 * @param data The data to be encrypted.
 * @returns {string} The encrypted data
 */
function createHash(data) {
    return bcrypt.hashSync(data, bcrypt.genSaltSync(saltRounds), null)
}

function compare(a, b, callbackfn){
    return bcrypt.compare(a, b, callbackfn, saltRounds);
}

module.exports = {
    createHash,
    compare
}