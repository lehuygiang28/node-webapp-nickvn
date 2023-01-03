const siteRouter = require('./site.route');
const lienMinhsRouter = require('./lien-minh.route');
const userRouter = require('./user.route');
const adminRouter = require('./admin.route');

function route(app) {

    app.use('/admin', adminRouter);
    app.use('/user', userRouter);
    app.use('/lien-minh', lienMinhsRouter);
    app.use('/', siteRouter);

}

module.exports = route;