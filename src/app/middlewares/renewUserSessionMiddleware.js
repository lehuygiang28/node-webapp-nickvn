const logger = require('../../util/logger');
const User = require('../models/User');

/***
 * This middleware will renew the session of the user if found, otherwise destroy the wrong session
 * @param _req Request
 * @param res Response
 * @param next Next handler
 *
 * Assign session to _req.session.User
 */
async function renewUserSessionMiddleware(_req, res, next) {
    if (!_req.session.User || !_req.session.User._id) {
        return next();
    }
    
    let user = await User.findById(_req.session.User._id);
    if (!user) {
        _req.session.destroy();
        return next();
    }
    Object.assign(_req.session.User, {
        _id: user._id,
        userName: user.userName,
        money: user.money,
        role: user.role,
    });

    next();
}

module.exports = {
    renewUserSessionMiddleware,
};
