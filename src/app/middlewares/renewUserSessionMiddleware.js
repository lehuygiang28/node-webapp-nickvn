const User = require('../models/User');

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
        next();
    }
    User.findById(_req.session.User._id)
        .then((user) => {
            if (!user) {
                _req.session.destroy();
                return next();
            } else {
                Object.assign(_req.session.User, {
                    _id: user._id,
                    userName: user.userName,
                    money: user.money,
                    role: user.role,
                });
            }
        })
        .catch(next);
    next();
}

module.exports = {
    renewUserSessionMiddleware,
};
