const User = require('../models/User');
const { logger } = require('../../util/logger');

function renewUserSession(_req, res, next) {

    if (!_req.session.User) {
        // console.log('Session not created');
        logger.info('Session not created');
        return next();
    }
    logger.info(`Get session completed userName: ${_req.session.User.userName}`);
    User.findById(_req.session.User._id)
        .then((user) => {
            // _req.session.User = {
            //     _id: user._id,
            //     userName: user.userName,
            //     money: user.money,
            //     role: user.role
            // }
            Object.assign(_req.session.User, {
                _id: user._id,
                userName: user.userName,
                money: user.money,
                role: user.role
            })
            logger.info(`Set session completed userName: ${_req.session.User.userName}`);
        }).catch(next);

    next();
}

module.exports = { renewUserSession };