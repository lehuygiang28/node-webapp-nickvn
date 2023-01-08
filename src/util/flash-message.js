const { logger } = require('./logger');

/***
 * Set message to request.session.sessionFlash
 * @param {object} message Object to send a message to views with session
 *
 * Struct Object:
 *
 * {error: true || false, success: true || false, message: '{string message}'}
 *
 */
function sendMessage(_req, res, next, message) {
    try {
        if (!message) {
            return;
        }

        _req.session.sessionFlash = {
            error: message.error || undefined,
            success: message.success || undefined,
        };

        if (process.env.NODE_ENV !== 'test')
            logger.color('magenta').log(`sendMessage.message: ${message.error ?? message.success}`);

        return;
    } catch (err) {
        next();
    }
}

module.exports = {
    sendMessage,
};
