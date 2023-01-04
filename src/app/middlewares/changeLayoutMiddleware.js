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
        let layout = { layout: 'main' };
        let stringPath = _req.originalUrl.toString();
        let controller = stringPath.split('/')[1];

        // console.log(_req.originalUrl);
        // console.log(`Controller: ${controller}`);

        switch (controller) {
            case 'admin':
                layout.layout = 'admin';
                break;
            default:
                layout.layout = 'main';
                // layout = { layout: 'main' }
                break;
        }
        // Object.assign(res.locals.layout = {}, layout);
        res.locals.layout = layout;
        // console.log(res.locals.layout);
    }
    
    next();
}

module.exports = {
    changeLayoutMiddleware,
};