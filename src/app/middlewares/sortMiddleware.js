/***
 * The middleware is valid query string parameters and assigned to the response
 * @param _req Request
 * @param res Response
 * @param next Next handler
 * 
 * Assigned query string parameters to res.locals._sort
 */
function sortMiddleware(_req, res, next) {

    res.locals._sort = {
        enabled: false,
        sort_price: 'asc',
    };

    if (_req.query.hasOwnProperty('_sort')) {
        Object.assign(res.locals._sort, {
            enabled: true,
            sort_price: ['asc', 'desc'].includes(_req.query.sort_price) ? _req.query.sort_price : 'asc',
            price: [1, 2, 3, 4, 5, 6, 7].includes(_req.query.price) ? _req.query.price : undefined,
            search_key: _req.query.search_key ? String(_req.query.search_key) : undefined,
            product_id: !(isNaN(_req.query.product_id)) ? _req.query.product_id : undefined,
        });
    }

    next();
}

module.exports = { sortMiddleware };