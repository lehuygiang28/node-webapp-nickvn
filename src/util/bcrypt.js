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

module.exports = {
    createHash
}