/**
 * The admin user is stored in the request.adminUser property
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns Redirect to login page if not already logged in, otherwise next();
 */
function isAdmin(req, res, next) {
    let nonCheckSites = ['/login', '/signout'];
    let nonCheckFeatures = ['/change-visible'];

    /**
     * If the request is not authenticated, return error
     */
    if(req.originalUrl.includes(nonCheckFeatures) && !req.session.adminUser){
        return res.json({error: 'You not allowed to access this page'});
    }

    /**
     * If request is login site, return login page
     */
    if(req.path === nonCheckSites[0] && req.session.adminUser){
        return res.redirect('/admin');
    }

    /**
     * If request is include non check sites, next() will return
     */
    if(nonCheckSites.includes(req.path)) return next();

    /**
     * Require admin authen, if not return login page
     */
    if (!req.session.adminUser) {
        return res.redirect('/admin/login');
    }
    next();
}

module.exports = { isAdmin };
