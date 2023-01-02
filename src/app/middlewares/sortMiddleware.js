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
        let min;
        let max;
        if ([1, 2, 3, 4, 5, 6, 7].includes(Number(_req.query.price))) {
            switch (Number(_req.query.price)) {
                case 1:
                    min = 0;
                    max = 50000;
                    break;
                case 2:
                    min = 50000;
                    max = 200000;
                    break;
                case 3:
                    min = 200000;
                    max = 500000;
                    break;
                case 4:
                    min = 500000;
                    max = 1000000;
                    break;
                case 5:
                    min = 1000000;
                    max = 99999999999;
                    break;
                case 6:
                    min = 5000000;
                    max = 99999999999;
                    break;
                case 7:
                    min = 10000000;
                    max = 99999999999;
                    break;
                default:
                    min = max = undefined;
                    break;
            }
        }

        Object.assign(res.locals._sort, {
            enabled: true,
            sort_price: ['asc', 'desc'].includes(_req.query.sort_price) ? _req.query.sort_price : 'asc',
            search_key: _req.query.search_key ? String(_req.query.search_key) : undefined,
            product_id: _req.query.product_id && !isNaN(_req.query.product_id) ? Number(_req.query.product_id) : undefined,
            min: min,
            max: max,
        });
    }

    next();
}

module.exports = { sortMiddleware };