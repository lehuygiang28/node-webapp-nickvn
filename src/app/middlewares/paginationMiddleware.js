/***
 * The middleware is valid query string parameters and assigned to the response for pagination
 * @param _req Request
 * @param res Response
 * @param next Next handler
 * 
 * Assigned query string parameters to res.locals._sort
 */
function paginationMiddleware(_req, res, next) {

    res.locals._pagination = {
        enabled: false,
    };
    // console.log(_req.query);
    let per_page;
    let page;

    if (!_req.query.hasOwnProperty('page')) {
        page = 1;
    } else {
        /***
         * Return the page if is number and if page greater than 1
         * Otherwise return 1
         */
        if (isNaN(_req.query.page)) {
            page = 1;
        } else {
            page = Number(_req.query.page);
            if (page < 1) {
                page = 1;
            }
        }
    }

    /***
     * Return the per_page if is number and if  1 <= per_page <= 12
     * Otherwise return 12
     */
    if (isNaN(_req.query.per_page)) {
        per_page = 12;
    } else {
        per_page = Number(_req.query.per_page);
        if (per_page < 1 || per_page > 12) {
            per_page = 12;
        }
    }

    Object.assign(res.locals._pagination, {
        enabled: true,
        per_page: per_page,
        page: page,
    });
    // console.log(res.locals._pagination);


    next();
}

module.exports = { paginationMiddleware };