/**
 * The admin user is stored in the request.adminUser property
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns Redirect to login page if not already logged in, otherwise next();
 */
function isAdmin(req, res, next) {
    let nonCheck = ['/login', '/signout'];

    if(req.path === nonCheck[0] && req.session.adminUser){
        return res.redirect('/admin');
    }

    if(nonCheck.includes(req.path)) return next();

    if (!req.session.adminUser) {
        return res.redirect('/admin/login');
    }
    next();
}

module.exports = { isAdmin };
