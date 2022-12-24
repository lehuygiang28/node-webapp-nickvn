const bcrypt = require('bcrypt');
const saltRounds = 5;

module.exports = {
    createHash: function (stringToHash) {
        return bcrypt.hashSync(stringToHash, bcrypt.genSaltSync(saltRounds), null)
    }
}