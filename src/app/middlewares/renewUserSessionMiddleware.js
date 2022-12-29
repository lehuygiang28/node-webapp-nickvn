const User = require('../models/User');
const { logger } = require('../../util/logger');

/***
 * This middleware will renew the session of the user if found, otherwise destroy the wrong session
 * @param _req Request
 * @param res Response
 * @param next Next handler
 * 
 * Assign session to _req.session.User
 */
function renewUserSessionMiddleware(_req, res, next) {

    if (!_req.session.User) {
        logger.info('Session not created!');
        return next();
    } else {
        User.findById(_req.session.User._id)
            .then((user) => {
                if (!user) {
                    logger.info('User session not found, destroy session!');
                    _req.session.User.destroy();
                    return next();
                } else {
                    logger.info(`Get session completed userName: ${_req.session.User.userName}`);
                    Object.assign(_req.session.User, {
                        _id: user._id,
                        userName: user.userName,
                        money: user.money,
                        role: user.role
                    })
                    logger.info(`Set session completed userName: ${_req.session.User.userName}`);
                }
            })
            .catch(next);
    }

    next();
}

module.exports = { renewUserSessionMiddleware };