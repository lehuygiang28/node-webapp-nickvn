// Custom flash middleware -- from Ethan Brown's book, 'Web Development with Node & Express'
/***
 * Custom flash middleware
 * @param _req Request
 * @param res Response
 * @param next Next handler
 * 
 * Set res.locals.sessionFlash to _req.session.sessionFlash then delete this request session
 */
function customSessionFlashMiddleware(_req, res, next) {
    // if there's a flash message in the session request, make it available in the response, then delete it
    res.locals.sessionFlash = _req.session.sessionFlash;
    delete _req.session.sessionFlash;
    next();
}

module.exports = { customSessionFlashMiddleware };