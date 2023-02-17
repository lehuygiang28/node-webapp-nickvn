/***
 * Change the layout of handlerbars templates
 *
 * Switches layout between default and admin
 *
 * If is admin controller @returns admin layout,
 *
 * Otherwise @returns default layout
 * @returns {object} res.locals.layout
 */
function changeLayoutMiddleware(_req, res, next) {
    if (_req.originalUrl.length > 1 && _req.originalUrl) {
        let stringPath = _req.originalUrl.toString();
        let controller = stringPath.split('/')[1].toString().toLowerCase();

        switch (controller) {
            case 'admin':
                res.locals.layout = 'admin';
                break;
            case 'user_test':
                break;
            case 'example_test':
                break;
            default:
                res.locals.layout = 'main';
                break;
        }
    }

    next();
}

module.exports = {
    changeLayoutMiddleware,
};
