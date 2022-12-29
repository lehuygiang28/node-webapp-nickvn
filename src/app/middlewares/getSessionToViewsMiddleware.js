/***
 * Get session to views
 * @param _req Request
 * @param res Response
 * @param next Next handler
 * 
 * Set res.locals.session to _req.session then next()
 */
function getSessionToViewsMiddleware(_req, res, next) {
    res.locals.session = _req.session;
    next();
}

module.exports = { getSessionToViewsMiddleware };