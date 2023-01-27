const { resetProductAndUserPuchased } = require('../../src/util/project_extensions');
const User = require('../../src/app/models/User');
const userInfo = require('../fixtures/user.json');
const db = require('../../src/config/db');

async function resetDatabase(on, config) {
    // resetProductAndUserPuchased();
    // await User.deleteMany({});
    // let userNoMoney = new User();
    // let userMoney = new User();
    // Object.assign(userMoney, userInfo.user_with_money);
    // Object.assign(userNoMoney, userInfo.user_without_money);
    // await userNoMoney.save();
    // await userMoney.save();
}

module.exports = { resetDatabase };
