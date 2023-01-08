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

/***
 * Compare the data not encrypted with the encrypted data
 * 
 * @param data — The data to be encrypted.
 * @param encrypted — The data to be compared against.
 * @return — A promise to be either resolved with the comparison result salt or rejected with an Error
 * 
 */
function compare(data, encrypted, callbackfn){
    return bcrypt.compare(data, encrypted, callbackfn, saltRounds);
}

/***
 * Compare the data not encrypted with the encrypted data
 * 
 * @param data — The data to be encrypted.
 * @param encrypted — The data to be compared against.
 * @return — True if the data is equal to the encrypted data, otherwise false.
 * 
 */
function compareSync(data, encrypted){
    return bcrypt.compareSync(data, encrypted, saltRounds);
}


module.exports = {
    createHash,
    compare,
    compareSync
}