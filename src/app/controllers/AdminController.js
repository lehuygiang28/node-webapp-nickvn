const { logger } = require('../../util/logger');
const { mongooseToObject, mutipleMongooseToObject } = require('../../util/mongoose');


class AdminController {

    index(req, res, next) {
        res.render('admin/index', res.locals.layout);
    }

}

module.exports = new AdminController;